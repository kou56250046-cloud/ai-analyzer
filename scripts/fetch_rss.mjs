/* =========================================================================
   fetch_rss.mjs — 各AIの公式RSS/Atomから「見出し・リンク・日付」を収集する。
   - 外部AIは一切使わない（＝無料・課金リスク0）。
   - 依存パッケージなし（Node 18+ の組み込み fetch を使用）。
   - 取得結果は data/news_inbox.json に「未処理」として保存。
     → 重要なものを選んで data/js/data.js の NEWS に要約付きで追記する運用。
   実行: node scripts/fetch_rss.mjs
   ========================================================================= */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const FEEDS_PATH = new URL('../data/feeds.json', import.meta.url);
const OUT_PATH = new URL('../data/news_inbox.json', import.meta.url);

function pick(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!m) return '';
  return m[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .trim();
}
function pickLink(xml) {
  // RSS: <link>url</link> / Atom: <link href="url"/>
  const a = xml.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (a) return a[1];
  const r = xml.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
  return r ? r[1].trim() : '';
}
function parseItems(xml) {
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/\1>/gi) || [];
  return blocks.map((b) => ({
    title: pick(b, 'title'),
    url: pickLink(b),
    date: (pick(b, 'pubDate') || pick(b, 'updated') || pick(b, 'published') || '').slice(0, 33),
  })).filter((i) => i.title);
}

async function main() {
  if (!existsSync(new URL('../data/feeds.json', import.meta.url))) {
    console.error('data/feeds.json が見つかりません。');
    process.exit(1);
  }
  const feeds = JSON.parse(await readFile(FEEDS_PATH, 'utf8'));
  const collected = [];

  for (const f of feeds) {
    if (!f.url || f.url.startsWith('TODO')) { console.log(`skip (URL未設定): ${f.tool}`); continue; }
    try {
      const res = await fetch(f.url, { headers: { 'User-Agent': 'ai-tool-analysis-bot' } });
      if (!res.ok) { console.log(`skip (${res.status}): ${f.tool}`); continue; }
      const xml = await res.text();
      const items = parseItems(xml).slice(0, f.max || 5);
      items.forEach((it) => collected.push({ tool: f.tool, ...it, status: '未処理' }));
      console.log(`ok: ${f.tool} (+${items.length})`);
    } catch (e) {
      console.log(`error: ${f.tool} — ${e.message}`);
    }
  }

  const out = { fetched_at: new Date().toISOString().slice(0, 10), count: collected.length, items: collected };
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`\n書き出し: data/news_inbox.json (${collected.length}件)`);
}

main();

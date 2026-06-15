/* =========================================================================
   generate_feed.mjs — data/news-data.js から RSS 2.0 フィードを生成する。
   実行: node scripts/generate_feed.mjs
   出力: feed.xml（サイトルート）
   ========================================================================= */
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT  = path.resolve(__dir, '..');

// news-data.js を動的インポート（ES Module）
const { NEWS } = await import(path.join(ROOT, 'data', 'news-data.js'));

// package.json から homepage を読もうとするが、なければデフォルトを使う
let SITE_URL = 'https://kou56250046-cloud.github.io/AI-analyzer';
try {
  const pkg = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8'));
  if (pkg.homepage) SITE_URL = pkg.homepage.replace(/\/$/, '');
} catch {
  /* package.json がなければスキップ */
}

const FEED_TITLE = 'AIツール分析 — 最新アップデート';
const FEED_DESC  = '生成AI・AIエージェントの最新アップデートを随時配信。新機能・料金変更・連携情報など。';

function xmlEsc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRFC822(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

const items = NEWS.map((n) => {
  const link = /^https?:\/\//i.test(String(n.url ?? '')) ? n.url : SITE_URL;
  return `
  <item>
    <title><![CDATA[${n.tool}: ${n.title}]]></title>
    <link>${xmlEsc(link)}</link>
    <description><![CDATA[${n.summary}]]></description>
    <category>${xmlEsc(n.category ?? 'update')}</category>
    <pubDate>${toRFC822(n.date)}</pubDate>
    <guid isPermaLink="false">${xmlEsc(link)}-${xmlEsc(n.date)}</guid>
  </item>`;
}).join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlEsc(FEED_TITLE)}</title>
    <link>${xmlEsc(SITE_URL)}</link>
    <description>${xmlEsc(FEED_DESC)}</description>
    <language>ja</language>
    <atom:link href="${xmlEsc(SITE_URL)}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>1440</ttl>
    ${items}
  </channel>
</rss>`;

const outPath = path.join(ROOT, 'feed.xml');
await writeFile(outPath, xml, 'utf8');
console.log(`feed.xml を生成しました (${NEWS.length} 件) → ${outPath}`);

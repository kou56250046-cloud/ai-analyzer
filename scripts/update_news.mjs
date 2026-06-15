#!/usr/bin/env node
/**
 * update_news.mjs — data/news_inbox.json を整形して data/news-data.js に書き出す
 * AI不使用。RSS description フィールドをそのまま summary として使用。
 * GitHub Actions から自動実行（月・木 08:00 JST）。
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── ISO 週番号を計算 ────────────────────────────────────────────────────
function getISOWeek(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  const wn = 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  return `${d.getFullYear()}-W${String(wn).padStart(2, '0')}`;
}

// ── カテゴリをキーワードで自動判定 ───────────────────────────────────────
const CATEGORY_PATTERNS = [
  { re: /pric|料金|値段|値下|値上|plan|tier|subscription|課金/i,  cat: 'pricing' },
  { re: /integrat|連携|API|webhook|plugin|プラグイン/i,           cat: 'integration' },
  { re: /deprecat|廃止|終了|sunset|discontinu/i,                  cat: 'deprecation' },
  { re: /new|launch|release|リリース|発表|追加|機能|feature/i,    cat: 'new_feature' },
];
function detectCategory(title) {
  for (const { re, cat } of CATEGORY_PATTERNS) {
    if (re.test(title)) return cat;
  }
  return 'update';
}

// ── メイン ───────────────────────────────────────────────────────────────
const inboxPath = join(ROOT, 'data/news_inbox.json');
let inbox;
try {
  inbox = JSON.parse(readFileSync(inboxPath, 'utf-8'));
} catch {
  console.error('data/news_inbox.json が読み込めません');
  process.exit(1);
}

if (!inbox.items?.length) {
  console.log('news_inbox.json に記事がありません。スキップします。');
  process.exit(0);
}

// 日付の新しい順に並べて上位10件を取得
const items = [...inbox.items]
  .filter((i) => i.date)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 10);

const news = items.map((item) => ({
  week:     getISOWeek(item.date),
  date:     item.date.slice(0, 10),
  tool:     item.tool || 'AI',
  category: detectCategory(item.title),
  title:    item.title,
  summary:  item.description || item.title,
  url:      item.url,
}));

// data/news-data.js を書き出す
const today = new Date().toISOString().slice(0, 10);
const json  = JSON.stringify(news, null, 2);
const output = `// 自動生成 — ${today} (update_news.mjs) 手動編集不要
export const NEWS = ${json};
`;

writeFileSync(join(ROOT, 'data/news-data.js'), output, 'utf-8');
console.log(`✓ data/news-data.js を更新 (${news.length}件)`);

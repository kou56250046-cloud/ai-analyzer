# プロジェクト設定

## 概要

生成AI・AIエージェントの「特徴・使い分け・組み合わせ・最新動向」を一元的にまとめる、デザイン重視・**課金リスク0**の静的サイト。ビルド不要のHTML/CSS/JSで、GitHub Pages に置くだけで動く。

## スタック

- **フロントエンド**: バニラHTML / CSS / JavaScript (ES Modules)
- **チャート**: Chart.js (CDN)
- **デプロイ**: GitHub Pages
- **自動化**: GitHub Actions（週次RSS収集）
- **フレームワーク**: なし（ビルドステップなし）
- **外部AI API**: 使用しない（課金リスク0）

## ファイル構成

```
.
├─ index.html                         … サイト本体（基本的に触らない）
├─ assets/
│   ├─ css/styles.css                 … デザイン
│   └─ js/
│       ├─ data.js                    … ★コンテンツ更新はここだけ
│       └─ app.js                     … 描画・グラフ・操作ロジック
├─ scripts/fetch_rss.mjs              … RSS見出し収集スクリプト
├─ data/
│   ├─ feeds.json                     … 収集対象RSS一覧
│   └─ news_inbox.json                … 収集結果（自動生成）
└─ .github/workflows/weekly-update.yml … 週次自動収集
```

## 開発サーバーの起動

ES Modules のためファイルを直接ダブルクリックしても動かない。簡易サーバーで起動する：

```bash
python3 -m http.server 8000
# または
npx serve .
```

`http://localhost:8000` で確認。

## コンテンツ更新ルール

**すべて `assets/js/data.js` を編集するだけ**（HTML・app.jsは触らない）。

| 更新内容 | 編集箇所 | 備考 |
|---------|---------|------|
| ツール追加・編集 | `TOOLS_RAW` | `scores`（6軸）・`caps`（9能力）・`fit`（10用途）は有料プラン基準 |
| 無料プランの差分 | `freeAdjust` | 有料から下がる項目のみマイナス値で記入 |
| ニュース追記 | `NEWS` | `{ date, tool, category, title, summary, url }` |
| 用途カテゴリ | `CATEGORIES.社内 / .個人` | |
| ワークフロー | `WORKFLOWS` | |

`NEWS.category` の値: `new_feature / update / pricing / integration / deprecation`

## 最新ニュースの半自動更新フロー

1. `data/feeds.json` にRSS URLを設定
2. GitHub Actions が毎週月曜に見出し・リンク・日付を `data/news_inbox.json` に収集
3. 収集結果を見ながら Claude Code CLI で要約・カテゴリ分けし、`data.js` の `NEWS` に追記してコミット

手動収集：
```bash
node scripts/fetch_rss.mjs
```

## GitHub Pages 公開手順

1. 公開リポジトリとして push
2. Settings → Pages → Source: 「Deploy from a branch」、ブランチ: `main` / root
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開

## 利用可能な MCP ツール

このプロジェクトはバックエンドレスだが、以下のMCPは有用：

| サービス | MCP | 主な用途 |
|---------|-----|---------|
| GitHub | `mcp__github__*` | リポジトリ・PR・Issue・Actionsワークフロー管理 |

Supabase・Stripe・Cloudflare R2・Vercelは**このプロジェクトでは使用しない**。

## コーディング規約

- バニラJS（TypeScript不使用）
- `data.js` と `app.js` の責務を分離する（データと描画ロジックを混在させない）
- スコアはすべて主観評価であることをサイト上に明記済み
- 外部APIキー・課金口座は不要な設計を維持する

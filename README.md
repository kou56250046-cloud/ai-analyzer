# AIツール分析

生成AI・AIエージェントの「特徴・使い分け・組み合わせ・最新動向」を一元的にまとめる、デザイン重視・**課金リスク0**の静的サイトです。ビルド不要のHTML/CSS/JSで、GitHub Pages に置くだけで動きます。

## 何ができるか
- **比較コンソール**：能力タグ（長文生成・コーディング 等）を切り替えると、AIランキングがアニメーションで並び替わる。無料/有料プランの切替に連動。
- **用途から探す**：社内・業務／個人の用途別に、向いているAIを表示。
- **ツール図鑑**：12ツールの個別カード。タップで無料/有料プランの違い＋6軸レーダーチャート。
- **適性マップ**：用途 × ツールのヒートマップ（プラン切替連動）。
- **最新アップデート**：新機能/アップデート/料金/連携/廃止をカテゴリ別に。
- **組み合わせ・ワークフロー**：複数AIを繋げて使うレシピ集。

## ファイル構成
```
.
├─ index.html                    … サイト本体
├─ assets/
│   ├─ css/styles.css            … デザイン
│   └─ js/
│       ├─ data.js               … ★ここを編集すれば内容が更新される
│       └─ app.js                … 描画・グラフ・操作
├─ scripts/fetch_rss.mjs         … RSS見出し収集（外部AI不使用）
├─ data/
│   ├─ feeds.json                … 収集対象RSS一覧（URLを設定）
│   └─ news_inbox.json           … 収集結果（自動生成）
└─ .github/workflows/weekly-update.yml … 週次の自動収集
```

## ローカルで開く
`index.html` は ES Modules を使うため、ファイルを直接ダブルクリックすると一部ブラウザで動きません。簡易サーバーで開いてください。
```bash
# どちらでもOK
python3 -m http.server 8000
# または
npx serve .
```
ブラウザで `http://localhost:8000` を開く。

## 内容の更新（普段の運用）
すべて `assets/js/data.js` を編集するだけです（HTMLは触らない）。
- **ツールの追加/編集**：`TOOLS_RAW` に1件追加。`scores`（6軸）・`caps`（9能力）・`fit`（10用途）は有料プラン基準で記入し、無料で下がる項目だけ `freeAdjust` に差分（マイナス）を書く。コスパは無料の方が高いので `cost: +1〜+2`。
- **ニュースの追記**：`NEWS` 配列に `{ date, tool, category, title, summary, url }` を追加。`category` は `new_feature / update / pricing / integration / deprecation`。
- **用途カテゴリ**：`CATEGORIES.社内 / .個人` を編集。
- **ワークフロー**：`WORKFLOWS` を編集。

> スコアはすべて主観評価です。サイト上にもその旨を明記しています。

## 最新ニュースの半自動更新（課金リスク0）
1. `data/feeds.json` に各AI公式ブログのRSS URLを設定（`TODO` を実URLに）。
2. GitHub Actions が毎週月曜にRSSの**見出し・リンク・日付だけ**を収集し、`data/news_inbox.json` に保存（**外部AI不使用＝無料・課金なし**）。
3. その見出しを見ながら、重要な更新を **Claude Code CLI** で要約・カテゴリ分けし、`data.js` の `NEWS` に追記してコミット。

手動で収集を試すには：
```bash
node scripts/fetch_rss.mjs
```

## GitHub Pages への公開（手動）
1. このフォルダを **公開リポジトリ**として push（公開リポなら Actions も無料）。
2. リポジトリの Settings → Pages → Source を「Deploy from a branch」、ブランチを `main` / `root` に設定。
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開。

## メモ
- 外部AI APIを使わない設計のため、APIキー・課金口座は不要。想定外課金は構造的に発生しません。
- Chart.js は CDN から読み込みます（レーダーチャート用）。

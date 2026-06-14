/* =========================================================================
   AIツール分析 — データ定義（ここを編集すればサイトが更新されます）
   - スコアはすべて「主観評価（1〜5）」です。根拠コメントは note に。
   - 各ツールは paid（有料プランの実力）を基準値として記述し、
     freeAdjust で「無料プランだと下がる／上がる項目」だけ差分指定します。
     （無料/有料トグルはこの差分で切り替わります）
   ========================================================================= */

// 6軸レーダーのラベル
export const SCORE_LABELS = {
  quality: '品質', speed: '速度', cost: 'コスパ',
  usability: '使いやすさ', integration: '連携性', versatility: '多機能性',
};

// 横棒グラフ（能力タグ切替）の能力ラベル
export const CAP_LABELS = {
  long_text: '長文生成',
  coding: 'コーディング',
  image_understanding: '画像認識',
  realtime_search: 'リアルタイム検索',
  transcription: '音声・文字起こし',
  image_generation: '画像生成',
  japanese: '日本語の自然さ',
  agent: 'エージェント自律性',
  cost: 'コスパ',
};

// ヒートマップの用途（行）
export const USECASES = [
  { key: 'minutes',       name: '議事録',          scene: '社内' },
  { key: 'slides',        name: '資料・スライド',  scene: '社内' },
  { key: 'coding',        name: 'コーディング',    scene: '両方' },
  { key: 'transcription', name: '文字起こし',      scene: '両方' },
  { key: 'research',      name: 'リサーチ',        scene: '両方' },
  { key: 'writing',       name: '文章作成',        scene: '両方' },
  { key: 'data',          name: 'データ分析',      scene: '社内' },
  { key: 'translation',   name: '翻訳',            scene: '両方' },
  { key: 'image',         name: '画像生成',        scene: '個人' },
  { key: 'ideation',      name: 'アイデア出し',    scene: '両方' },
];

// 用途カテゴリ（社内 / 個人）
export const CATEGORIES = {
  社内: [
    { key: 'minutes',  name: '議事録・会議要約',   tools: ['notebooklm', 'otterai', 'microsoftcopilot', 'claude'] },
    { key: 'slides',   name: '資料・スライド作成', tools: ['gamma', 'microsoftcopilot', 'gemini', 'chatgpt'] },
    { key: 'docs',     name: '社内文書・マニュアル', tools: ['claude', 'microsoftcopilot', 'chatgpt', 'gemini'] },
    { key: 'mail',     name: 'メール・問い合わせ文', tools: ['microsoftcopilot', 'chatgpt', 'gemini', 'claude'] },
    { key: 'data',     name: 'データ集計・分析',   tools: ['gemini', 'chatgpt', 'microsoftcopilot', 'claude'] },
    { key: 'coding',   name: 'コーディング・開発', tools: ['githubcopilot', 'codex', 'antigravity', 'claude'] },
    { key: 'research', name: '市場・競合リサーチ', tools: ['perplexity', 'genspark', 'gemini', 'chatgpt'] },
    { key: 'trans',    name: '翻訳・多言語対応',   tools: ['chatgpt', 'gemini', 'claude', 'microsoftcopilot'] },
  ],
  個人: [
    { key: 'research', name: '調べもの・リサーチ', tools: ['perplexity', 'gemini', 'genspark', 'chatgpt'] },
    { key: 'writing',  name: '文章作成・添削',     tools: ['claude', 'chatgpt', 'gemini', 'microsoftcopilot'] },
    { key: 'study',    name: '学習・要約',         tools: ['notebooklm', 'claude', 'chatgpt', 'gemini'] },
    { key: 'voice',    name: '音声の文字起こし',   tools: ['otterai', 'notebooklm', 'gemini', 'microsoftcopilot'] },
    { key: 'image',    name: '画像・イラスト生成', tools: ['chatgpt', 'gemini', 'genspark', 'microsoftcopilot'] },
    { key: 'idea',     name: 'アイデア出し・壁打ち', tools: ['chatgpt', 'claude', 'gemini', 'genspark'] },
    { key: 'code',     name: 'プログラミング学習', tools: ['claude', 'chatgpt', 'githubcopilot', 'gemini'] },
    { key: 'slides',   name: '資料・スライド作成', tools: ['gamma', 'gemini', 'chatgpt', 'genspark'] },
  ],
};

// ---- ツール定義（paid基準 + freeAdjust差分）-------------------------------
const TOOLS_RAW = [
  {
    id: 'chatgpt', name: 'ChatGPT', vendor: 'OpenAI', type: '汎用チャット',
    scenes: ['社内', '個人'], tags: ['文章作成', 'コーディング', '汎用', '画像生成'],
    accent: 'cyan',
    summary: '文章・コード・画像まで幅広くこなす定番の汎用AI。拡張機能やエージェント機能も豊富。',
    free:  { plan: '無料プラン', note: '標準モデル中心。利用回数や高度機能に制限。' },
    paid:  { plan: '有料プラン', note: '最新・上位モデルと高度機能をフル活用できる。' },
    url: 'https://chatgpt.com',
    scores: { quality: 5, speed: 4, cost: 3, usability: 5, integration: 5, versatility: 5 },
    caps:   { long_text: 5, coding: 5, image_understanding: 5, realtime_search: 4, transcription: 3, image_generation: 5, japanese: 4, agent: 4, cost: 3 },
    fit:    { minutes: 4, slides: 3, coding: 5, transcription: 3, research: 4, writing: 5, data: 4, translation: 5, image: 5, ideation: 5 },
    freeAdjust: {
      scores: { quality: -1, speed: -1, cost: +2, versatility: -1 },
      caps:   { long_text: -1, coding: -1, image_generation: -2, realtime_search: -1, agent: -1, cost: +2 },
      fit:    { coding: -1, image: -2, data: -1 },
    },
  },
  {
    id: 'claude', name: 'Claude', vendor: 'Anthropic', type: '汎用チャット',
    scenes: ['社内', '個人'], tags: ['長文', '文章作成', 'コーディング', 'リサーチ'],
    accent: 'amber',
    summary: '長文読解と自然な文章作成、コーディングに強い対話型AI。日本語の表現が丁寧。',
    free:  { plan: '無料プラン', note: '回数・速度に制限。日常用途には十分。' },
    paid:  { plan: '有料プラン', note: '上位モデルで長文・コードの精度と量がさらに伸びる。' },
    url: 'https://claude.ai',
    scores: { quality: 5, speed: 4, cost: 3, usability: 5, integration: 4, versatility: 4 },
    caps:   { long_text: 5, coding: 5, image_understanding: 4, realtime_search: 2, transcription: 2, image_generation: 1, japanese: 5, agent: 4, cost: 3 },
    fit:    { minutes: 4, slides: 3, coding: 5, transcription: 2, research: 4, writing: 5, data: 4, translation: 5, image: 1, ideation: 5 },
    freeAdjust: {
      scores: { quality: -1, cost: +2 },
      caps:   { long_text: -1, coding: -1, agent: -1, cost: +2 },
      fit:    { coding: -1 },
    },
  },
  {
    id: 'gemini', name: 'Gemini', vendor: 'Google', type: '汎用チャット',
    scenes: ['社内', '個人'], tags: ['検索連携', 'マルチモーダル', 'データ分析'],
    accent: 'cyan',
    summary: '最新情報の検索連携とマルチモーダル処理に強み。長文・データ分析もこなす。',
    free:  { plan: '無料プラン', note: '日常利用に十分なモデルを無料で利用可。' },
    paid:  { plan: '有料プラン', note: '上位モデル・大容量処理・各種連携が解放。' },
    url: 'https://gemini.google.com',
    scores: { quality: 5, speed: 5, cost: 4, usability: 4, integration: 5, versatility: 5 },
    caps:   { long_text: 5, coding: 4, image_understanding: 5, realtime_search: 5, transcription: 3, image_generation: 4, japanese: 4, agent: 4, cost: 4 },
    fit:    { minutes: 4, slides: 3, coding: 4, transcription: 3, research: 5, writing: 4, data: 5, translation: 5, image: 4, ideation: 4 },
    freeAdjust: {
      scores: { quality: -1, cost: +1 },
      caps:   { long_text: -1, image_generation: -1, cost: +1 },
      fit:    {},
    },
  },
  {
    id: 'perplexity', name: 'Perplexity', vendor: 'Perplexity AI', type: 'リサーチ',
    scenes: ['社内', '個人'], tags: ['情報収集', '出典付き回答', '検索'],
    accent: 'cyan',
    summary: '出典付きで回答する「答えを返す検索エンジン」。最新情報の調べものに最適。',
    free:  { plan: '無料プラン', note: '通常検索は無料。高度モデルの利用に制限。' },
    paid:  { plan: '有料プラン', note: '高度モデルや詳細リサーチ機能が解放。' },
    url: 'https://www.perplexity.ai',
    scores: { quality: 4, speed: 5, cost: 4, usability: 5, integration: 3, versatility: 3 },
    caps:   { long_text: 3, coding: 2, image_understanding: 3, realtime_search: 5, transcription: 1, image_generation: 1, japanese: 4, agent: 3, cost: 4 },
    fit:    { minutes: 2, slides: 2, coding: 2, transcription: 1, research: 5, writing: 3, data: 3, translation: 4, image: 1, ideation: 3 },
    freeAdjust: {
      scores: { quality: -1, cost: +1 },
      caps:   { realtime_search: -1, long_text: -1, cost: +1 },
      fit:    { research: -1 },
    },
  },
  {
    id: 'notebooklm', name: 'NotebookLM', vendor: 'Google', type: 'リサーチ／要約',
    scenes: ['社内', '個人'], tags: ['資料読み込み', '要約', '音声要約'],
    accent: 'cyan',
    summary: '自分の資料を読み込ませて要約・質問できる。音声概要の生成も得意。',
    free:  { plan: '無料プラン', note: '中心機能を無料で利用可。' },
    paid:  { plan: '上位プラン', note: '容量・上限が拡張される。' },
    url: 'https://notebooklm.google.com',
    scores: { quality: 4, speed: 4, cost: 5, usability: 4, integration: 2, versatility: 3 },
    caps:   { long_text: 4, coding: 1, image_understanding: 3, realtime_search: 2, transcription: 4, image_generation: 1, japanese: 4, agent: 2, cost: 5 },
    fit:    { minutes: 5, slides: 2, coding: 1, transcription: 4, research: 5, writing: 3, data: 3, translation: 3, image: 1, ideation: 3 },
    freeAdjust: { scores: {}, caps: {}, fit: {} },
  },
  {
    id: 'genspark', name: 'Genspark', vendor: 'Genspark', type: 'エージェント',
    scenes: ['社内', '個人'], tags: ['自動リサーチ', '成果物生成', 'エージェント'],
    accent: 'amber',
    summary: '指示を出すと自律的に調べて成果物まで作るAIエージェント。リサーチ起点の作業に。',
    free:  { plan: '無料プラン', note: 'お試し枠あり。実行回数に制限。' },
    paid:  { plan: '有料プラン', note: '実行枠が拡大し本格運用しやすい。' },
    url: 'https://www.genspark.ai',
    scores: { quality: 4, speed: 3, cost: 3, usability: 4, integration: 4, versatility: 5 },
    caps:   { long_text: 4, coding: 3, image_understanding: 4, realtime_search: 5, transcription: 2, image_generation: 4, japanese: 4, agent: 5, cost: 3 },
    fit:    { minutes: 3, slides: 4, coding: 3, transcription: 2, research: 5, writing: 4, data: 4, translation: 4, image: 4, ideation: 4 },
    freeAdjust: {
      scores: { quality: -1, cost: +1 },
      caps:   { agent: -1, cost: +1 },
      fit:    {},
    },
  },
  {
    id: 'githubcopilot', name: 'GitHub Copilot', vendor: 'GitHub / Microsoft', type: 'コーディング',
    scenes: ['社内'], tags: ['コード補完', '開発支援', 'IDE'],
    accent: 'cyan',
    summary: 'エディタ内でコードを補完・提案する開発者向け定番ツール。日々の実装を高速化。',
    free:  { plan: '無料プラン', note: '個人向けに一定枠の無料利用あり。' },
    paid:  { plan: '有料プラン', note: '上位モデルやエージェント機能が解放。' },
    url: 'https://github.com/features/copilot',
    scores: { quality: 4, speed: 5, cost: 4, usability: 5, integration: 5, versatility: 2 },
    caps:   { long_text: 2, coding: 5, image_understanding: 2, realtime_search: 1, transcription: 1, image_generation: 1, japanese: 3, agent: 3, cost: 4 },
    fit:    { minutes: 1, slides: 1, coding: 5, transcription: 1, research: 2, writing: 2, data: 3, translation: 2, image: 1, ideation: 2 },
    freeAdjust: {
      scores: { quality: -1, cost: +1 },
      caps:   { coding: -1, agent: -1, cost: +1 },
      fit:    { coding: -1 },
    },
  },
  {
    id: 'codex', name: 'Codex', vendor: 'OpenAI', type: 'コーディング',
    scenes: ['社内'], tags: ['コード生成', 'エージェント', '自動化'],
    accent: 'amber',
    summary: 'タスクを渡すと自律的にコードを書き進めるコーディングエージェント。',
    free:  { plan: '無料枠', note: '上位プラン内での利用が中心。' },
    paid:  { plan: '有料プラン', note: '自律実行の枠と精度がフルに使える。' },
    url: 'https://openai.com',
    scores: { quality: 5, speed: 4, cost: 3, usability: 4, integration: 4, versatility: 2 },
    caps:   { long_text: 2, coding: 5, image_understanding: 2, realtime_search: 1, transcription: 1, image_generation: 1, japanese: 3, agent: 5, cost: 3 },
    fit:    { minutes: 1, slides: 1, coding: 5, transcription: 1, research: 2, writing: 2, data: 3, translation: 2, image: 1, ideation: 2 },
    freeAdjust: {
      scores: { cost: +1 },
      caps:   { agent: -1, coding: -1, cost: +1 },
      fit:    {},
    },
  },
  {
    id: 'antigravity', name: 'Antigravity', vendor: 'Google', type: '開発環境／エージェント',
    scenes: ['社内'], tags: ['エージェント開発', 'IDE', '自動化'],
    accent: 'cyan',
    summary: 'エージェントが主体的に開発を進める開発環境。コーディングの自動化に踏み込む。',
    free:  { plan: '無料枠', note: '導入しやすい枠あり。' },
    paid:  { plan: '上位プラン', note: '実行枠・上位モデルが拡張。' },
    url: 'https://antigravity.google',
    scores: { quality: 4, speed: 4, cost: 4, usability: 3, integration: 4, versatility: 3 },
    caps:   { long_text: 2, coding: 5, image_understanding: 3, realtime_search: 2, transcription: 1, image_generation: 1, japanese: 3, agent: 5, cost: 4 },
    fit:    { minutes: 1, slides: 1, coding: 5, transcription: 1, research: 2, writing: 2, data: 3, translation: 2, image: 1, ideation: 3 },
    freeAdjust: {
      scores: { cost: +1 },
      caps:   { agent: -1, cost: +1 },
      fit:    {},
    },
  },
  {
    id: 'microsoftcopilot', name: 'Microsoft Copilot', vendor: 'Microsoft', type: '汎用チャット／Office統合',
    scenes: ['社内'], tags: ['Office統合', '社内業務', '文書作成'],
    accent: 'cyan',
    summary: 'Word・Excel・Teamsなどに統合され、社内業務の中で直接使える。会議要約にも。',
    free:  { plan: '無料プラン', note: 'Web版チャットは無料。Office統合は別途。' },
    paid:  { plan: '有料プラン', note: 'Office各アプリ内での統合機能が解放。' },
    url: 'https://copilot.microsoft.com',
    scores: { quality: 4, speed: 4, cost: 3, usability: 5, integration: 5, versatility: 4 },
    caps:   { long_text: 4, coding: 3, image_understanding: 4, realtime_search: 4, transcription: 4, image_generation: 4, japanese: 4, agent: 4, cost: 3 },
    fit:    { minutes: 5, slides: 5, coding: 3, transcription: 4, research: 4, writing: 5, data: 5, translation: 5, image: 4, ideation: 4 },
    freeAdjust: {
      scores: { quality: -1, cost: +2, integration: -2 },
      caps:   { transcription: -2, agent: -2, coding: -1, cost: +2 },
      fit:    { minutes: -2, slides: -2, data: -2, transcription: -2 },
    },
  },
  {
    id: 'gamma', name: 'Gamma', vendor: 'Gamma', type: 'スライド・資料',
    scenes: ['社内'], tags: ['スライド生成', '資料作成', 'デザイン'],
    accent: 'amber',
    summary: 'テキストから見栄えのするスライドや資料を自動生成。資料作成の時短に強い。',
    free:  { plan: '無料プラン', note: '作成枠あり。書き出し等に制限。' },
    paid:  { plan: '有料プラン', note: '作成枠・書き出し・ブランド設定が解放。' },
    url: 'https://gamma.app',
    scores: { quality: 4, speed: 5, cost: 3, usability: 5, integration: 3, versatility: 2 },
    caps:   { long_text: 3, coding: 1, image_understanding: 2, realtime_search: 2, transcription: 1, image_generation: 4, japanese: 4, agent: 3, cost: 3 },
    fit:    { minutes: 1, slides: 5, coding: 1, transcription: 1, research: 2, writing: 3, data: 2, translation: 3, image: 3, ideation: 4 },
    freeAdjust: {
      scores: { cost: +1 },
      caps:   { cost: +1 },
      fit:    { slides: -1 },
    },
  },
  {
    id: 'otterai', name: 'Otter.ai', vendor: 'Otter.ai', type: '議事録・文字起こし',
    scenes: ['社内', '個人'], tags: ['文字起こし', '会議録', '要約'],
    accent: 'cyan',
    summary: '会議の音声をリアルタイムで文字起こしし、要約まで作る。議事録作成に特化。',
    free:  { plan: '無料プラン', note: '月間の文字起こし時間に制限。' },
    paid:  { plan: '有料プラン', note: '文字起こし時間・要約機能が拡張。' },
    url: 'https://otter.ai',
    scores: { quality: 4, speed: 4, cost: 3, usability: 5, integration: 4, versatility: 2 },
    caps:   { long_text: 2, coding: 1, image_understanding: 1, realtime_search: 1, transcription: 5, image_generation: 1, japanese: 3, agent: 2, cost: 3 },
    fit:    { minutes: 5, slides: 1, coding: 1, transcription: 5, research: 2, writing: 2, data: 2, translation: 3, image: 1, ideation: 1 },
    freeAdjust: {
      scores: { cost: +1 },
      caps:   { transcription: -1, cost: +1 },
      fit:    { minutes: -1, transcription: -1 },
    },
  },
];

// ---- ビルダー：paid基準 + freeAdjust から free/paid を生成 -----------------
const clamp = (n) => Math.max(0, Math.min(5, n));
function applyAdjust(base, adj) {
  const out = {};
  for (const k in base) out[k] = clamp(base[k] + ((adj && adj[k]) || 0));
  return out;
}

export const TOOLS = TOOLS_RAW.map((t) => {
  const fa = t.freeAdjust || {};
  return {
    id: t.id, name: t.name, vendor: t.vendor, type: t.type,
    scenes: t.scenes, tags: t.tags, accent: t.accent, summary: t.summary,
    url: t.url,
    plans: { free: t.free, paid: t.paid },
    scores: { paid: { ...t.scores }, free: applyAdjust(t.scores, fa.scores) },
    caps:   { paid: { ...t.caps },   free: applyAdjust(t.caps, fa.caps) },
    fit:    { paid: { ...t.fit },    free: applyAdjust(t.fit, fa.fit) },
  };
});

export const TOOLS_BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

// ---- ワークフロー（組み合わせレシピ）--------------------------------------
export const WORKFLOWS = [
  {
    title: 'リサーチ資料を最速で作る',
    scene: '社内',
    steps: [
      { tool: 'Perplexity', do: '出典付きで一次情報を集める' },
      { tool: 'Claude', do: '集めた情報を構成・原稿化する' },
      { tool: 'Gamma', do: '原稿からスライドへ自動整形' },
    ],
  },
  {
    title: '会議を議事録と要約に変える',
    scene: '社内',
    steps: [
      { tool: 'Otter.ai', do: '会議をリアルタイム文字起こし' },
      { tool: 'NotebookLM', do: '文字起こしを読み込み要点を抽出' },
      { tool: 'Microsoft Copilot', do: '社内フォーマットの議事録に清書' },
    ],
  },
  {
    title: '機能を実装してレビューまで',
    scene: '社内',
    steps: [
      { tool: 'Claude', do: '設計と方針を相談・整理' },
      { tool: 'GitHub Copilot', do: 'エディタ内で実装を高速化' },
      { tool: 'Codex', do: 'まとまった改修を自律的に処理' },
    ],
  },
  {
    title: '学びをコンテンツ化する',
    scene: '個人',
    steps: [
      { tool: 'NotebookLM', do: '本・論文・動画を読み込み要約' },
      { tool: 'ChatGPT', do: '理解を深める壁打ちと再構成' },
      { tool: 'Gemini', do: '図解用の画像や補足情報を生成' },
    ],
  },
];

// ---- ニュース（手動キュレーション。Claude Code CLIで毎週追記）-------------
// category: new_feature / update / pricing / integration / deprecation
// ※下記はサンプルです。実際の見出しに差し替えてください。
export const NEWS = [
  { week: '2026-W24', date: '2026-06-12', tool: 'サンプル', category: 'new_feature',
    title: '（サンプル）新しいエージェント機能が追加', summary: 'ここに要約を書きます。news_inbox.json の見出しから重要なものを選んで執筆します。', url: '#' },
  { week: '2026-W24', date: '2026-06-11', tool: 'サンプル', category: 'pricing',
    title: '（サンプル）無料枠の上限が変更', summary: '料金・プラン変更はこのカテゴリに分類します。', url: '#' },
  { week: '2026-W24', date: '2026-06-10', tool: 'サンプル', category: 'update',
    title: '（サンプル）モデルの精度・速度が向上', summary: '既存機能のアップデートはここに。', url: '#' },
];

export const CATEGORY_LABELS = {
  new_feature: '新機能', update: 'アップデート', pricing: '料金変更',
  integration: '連携・API', deprecation: '廃止・終了',
};

export const META = {
  siteName: 'AIツール分析',
  updated: '2026-06-14',
  toolCount: TOOLS.length,
};

/* =========================================================================
   AIツール分析 — データ定義（ここを編集すればサイトが更新されます）
   - スコアはすべて「0〜100」の主観評価（パーセント換算）です。
   - 各ツールは paid（有料プランの実力）を基準値として記述し、
     freeAdjust で「無料プランだと下がる／上がる項目」だけ差分指定します。
   ========================================================================= */

// 6軸レーダーのラベル
export const SCORE_LABELS = {
  quality: '品質', speed: '速度', cost: 'コスパ',
  usability: '使いやすさ', integration: '連携性', versatility: '多機能性',
};

// 横棒グラフ（能力タグ切替）の能力ラベル
export const CAP_LABELS = {
  long_text:           '長文生成',
  coding:              'コーディング',
  image_understanding: '画像認識',
  realtime_search:     'リアルタイム検索',
  transcription:       '音声・文字起こし',
  image_generation:    '画像生成',
  japanese:            '日本語の自然さ',
  agent:               'エージェント自律性',
  cost:                'コスパ',
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
    { key: 'minutes',  name: '議事録・会議要約',    tools: ['notebooklm', 'otterai', 'microsoftcopilot', 'claude'] },
    { key: 'slides',   name: '資料・スライド作成',  tools: ['gamma', 'canva', 'microsoftcopilot', 'chatgpt'] },
    { key: 'docs',     name: '社内文書・マニュアル', tools: ['claude', 'microsoftcopilot', 'chatgpt', 'gemini'] },
    { key: 'mail',     name: 'メール・問い合わせ文', tools: ['microsoftcopilot', 'chatgpt', 'gemini', 'claude'] },
    { key: 'data',     name: 'データ集計・分析',    tools: ['gemini', 'chatgpt', 'microsoftcopilot', 'claude'] },
    { key: 'coding',   name: 'コーディング・開発',  tools: ['githubcopilot', 'codex', 'jules', 'claude'] },
    { key: 'research', name: '市場・競合リサーチ',  tools: ['perplexity', 'genspark', 'gemini', 'chatgpt'] },
    { key: 'trans',    name: '翻訳・多言語対応',    tools: ['chatgpt', 'gemini', 'claude', 'microsoftcopilot'] },
  ],
  個人: [
    { key: 'research', name: '調べもの・リサーチ',   tools: ['perplexity', 'gemini', 'genspark', 'chatgpt'] },
    { key: 'writing',  name: '文章作成・添削',       tools: ['claude', 'chatgpt', 'gemini', 'microsoftcopilot'] },
    { key: 'study',    name: '学習・要約',           tools: ['notebooklm', 'claude', 'chatgpt', 'gemini'] },
    { key: 'voice',    name: '音声の文字起こし',     tools: ['otterai', 'notebooklm', 'gemini', 'microsoftcopilot'] },
    { key: 'image',    name: '画像・イラスト生成',   tools: ['chatgpt', 'canva', 'gemini', 'genspark'] },
    { key: 'idea',     name: 'アイデア出し・壁打ち', tools: ['chatgpt', 'claude', 'gemini', 'genspark'] },
    { key: 'code',     name: 'プログラミング学習',   tools: ['claude', 'chatgpt', 'githubcopilot', 'gemini'] },
    { key: 'slides',   name: '資料・スライド作成',   tools: ['canva', 'gamma', 'gemini', 'chatgpt'] },
  ],
};

// ---- ツール定義（paid基準 + freeAdjust差分）-------------------------------
// scores / caps / fit はすべて 0〜100 の主観評価。
// freeAdjust は「無料プランにすると増減する値」。clamp(100) で上限制限。
const TOOLS_RAW = [
  {
    id: 'chatgpt', name: 'ChatGPT', vendor: 'OpenAI', type: '汎用チャット',
    scenes: ['社内', '個人'], tags: ['文章作成', 'コーディング', '汎用', '画像生成'],
    accent: 'cyan',
    summary: '文章・コード・画像まで幅広くこなす定番の汎用AI。GPT-4o/o3と拡張エコシステムで最大のユーザー基盤を誇る。',
    free:  { plan: '無料プラン（GPT-4o mini）', note: 'GPT-4oに回数制限あり。高度機能・画像生成・o3は有料のみ。' },
    paid:  { plan: 'Plus/Pro（$20〜/月）', note: 'GPT-4o無制限、o3アクセス、高度ボイスモード、画像生成（DALL-E 3）。' },
    url: 'https://chatgpt.com',
    scores: { quality: 90, speed: 80, cost: 55, usability: 95, integration: 90, versatility: 95 },
    caps:   { long_text: 90, coding: 92, image_understanding: 90, realtime_search: 78, transcription: 55, image_generation: 88, japanese: 78, agent: 80, cost: 55 },
    fit:    { minutes: 78, slides: 65, coding: 92, transcription: 60, research: 80, writing: 95, data: 80, translation: 95, image: 88, ideation: 95 },
    freeAdjust: {
      scores: { quality: -20, speed: -20, cost: +40, versatility: -20 },
      caps:   { long_text: -20, coding: -20, image_generation: -40, realtime_search: -20, agent: -20, cost: +40 },
      fit:    { coding: -20, image: -40, data: -20 },
    },
  },
  {
    id: 'claude', name: 'Claude', vendor: 'Anthropic', type: '汎用チャット',
    scenes: ['社内', '個人'], tags: ['長文', '文章作成', 'コーディング', 'リサーチ'],
    accent: 'amber',
    summary: '長文読解・精緻な文章作成・コーディングに強い対話型AI。日本語の表現が丁寧で、倫理的な対話が得意。',
    free:  { plan: '無料プラン（Claude Haiku）', note: 'Sonnet/Opusには利用制限あり。大容量ファイルアップロード不可。' },
    paid:  { plan: 'Pro（$20/月）', note: 'Opus/Sonnet優先アクセス、プロジェクト機能、拡張コンテキスト（200K トークン）。' },
    url: 'https://claude.ai',
    scores: { quality: 93, speed: 78, cost: 55, usability: 88, integration: 78, versatility: 85 },
    caps:   { long_text: 98, coding: 93, image_understanding: 80, realtime_search: 38, transcription: 38, image_generation: 5, japanese: 92, agent: 82, cost: 55 },
    fit:    { minutes: 80, slides: 62, coding: 93, transcription: 38, research: 82, writing: 97, data: 82, translation: 95, image: 20, ideation: 95 },
    freeAdjust: {
      scores: { quality: -20, cost: +40 },
      caps:   { long_text: -20, coding: -20, agent: -20, cost: +40 },
      fit:    { coding: -20 },
    },
  },
  {
    id: 'gemini', name: 'Gemini', vendor: 'Google', type: '汎用チャット',
    scenes: ['社内', '個人'], tags: ['検索連携', 'マルチモーダル', 'データ分析'],
    accent: 'cyan',
    summary: 'Google 検索・Workspace との深い統合が強み。リアルタイム情報と100万トークンの大容量コンテキストが特徴。',
    free:  { plan: '無料プラン（Gemini 1.5 Flash）', note: 'Advanced機能（Deep Research, Gems）は有料のみ。基本利用は無制限。' },
    paid:  { plan: 'Advanced（$19.99/月）', note: 'Gemini 2.5 Pro、Deep Research、Gems作成、NotebookLM Plus含む。' },
    url: 'https://gemini.google.com',
    scores: { quality: 88, speed: 92, cost: 75, usability: 82, integration: 95, versatility: 90 },
    caps:   { long_text: 95, coding: 82, image_understanding: 95, realtime_search: 98, transcription: 65, image_generation: 78, japanese: 82, agent: 80, cost: 78 },
    fit:    { minutes: 80, slides: 65, coding: 82, transcription: 65, research: 95, writing: 82, data: 95, translation: 95, image: 80, ideation: 82 },
    freeAdjust: {
      scores: { quality: -15, versatility: -15 },
      caps:   { coding: -20, agent: -20 },
      fit:    { coding: -20, data: -20 },
    },
  },
  {
    id: 'perplexity', name: 'Perplexity', vendor: 'Perplexity AI', type: 'AI 検索',
    scenes: ['社内', '個人'], tags: ['情報収集', '出典付き回答', '検索'],
    accent: 'cyan',
    summary: '出典 URL 付きで回答する AI 検索エンジン。最新情報へのリアルタイムアクセスとファクトチェックのしやすさが強み。',
    free:  { plan: '無料プラン（5クエリ/日）', note: '1日5回の高度検索制限。基本検索は無制限。Pro Search 機能は制限あり。' },
    paid:  { plan: 'Pro（$20/月）', note: 'Pro Search 無制限、ファイルアップロード、API アクセス、GPT-4o/Claude 切替。' },
    url: 'https://www.perplexity.ai',
    scores: { quality: 80, speed: 92, cost: 75, usability: 90, integration: 55, versatility: 55 },
    caps:   { long_text: 60, coding: 38, image_understanding: 60, realtime_search: 98, transcription: 20, image_generation: 20, japanese: 78, agent: 58, cost: 78 },
    fit:    { minutes: 38, slides: 38, coding: 38, transcription: 20, research: 98, writing: 60, data: 60, translation: 80, image: 20, ideation: 62 },
    freeAdjust: {
      scores: { quality: -15, versatility: -15 },
      caps:   { realtime_search: -20, agent: -20 },
      fit:    { research: -20 },
    },
  },
  {
    id: 'notebooklm', name: 'NotebookLM', vendor: 'Google', type: 'ドキュメント分析',
    scenes: ['社内', '個人'], tags: ['資料読み込み', '要約', '音声要約'],
    accent: 'cyan',
    summary: 'PDF や動画を読み込んで Q&A・要約・ポッドキャスト生成ができる。情報ソースを限定するためハルシネーションが少ない。',
    free:  { plan: '無料プラン（基本機能）', note: 'ノートブック数制限あり。Audio オーバービュー（Podcast）も利用可。' },
    paid:  { plan: 'Plus（Gemini Advanced 含む）', note: 'ノートブック上限拡張、高速処理、Business プランで管理機能追加。' },
    url: 'https://notebooklm.google.com',
    scores: { quality: 82, speed: 78, cost: 98, usability: 80, integration: 38, versatility: 52 },
    caps:   { long_text: 78, coding: 20, image_understanding: 65, realtime_search: 38, transcription: 80, image_generation: 20, japanese: 80, agent: 38, cost: 98 },
    fit:    { minutes: 95, slides: 38, coding: 20, transcription: 80, research: 95, writing: 65, data: 65, translation: 60, image: 20, ideation: 62 },
    freeAdjust: { scores: {}, caps: {}, fit: {} },
  },
  {
    id: 'genspark', name: 'Genspark', vendor: 'Genspark AI', type: 'AI 検索・エージェント',
    scenes: ['社内', '個人'], tags: ['自動リサーチ', '成果物生成', 'エージェント'],
    accent: 'amber',
    summary: '複数情報源を統合した「スパークページ」で調査結果を1ページにまとめる。マルチエージェントでタスクの自律実行も得意。',
    free:  { plan: '無料プラン（基本機能）', note: '基本検索・Sparkpages 生成は無料。エージェント機能に上限あり。' },
    paid:  { plan: 'Plus（$15/月）', note: 'マルチエージェント機能強化、優先処理、ファイル分析上限拡張。' },
    url: 'https://www.genspark.ai',
    scores: { quality: 78, speed: 65, cost: 62, usability: 75, integration: 68, versatility: 85 },
    caps:   { long_text: 78, coding: 60, image_understanding: 78, realtime_search: 95, transcription: 38, image_generation: 78, japanese: 78, agent: 95, cost: 62 },
    fit:    { minutes: 60, slides: 80, coding: 62, transcription: 38, research: 95, writing: 80, data: 80, translation: 78, image: 80, ideation: 82 },
    freeAdjust: {
      scores: { versatility: -20 },
      caps:   { agent: -35, realtime_search: -20 },
      fit:    { research: -20 },
    },
  },
  {
    id: 'githubcopilot', name: 'GitHub Copilot', vendor: 'GitHub / Microsoft', type: 'コーディング',
    scenes: ['社内'], tags: ['コード補完', '開発支援', 'IDE', 'エージェント'],
    accent: 'cyan',
    summary: 'IDE 補完・チャット・自律エージェントモード（PR 作成・テスト生成・バグ修正）を一体化した開発者向けの最高水準ツール。',
    free:  { plan: '無料プラン（月2000補完）', note: '月2000回のコード補完と50チャットメッセージ。個人開発者向け。' },
    paid:  { plan: 'Pro（$10/月）', note: 'コード補完・チャット無制限、エージェントモード（GA）、コードレビュー機能。' },
    url: 'https://github.com/features/copilot',
    scores: { quality: 82, speed: 90, cost: 78, usability: 92, integration: 95, versatility: 38 },
    caps:   { long_text: 38, coding: 95, image_understanding: 38, realtime_search: 20, transcription: 20, image_generation: 20, japanese: 58, agent: 65, cost: 78 },
    fit:    { minutes: 20, slides: 20, coding: 98, transcription: 20, research: 38, writing: 38, data: 62, translation: 38, image: 20, ideation: 38 },
    freeAdjust: {
      scores: { quality: -15, versatility: -15 },
      caps:   { coding: -20, agent: -35 },
      fit:    { coding: -25 },
    },
  },
  {
    id: 'codex', name: 'Codex CLI', vendor: 'OpenAI', type: 'コーディング／自律エージェント',
    scenes: ['社内'], tags: ['コード生成', 'エージェント', 'CLI', 'OSS'],
    accent: 'amber',
    summary: 'OpenAI が2025年5月公開のターミナル型コーディングエージェント。自然言語の指示でコード生成・編集・テスト実行を CLI 上で自律実行。OSS として公開済み。',
    free:  { plan: 'OSS（無料）', note: 'OSS として無料提供。利用には OpenAI API キーが必要（API 利用料別途）。' },
    paid:  { plan: 'API キー課金', note: 'GPT-4o など使用モデルに応じた API 利用料が発生。利用量に応じた従量課金。' },
    url: 'https://openai.com/codex',
    scores: { quality: 88, speed: 78, cost: 55, usability: 75, integration: 82, versatility: 38 },
    caps:   { long_text: 38, coding: 95, image_understanding: 38, realtime_search: 20, transcription: 20, image_generation: 20, japanese: 58, agent: 95, cost: 55 },
    fit:    { minutes: 20, slides: 20, coding: 98, transcription: 20, research: 38, writing: 38, data: 62, translation: 38, image: 20, ideation: 38 },
    freeAdjust: {
      scores: { cost: +40 },
      caps:   { cost: +40 },
      fit:    {},
    },
  },
  {
    id: 'jules', name: 'Jules', vendor: 'Google', type: 'コーディング／自律エージェント',
    scenes: ['社内'], tags: ['エージェント開発', 'GitHub連携', '自律コーディング'],
    accent: 'cyan',
    summary: 'GitHub Issues をアサインするだけで AI が自律的に問題分析・修正・PR 作成まで行う Google のコーディングエージェント。バックグラウンドで非同期実行。',
    free:  { plan: 'Beta（無料）', note: '現在ベータ版として無料公開中。GitHub リポジトリとの連携が必要。' },
    paid:  { plan: '将来有料化予定', note: 'ベータ終了後は従量課金または月額プランになる予定（詳細未発表）。' },
    url: 'https://jules.google.com',
    scores: { quality: 78, speed: 72, cost: 68, usability: 68, integration: 78, versatility: 42 },
    caps:   { long_text: 38, coding: 90, image_understanding: 60, realtime_search: 38, transcription: 20, image_generation: 20, japanese: 60, agent: 95, cost: 68 },
    fit:    { minutes: 20, slides: 20, coding: 92, transcription: 20, research: 38, writing: 38, data: 60, translation: 38, image: 20, ideation: 58 },
    freeAdjust: { scores: {}, caps: {}, fit: {} },
  },
  {
    id: 'microsoftcopilot', name: 'Microsoft Copilot', vendor: 'Microsoft', type: 'ビジネス統合',
    scenes: ['社内'], tags: ['Office統合', '社内業務', '文書作成', '会議要約'],
    accent: 'cyan',
    summary: 'Word・Excel・PowerPoint・Teams・Outlook を横断して文書生成・データ分析・会議要約を実行。企業ユーザーの生産性向上に直結するビジネス AI。',
    free:  { plan: '無料プラン（Web 版）', note: 'Web 版は無料。365 アプリへの統合機能は M365 ライセンス必須。' },
    paid:  { plan: 'M365 Copilot（$30/月）', note: 'Word/Excel/Teams/Outlook との完全統合、企業データへのアクセス、Power Platform 連携。' },
    url: 'https://copilot.microsoft.com',
    scores: { quality: 80, speed: 78, cost: 48, usability: 90, integration: 95, versatility: 78 },
    caps:   { long_text: 80, coding: 62, image_understanding: 80, realtime_search: 80, transcription: 80, image_generation: 80, japanese: 80, agent: 78, cost: 55 },
    fit:    { minutes: 95, slides: 98, coding: 62, transcription: 80, research: 80, writing: 92, data: 95, translation: 92, image: 80, ideation: 80 },
    freeAdjust: {
      scores: { quality: -20, integration: -35, versatility: -20 },
      caps:   { agent: -25, coding: -20 },
      fit:    { slides: -35, data: -35, writing: -20 },
    },
  },
  {
    id: 'gamma', name: 'Gamma', vendor: 'Gamma App', type: 'スライド・資料',
    scenes: ['社内'], tags: ['スライド生成', '資料作成', 'デザイン', 'ビデオ'],
    accent: 'amber',
    summary: 'プロンプトからスライドや Web ページを一瞬で生成する AI ツール。AI ナレーション付きビデオプレゼン変換機能も追加され、デザインスキル不要でプロ品質の資料を作成。',
    free:  { plan: '無料プラン（400 クレジット）', note: '400 クレジット付きでスタート。AI 生成1回あたり40クレジット消費。書き出しに透かし。' },
    paid:  { plan: 'Plus（$8〜/月）', note: '無制限 AI 生成、透かしなし、カスタムフォント・ドメイン、ビデオプレゼン機能。' },
    url: 'https://gamma.app',
    scores: { quality: 82, speed: 90, cost: 58, usability: 95, integration: 58, versatility: 38 },
    caps:   { long_text: 60, coding: 20, image_understanding: 38, realtime_search: 38, transcription: 20, image_generation: 80, japanese: 80, agent: 60, cost: 60 },
    fit:    { minutes: 20, slides: 98, coding: 20, transcription: 20, research: 38, writing: 65, data: 38, translation: 62, image: 65, ideation: 80 },
    freeAdjust: {
      scores: { quality: -15, versatility: -15 },
      caps:   { image_generation: -20 },
      fit:    { slides: -20, ideation: -20 },
    },
  },
  {
    id: 'canva', name: 'Canva', vendor: 'Canva', type: 'デザイン・スライド',
    scenes: ['社内', '個人'],
    tags: ['デザイン', 'スライド生成', '画像生成', 'SNS', 'テンプレート'],
    accent: 'amber',
    summary: 'テンプレートベースのデザインツールに AI（Magic Studio）を統合。Magic Media（画像生成）・Magic Write（文章生成）・AI プレゼン生成を搭載。デザインスキル不要でプロ品質のビジュアルを作成できる。',
    free:  { plan: '無料プラン（月50クレジット）', note: 'Magic Write・Magic Media を月50クレジット分無料利用可。基本テンプレートも使用可。' },
    paid:  { plan: 'Pro（$15/月）', note: 'AI機能500クレジット/月、140M+ プレミアムテンプレート、Brand Kit、1TB ストレージ。' },
    url: 'https://www.canva.com',
    scores:  { quality: 78, speed: 92, cost: 72, usability: 98, integration: 65, versatility: 70 },
    caps:    { long_text: 38, coding: 5, image_understanding: 42, realtime_search: 20, transcription: 20, image_generation: 78, japanese: 72, agent: 22, cost: 72 },
    fit:     { minutes: 20, slides: 98, coding: 5, transcription: 20, research: 20, writing: 45, data: 22, translation: 38, image: 80, ideation: 75 },
    freeAdjust: { scores: { cost: +20 }, caps: { image_generation: -20, cost: +20 }, fit: { slides: -15 } },
  },
  {
    id: 'otterai', name: 'Otter.ai', vendor: 'Otter.ai', type: '議事録・文字起こし',
    scenes: ['社内', '個人'], tags: ['文字起こし', '会議録', '要約', 'Zoom連携'],
    accent: 'cyan',
    summary: 'リアルタイム文字起こしと会議要約に特化した AI。Zoom・Teams・Google Meet と連携して自動参加・文字起こし・要約・アクションアイテム抽出まで全自動。',
    free:  { plan: '無料プラン（月300分）', note: '月300分の文字起こし。会議への自動参加は3回/月。要約機能は制限あり。' },
    paid:  { plan: 'Pro（$16.99/月）', note: '文字起こし6000分/月、自動参加無制限、リアルタイム翻訳（β）、カスタム語彙。' },
    url: 'https://otter.ai',
    scores: { quality: 80, speed: 82, cost: 60, usability: 90, integration: 75, versatility: 35 },
    caps:   { long_text: 38, coding: 20, image_understanding: 20, realtime_search: 20, transcription: 98, image_generation: 20, japanese: 60, agent: 38, cost: 60 },
    fit:    { minutes: 98, slides: 20, coding: 20, transcription: 98, research: 38, writing: 38, data: 38, translation: 60, image: 20, ideation: 20 },
    freeAdjust: {
      scores: { quality: -15, versatility: -15 },
      caps:   { transcription: -20 },
      fit:    { minutes: -20, transcription: -20 },
    },
  },
];

// ---- ビルダー：paid基準 + freeAdjust から free/paid を生成 -----------------
const clamp = (n) => Math.max(0, Math.min(100, n));
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
    plans:  { free: t.free, paid: t.paid },
    scores: { paid: { ...t.scores }, free: applyAdjust(t.scores, fa.scores) },
    caps:   { paid: { ...t.caps },   free: applyAdjust(t.caps,   fa.caps) },
    fit:    { paid: { ...t.fit },    free: applyAdjust(t.fit,    fa.fit) },
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
    title: '自律コーディング（チーム開発）',
    scene: '社内',
    steps: [
      { tool: 'Jules', do: 'GitHub Issues を自律的に修正・PR 作成' },
      { tool: 'GitHub Copilot', do: 'IDE でコードレビュー・細部修正' },
      { tool: 'Codex CLI', do: '大規模リファクタをターミナルで自律実行' },
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

// ---- ニュース（data/news-data.js が自動生成・上書きする）------------------
export { NEWS } from '../../data/news-data.js';

export const CATEGORY_LABELS = {
  new_feature: '新機能', update: 'アップデート', pricing: '料金変更',
  integration: '連携・API', deprecation: '廃止・終了',
};

export const META = {
  siteName: 'AIツール分析',
  updated: '2026-06-15',
  toolCount: TOOLS.length,
};

// ---- モデル別能力値比較 ----------------------------------------------------
export const MODEL_CAP_LABELS = {
  reasoning: '推論・思考力',
  coding:    'コーディング',
  japanese:  '日本語精度',
  speed:     '応答速度',
  cost:      'コスパ（安価さ）',
  context:   'コンテキスト長',
  image_in:  '画像理解',
  image_gen: '画像生成',
};

// caps キーは MODEL_CAP_LABELS のキーと対応。vendor でバー色を制御。
export const MODELS = [
  { id: 'claude-haiku-4-5',  name: 'Claude Haiku 4.5',  vendor: 'anthropic', caps: { reasoning: 70, coding: 73, japanese: 82, speed: 95, cost: 88, context: 82, image_in: 72, image_gen: 0  } },
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', vendor: 'anthropic', caps: { reasoning: 85, coding: 80, japanese: 90, speed: 78, cost: 65, context: 82, image_in: 80, image_gen: 0  } },
  { id: 'claude-opus-4-8',   name: 'Claude Opus 4.8',   vendor: 'anthropic', caps: { reasoning: 93, coding: 89, japanese: 93, speed: 50, cost: 45, context: 82, image_in: 85, image_gen: 0  } },
  { id: 'claude-fable-5',    name: 'Claude Fable 5',    vendor: 'anthropic', caps: { reasoning: 97, coding: 95, japanese: 95, speed: 45, cost: 30, context: 98, image_in: 88, image_gen: 0  } },
  { id: 'gpt-4o-mini',       name: 'GPT-4o mini',       vendor: 'openai',    caps: { reasoning: 70, coding: 72, japanese: 70, speed: 92, cost: 95, context: 72, image_in: 72, image_gen: 0  } },
  { id: 'gpt-4o',            name: 'GPT-4o',            vendor: 'openai',    caps: { reasoning: 85, coding: 87, japanese: 78, speed: 75, cost: 68, context: 72, image_in: 90, image_gen: 80 } },
  { id: 'gpt-5',             name: 'GPT-5',             vendor: 'openai',    caps: { reasoning: 93, coding: 92, japanese: 82, speed: 68, cost: 80, context: 90, image_in: 93, image_gen: 85 } },
  { id: 'gpt-5-5',           name: 'GPT-5.5',           vendor: 'openai',    caps: { reasoning: 97, coding: 93, japanese: 82, speed: 52, cost: 48, context: 98, image_in: 93, image_gen: 88 } },
  { id: 'gemini-1-5-flash',  name: 'Gemini 1.5 Flash',  vendor: 'google',    caps: { reasoning: 70, coding: 70, japanese: 70, speed: 95, cost: 95, context: 98, image_in: 78, image_gen: 55 } },
  { id: 'gemini-2-5-flash',  name: 'Gemini 2.5 Flash',  vendor: 'google',    caps: { reasoning: 80, coding: 80, japanese: 78, speed: 88, cost: 85, context: 95, image_in: 85, image_gen: 92 } },
  { id: 'gemini-3-1-pro',    name: 'Gemini 3.1 Pro',    vendor: 'google',    caps: { reasoning: 95, coding: 82, japanese: 88, speed: 55, cost: 78, context: 98, image_in: 95, image_gen: 90 } },
  { id: 'gemini-3-5-flash',  name: 'Gemini 3.5 Flash',  vendor: 'google',    caps: { reasoning: 82, coding: 85, japanese: 82, speed: 90, cost: 82, context: 98, image_in: 88, image_gen: 88 } },
  { id: 'mistral-large-2',   name: 'Mistral Large 2',   vendor: 'mistral',   caps: { reasoning: 80, coding: 85, japanese: 60, speed: 78, cost: 72, context: 72, image_in: 62, image_gen: 0  } },
];

# Anarchy Reversi

モダンなReactで実装したリバーシ(オセロ)ゲームです。

## 特徴

- ⚛️ **React 18+** - 最新のReact Hooksを活用
- ⚡ **Vite** - 高速な開発体験
- 🎨 **CSS Modules** - スコープ付きスタイリング
- 🎮 **完全なゲームロジック** - リバーシのルールを完全実装
- 🤖 **AI対戦** - 複数の難易度レベル (予定)
- 📱 **レスポンシブデザイン** - あらゆるデバイスで快適にプレイ

## デモ

(準備中)

## セットアップ

### 前提条件

- Node.js 18以上
- npm / yarn / pnpm

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/IsodaZen/anarchy-reversi.git
cd anarchy-reversi

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 使い方

1. ゲームが開始すると、黒のターンから始まります
2. 盤面の合法手がハイライトされます
3. クリックして石を配置します
4. 相手の石を挟むと、挟んだ石がすべてひっくり返ります
5. 配置できる場所がない場合は自動的にパスされます
6. どちらも配置できなくなったらゲーム終了
7. 石の数が多い方の勝利です

## リバーシのルール

### 基本ルール

- 8×8のボードを使用
- 黒と白の石を交互に配置
- 相手の石を挟める場所にのみ配置可能
- 挟んだ石はすべて自分の色にひっくり返る
- 配置できる場所がなければパス
- どちらも配置できなくなったらゲーム終了
- 石の数が多い方が勝利

### 初期配置

ゲーム開始時、中央の4マスに以下のように配置:

```
  ○ ●
  ● ○
```

## プロジェクト構造

```
src/
├── components/       # Reactコンポーネント
│   ├── Board/       # ゲームボード
│   ├── Cell/        # 個別のマス
│   ├── Piece/       # 石の表示
│   ├── ScoreBoard/  # スコア表示
│   ├── GameInfo/    # ゲーム情報
│   └── Controls/    # 操作パネル
├── hooks/           # カスタムフック
│   └── useGameState.js
├── utils/           # ユーティリティ関数
│   ├── gameLogic.js
│   ├── validation.js
│   └── ai.js
├── constants/       # 定数定義
└── App.jsx          # ルートコンポーネント
```

## 開発ロードマップ

### ✅ フェーズ 1: 基本実装
- [x] プロジェクト初期化
- [ ] Reactプロジェクトのセットアップ
- [ ] 基本的なコンポーネント実装
- [ ] ゲームロジックの実装
- [ ] UI/UXの基礎

### 🚧 フェーズ 2: UX向上
- [ ] アニメーション効果
- [ ] サウンドエフェクト
- [ ] レスポンシブデザイン
- [ ] ダークモード

### 📋 フェーズ 3: ゲームモード拡張
- [ ] AI対戦機能
- [ ] 難易度選択
- [ ] 対戦履歴
- [ ] リプレイ機能

### 🌐 フェーズ 4: オンライン機能
- [ ] バックエンドAPI
- [ ] ユーザー認証
- [ ] オンライン対戦
- [ ] ランキング

## 技術スタック

- **フロントエンド**: React 18+, Vite
- **スタイリング**: CSS Modules
- **状態管理**: React Hooks (useState, useReducer, Context API)
- **開発ツール**: ESLint, Prettier
- **テスト**: Vitest, React Testing Library (予定)

## コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずIssueで議論してください。

### 開発フロー

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 詳細ドキュメント

開発者向けの詳細な情報は [CLAUDE.md](CLAUDE.md) を参照してください。

## 作者

IsodaZen

## 謝辞

- Reactコミュニティ
- Viteチーム
- リバーシのルール・アルゴリズムに関する参考資料

# Anarchy Reversi - CLAUDE.md

## プロジェクト概要

Anarchy Reversi は、モダンなフロントエンド技術を使用したリバーシ(オセロ)ゲームの実装です。
最初期はフロントエンドのみで完結する実装を行い、段階的に機能を拡張していきます。

## 技術スタック

### フロントエンド
- **React 18+**: モダンなUIライブラリ
  - Hooks (useState, useEffect, useReducer, useCallback)
  - Context API (グローバル状態管理)
- **Vite**: 高速なビルドツール・開発サーバー
- **CSS Modules / Styled Components**: スコープ付きスタイリング
  - または Tailwind CSS も検討可能
- **TypeScript**: 型安全性の向上 (段階的導入)

### 開発ツール
- **Node.js**: v18以上
- **npm / yarn / pnpm**: パッケージマネージャー
- **ESLint + Prettier**: コード品質とフォーマット
- **React DevTools**: デバッグ用

### 将来の拡張
- バックエンド: Node.js (Express/Fastify) または Next.js
- データベース: 対戦履歴の保存用 (PostgreSQL/MongoDB)
- リアルタイム通信: WebSocket (Socket.io) でオンライン対戦機能

## プロジェクト構造

```
anarchy-reversi/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── Board/          # ボードコンポーネント
│   │   │   ├── Board.jsx
│   │   │   └── Board.module.css
│   │   ├── Cell/           # セル(マス)コンポーネント
│   │   │   ├── Cell.jsx
│   │   │   └── Cell.module.css
│   │   ├── Piece/          # 石コンポーネント
│   │   │   ├── Piece.jsx
│   │   │   └── Piece.module.css
│   │   ├── ScoreBoard/     # スコアボード
│   │   │   ├── ScoreBoard.jsx
│   │   │   └── ScoreBoard.module.css
│   │   ├── GameInfo/       # ゲーム情報表示
│   │   │   ├── GameInfo.jsx
│   │   │   └── GameInfo.module.css
│   │   └── Controls/       # ゲームコントロール
│   │       ├── Controls.jsx
│   │       └── Controls.module.css
│   ├── hooks/              # カスタムフック
│   │   ├── useGameState.js # ゲーム状態管理
│   │   └── useAI.js        # AI処理
│   ├── utils/              # ユーティリティ関数
│   │   ├── gameLogic.js    # ゲームロジック
│   │   ├── validation.js   # 合法手判定
│   │   └── ai.js           # AI実装
│   ├── constants/          # 定数定義
│   │   └── game.js         # ゲーム定数
│   ├── App.jsx             # ルートコンポーネント
│   ├── App.css
│   ├── main.jsx            # エントリーポイント
│   └── index.css           # グローバルスタイル
├── package.json
├── vite.config.js
├── .eslintrc.cjs
├── .gitignore
├── LICENSE
├── README.md
└── CLAUDE.md
```

## 実装ロードマップ

### フェーズ 1: 基本実装 (最優先)
- [x] プロジェクト初期化
- [ ] Reactプロジェクトのセットアップ
  - [ ] Viteでプロジェクト作成
  - [ ] 必要な依存関係のインストール
  - [ ] ESLint/Prettier設定
- [ ] コンポーネント実装
  - [ ] Board コンポーネント (8x8グリッド)
  - [ ] Cell コンポーネント (個別のマス)
  - [ ] Piece コンポーネント (石の表示)
  - [ ] ScoreBoard コンポーネント
  - [ ] GameInfo コンポーネント (ターン表示)
  - [ ] Controls コンポーネント (リセットボタン等)
- [ ] ゲームロジック
  - [ ] ゲーム定数の定義
  - [ ] ボード状態管理 (useGameState フック)
  - [ ] 石を置く処理
  - [ ] ひっくり返す処理
  - [ ] 合法手の判定
  - [ ] 勝敗判定
- [ ] 基本的なUI/UX
  - [ ] クリックで石を配置
  - [ ] 配置可能な場所のハイライト
  - [ ] ゲームリセット機能
  - [ ] レスポンシブデザインの基礎

### フェーズ 2: UX向上
- [ ] アニメーション
  - [ ] CSS Transitions/Animations で石を置くアニメーション
  - [ ] ひっくり返るアニメーション (フリップ効果)
  - [ ] React Spring または Framer Motion の検討
- [ ] サウンドエフェクト (Web Audio API)
- [ ] レスポンシブデザインの完成
- [ ] ダークモード対応 (CSS Variables + Context API)

### フェーズ 3: ゲームモード拡張
- [ ] AI対戦
  - [ ] 簡単モード (ランダム選択)
  - [ ] 中級モード (評価関数ベース)
  - [ ] 上級モード (Minimax/αβ剪定)
- [ ] 対戦履歴の記録
- [ ] リプレイ機能

### フェーズ 4: オンライン機能 (将来)
- [ ] バックエンドAPI実装
- [ ] ユーザー認証
- [ ] オンライン対戦
- [ ] ランキング機能

## 開発ガイドライン

### コーディング規約
- **JavaScript/JSX**: ES6+ の機能を活用
- **命名規則**:
  - camelCase: 変数、関数、フック
  - PascalCase: コンポーネント、型定義
  - UPPER_SNAKE_CASE: 定数
- **コンポーネント設計**:
  - 関数コンポーネント + Hooks を使用
  - 1ファイル1コンポーネントの原則
  - Props の型定義を明確に
- **コメント**: 複雑なロジックには日本語コメントを記載
- **関数**: 単一責任の原則に従う
- **スタイル**: CSS Modules で命名衝突を回避

### ゲームロジックの基本仕様

#### ボード
- 8x8 = 64マス
- 座標: (row, col) 0-indexed
- 初期配置: 中央4マスに白黒2個ずつ

#### ルール
1. 黒から開始
2. 相手の石を挟める場所に配置
3. 挟んだ石をすべてひっくり返す
4. 配置できる場所がなければパス
5. 両者とも配置できなくなったらゲーム終了
6. 石の数が多い方が勝利

### 状態管理

Reactの状態管理には以下の手法を使用:

```javascript
// カスタムフック useGameState.js の例
import { useReducer, useCallback } from 'react';

const initialState = {
  board: Array(8).fill(null).map(() => Array(8).fill(null)),
  currentPlayer: 'black', // 'black' | 'white'
  score: { black: 2, white: 2 },
  isGameOver: false,
  validMoves: [],
  history: [] // 手の履歴
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'PLACE_PIECE':
      // 石を置く処理
      break;
    case 'RESET_GAME':
      return initialState;
    // その他のアクション...
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const placePiece = useCallback((row, col) => {
    dispatch({ type: 'PLACE_PIECE', payload: { row, col } });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return { state, placePiece, resetGame };
}
```

**状態管理の方針**:
- ローカル状態: `useState` (コンポーネント内で完結)
- 複雑な状態: `useReducer` (ゲーム状態など)
- グローバル状態: Context API (テーマ、設定など)

### UI/UXの方針
- **シンプル第一**: 余計な装飾を避け、ゲームに集中できるデザイン
- **即時フィードバック**: 操作に対する反応を素早く
- **アクセシビリティ**: キーボード操作にも対応
- **パフォーマンス**: 60fps を維持するスムーズな動作

## テスト方針

### 初期段階
- 手動テスト: ブラウザでの動作確認
- React DevTools でのデバッグ
- コンソールログでのデバッグ

### 将来的に
- **ユニットテスト**: Vitest (Viteとの相性◎)
  - ゲームロジックのテスト
  - ユーティリティ関数のテスト
- **コンポーネントテスト**: React Testing Library
  - コンポーネントの振る舞いテスト
  - ユーザーインタラクションのテスト
- **E2Eテスト**: Playwright / Cypress
  - 実際のゲームフローのテスト

## 開発環境

### 必要なツール
- **Node.js**: v18以上 (LTS推奨)
- **パッケージマネージャー**: npm / yarn / pnpm
- **モダンブラウザ**: Chrome, Firefox, Safari (最新版)
- **テキストエディタ**: VSCode推奨

### 推奨VSCode拡張
- **ES7+ React/Redux/React-Native snippets**: Reactのスニペット
- **ESLint**: コード品質チェック
- **Prettier - Code formatter**: コードフォーマット
- **Vite**: Vite専用の拡張
- **React Developer Tools**: (ブラウザ拡張)

### セットアップ手順

```bash
# プロジェクトのクローン
git clone https://github.com/IsodaZen/anarchy-reversi.git
cd anarchy-reversi

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー (ビルド後)
npm run preview
```

## デプロイ

### 初期段階 (静的サイト)
- **Vercel**: Viteとの相性抜群、自動デプロイ
- **Netlify**: シンプルで高速
- **GitHub Pages**: 無料でお手軽
- **Cloudflare Pages**: エッジでの高速配信

### デプロイコマンド例

```bash
# Vercelへのデプロイ
npm run build
npx vercel --prod

# Netlifyへのデプロイ
npm run build
npx netlify deploy --prod --dir=dist
```

### 将来的に
- **Next.js化**: SSR/SSGの恩恵
- **フルスタックアプリ**: Node.js バックエンドと統合
- **Docker化**: コンテナベースのデプロイ
- **CDN最適化**: 世界中で高速アクセス

## 参考リソース

### リバーシのアルゴリズム
- ビット演算による高速化
- 評価関数の設計
- 定石データベース

### UI/UXデザイン
- マテリアルデザイン
- ゲームボードのベストプラクティス

## コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずIssueで議論してください。

## ライセンス

MIT License - 詳細は LICENSE ファイルを参照

---

**Last Updated**: 2026-01-20
**Current Phase**: フェーズ 1 - 基本実装

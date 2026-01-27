# フロントエンド設計

## 概要

React 19 + TypeScriptを使用したSPAアプリケーション。
Viteによる高速な開発環境とビルドを実現。

## ディレクトリ構造

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/        # Reactコンポーネント
│   │   ├── Board/        # ゲームボード
│   │   ├── Cell/         # セル（マス）
│   │   ├── Piece/        # 石
│   │   ├── RoomControl/  # ルーム操作UI
│   │   ├── ScoreBoard/   # スコア表示
│   │   └── GameInfo/     # ゲーム情報
│   ├── hooks/            # カスタムフック
│   │   ├── useWebSocket.ts
│   │   ├── useGameState.ts
│   │   └── useRoom.ts
│   ├── pages/            # ページコンポーネント
│   │   ├── Home.tsx
│   │   └── GameRoom.tsx
│   ├── services/         # 外部サービス連携
│   │   └── websocket.ts
│   ├── store/            # Redux状態管理
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── gameSlice.ts
│   ├── types/            # TypeScript型定義
│   │   ├── game.ts
│   │   └── websocket.ts
│   ├── utils/            # ユーティリティ関数
│   │   └── gameLogic.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 関連ドキュメント

- [コンポーネント設計](./components.md)
- [状態管理設計](./state.md)
- [ルーティング設計](./routing.md)

## 設計方針

### コンポーネント設計

- 関数コンポーネント + Hooks
- 1ファイル1コンポーネント
- Props型を明確に定義
- 名前付きエクスポートを優先

### 状態管理

- Redux Toolkitによるグローバル状態管理
- ローカル状態は useState/useReducer

### スタイリング

- Tailwind CSSをメイン使用
- 必要に応じてCSS Modulesを併用

# Technology Stack

## Architecture

SPA（Single Page Application）+ WebSocketサーバー構成。
フロントエンドとバックエンドを分離し、リアルタイム通信で同期。

```
React Frontend ←→ Go Backend ←→ Redis
    (SPA)         (WebSocket)    (State)
```

## Core Technologies

- **Language**: TypeScript (Frontend), Go (Backend)
- **Framework**: React 19 + Vite 7
- **Runtime**: Node.js 19+ (開発), Go 1.25+ (サーバー)

## Key Libraries

### Frontend
- **Redux Toolkit**: グローバル状態管理（ゲーム状態）
- **React Router v7**: SPAルーティング
- **Tailwind CSS v4**: ユーティリティファーストのスタイリング

### Backend (計画)
- **Gin**: HTTPルーター/WebSocketハンドラー
- **gorilla/websocket**: WebSocket実装
- **go-redis**: Redis接続

## Development Standards

### Type Safety
- TypeScript strict mode
- 明示的な型定義（`types/` ディレクトリ）
- `any` 使用禁止

### Code Quality
- ESLint + TypeScript ESLint
- Prettier（ESLint経由）
- React Hooks lint rules

### Testing
- **Vitest + React Testing Library + jsdom**: ユニット/コンポーネントテスト（導入済み）
- **Playwright**: E2Eテスト（計画）
- テストファイルはソースと同一ディレクトリに `*.test.tsx` / `*.test.ts` で配置

### Accessibility
- インタラクティブ要素に `role`, `tabIndex`, `aria-label` を設定
- キーボード操作（Enter/Space）のサポート
- 最低44x44pxのタッチターゲット
- フォーカスインジケーター（`focus:outline`）

## Development Environment

### Required Tools
- Node.js 19+
- Go 1.25+
- Redis 7+
- Docker（オプション）

### Common Commands
```bash
# Dev: npm run dev
# Build: npm run build
# Lint: npm run lint
# Test: npm run test
# Test (watch): npm run test:watch
# Type check: npx tsc --noEmit --project tsconfig.app.json
```

## Key Technical Decisions

| 決定 | 理由 |
|------|------|
| Redux Toolkit | 予測可能な状態管理、DevTools対応 |
| React Router v7 SPA | シンプルな2ページ構成に最適 |
| Tailwind CSS | 子供向けUIのプロトタイピング高速化 |
| WebSocket | 低遅延リアルタイム同期 |
| Redis | 一時的ゲーム状態に最適、TTL自動削除 |

---
_Document standards and patterns, not every dependency_

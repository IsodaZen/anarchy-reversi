# アナーキーオセロ - CLAUDE.md

## プロジェクト概要

「アナーキーオセロ」は、従来のルールに縛られない自由なリバーシゲームです。
子供向けのWeb版リバーシで、**手動で石を自由に操作できる**（イカサマも可能）という特徴があります。
リアルタイム対戦機能を備え、ルームIDを共有することで友達と対戦できます。

### 主な特徴
- ✅ ターン制リバーシ（オセロ）
- ✅ **プレイヤーが手動で石を自由に操作可能**（イカサマも可能）
- ✅ リアルタイム対戦機能（WebSocket使用）
- ✅ マッチング機能なし：ルームID共有方式
- ✅ ユーザー登録不要
- ✅ 子供が直感的に操作できるUI

## 技術スタック

### フロントエンド
- **React 19+**: モダンなUIライブラリ
  - Hooks (useState, useEffect, useReducer, useCallback)
  - Context API または Zustand (状態管理)
- **TypeScript**: 型安全性の向上
- **Vite**: 高速なビルドツール・開発サーバー
- **CSS Modules または Tailwind CSS**: スタイリング
- **WebSocket Client**: リアルタイム通信

### バックエンド
- **Go 1.25+**: 高性能なサーバーサイド言語
- **Gin**: Webフレームワーク
- **gorilla/websocket**: WebSocket実装
- **go-redis/redis**: Redis接続
- **google/uuid**: ルームID生成

### インフラ・データベース
- **Redis**: ゲーム状態の保存
  - ルーム情報
  - 盤面状態
  - 接続プレイヤー情報
- **Railway**: デプロイ環境（Hobbyプラン）
- **Docker**: コンテナベースのデプロイ

### 開発ツール
- **Node.js**: v19以上
- **Go**: v1.25以上
- **npm / yarn / pnpm**: パッケージマネージャー
- **ESLint + Prettier**: コード品質とフォーマット
- **React DevTools**: デバッグ用

### 予算制約
- **月額予算**: $5以内（Railway Hobbyプラン）
- 使用上限設定で予期しない課金を防ぐ

## プロジェクト構造

```
anarchy-reversi/
├── frontend/               # React フロントエンド
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/    # Reactコンポーネント
│   │   │   ├── Board/    # ゲームボード
│   │   │   │   ├── Board.tsx
│   │   │   │   └── Board.module.css
│   │   │   ├── Cell/     # セル(マス)
│   │   │   │   ├── Cell.tsx
│   │   │   │   └── Cell.module.css
│   │   │   ├── Piece/    # 石
│   │   │   │   ├── Piece.tsx
│   │   │   │   └── Piece.module.css
│   │   │   ├── RoomControl/ # ルーム作成・参加
│   │   │   │   ├── RoomControl.tsx
│   │   │   │   └── RoomControl.module.css
│   │   │   ├── ScoreBoard/ # スコア表示
│   │   │   │   ├── ScoreBoard.tsx
│   │   │   │   └── ScoreBoard.module.css
│   │   │   └── GameInfo/   # ゲーム情報
│   │   │       ├── GameInfo.tsx
│   │   │       └── GameInfo.module.css
│   │   ├── hooks/         # カスタムフック
│   │   │   ├── useWebSocket.ts  # WebSocket接続管理
│   │   │   ├── useGameState.ts  # ゲーム状態管理
│   │   │   └── useRoom.ts       # ルーム管理
│   │   ├── services/      # API・WebSocketサービス
│   │   │   └── websocket.ts
│   │   ├── types/         # TypeScript型定義
│   │   │   ├── game.ts
│   │   │   └── websocket.ts
│   │   ├── utils/         # ユーティリティ関数
│   │   │   └── gameLogic.ts
│   │   ├── App.tsx        # ルートコンポーネント
│   │   ├── App.css
│   │   ├── main.tsx       # エントリーポイント
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .eslintrc.cjs
├── backend/               # Go バックエンド
│   ├── main.go           # エントリーポイント
│   ├── handlers/         # HTTPハンドラー
│   │   ├── websocket.go # WebSocketハンドラー
│   │   └── room.go      # ルーム管理API
│   ├── models/           # データモデル
│   │   ├── game.go      # ゲーム状態
│   │   ├── room.go      # ルーム情報
│   │   └── player.go    # プレイヤー情報
│   ├── services/         # ビジネスロジック
│   │   ├── redis.go     # Redis接続・操作
│   │   ├── game.go      # ゲームロジック
│   │   └── room.go      # ルーム管理
│   ├── config/           # 設定
│   │   └── config.go
│   ├── go.mod
│   └── go.sum
├── docker-compose.yml    # ローカル開発用
├── Dockerfile            # デプロイ用
├── .gitignore
├── LICENSE
├── README.md
└── CLAUDE.md
```

## アーキテクチャ

```text
┌─────────────────────────────────┐
│  React Frontend (TypeScript)    │
│  - ゲームUI                     │
│  - WebSocketクライアント        │
│  - ルーム管理画面               │
└────────────┬────────────────────┘
             │ WebSocket
             ▼
┌─────────────────────────────────┐
│  Gin Server (Go)                │
│  - WebSocketハンドラー          │
│  - ルーム管理API                │
│  - ゲーム状態管理               │
│  - 並行処理によるコネクション管理│
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Redis                          │
│  - ルーム情報 (room:*)          │
│  - 盤面状態 (board:*)           │
│  - プレイヤー情報 (player:*)    │
│  - TTL設定（自動削除）          │
└─────────────────────────────────┘
```

## 実装ロードマップ

### フェーズ 1: 基本実装 (最優先)

#### フロントエンド
- [x] プロジェクト初期化
- [ ] React + TypeScriptプロジェクトのセットアップ
  - [ ] Viteでプロジェクト作成
  - [ ] TypeScript設定
  - [ ] ESLint/Prettier設定
- [ ] 基本コンポーネント実装
  - [ ] Board コンポーネント (8x8グリッド)
  - [ ] Cell コンポーネント (個別のマス)
  - [ ] Piece コンポーネント (石の表示・手動操作)
  - [ ] RoomControl コンポーネント (ルーム作成・参加UI)
  - [ ] ScoreBoard コンポーネント
  - [ ] GameInfo コンポーネント
- [ ] WebSocket実装
  - [ ] useWebSocket カスタムフック
  - [ ] 接続・切断処理
  - [ ] メッセージ送受信
  - [ ] 再接続ロジック

#### バックエンド
- [ ] Goプロジェクトのセットアップ
  - [ ] go.mod初期化
  - [ ] 必要なパッケージのインストール
  - [ ] ディレクトリ構成の作成
- [ ] WebSocketサーバー実装
  - [ ] Ginサーバーのセットアップ
  - [ ] WebSocketハンドラー
  - [ ] コネクション管理
  - [ ] ブロードキャスト機能
- [ ] ルーム管理機能
  - [ ] ルーム作成API
  - [ ] ルーム参加API
  - [ ] ルームID生成（UUID）
  - [ ] ルーム情報の取得
- [ ] Redis統合
  - [ ] Redis接続設定
  - [ ] ルーム情報の保存・取得
  - [ ] 盤面状態の保存・取得
  - [ ] TTL設定（自動削除）

#### ゲームロジック
- [ ] 基本的なゲームロジック
  - [ ] 盤面状態管理
  - [ ] **手動で石を操作できる機能**（自由にクリックで白黒反転）
  - [ ] ターン管理（形式的なもの）
  - [ ] スコア計算
- [ ] リアルタイム同期
  - [ ] 盤面状態の同期
  - [ ] プレイヤーアクションの同期
  - [ ] ゲームリセット機能

#### インフラ
- [ ] ローカル開発環境
  - [ ] Docker Compose設定（Redis含む）
  - [ ] 環境変数管理
- [ ] デプロイ準備
  - [ ] Dockerfile作成
  - [ ] Railway設定
  - [ ] 予算上限設定

### フェーズ 2: UX向上
- [ ] アニメーション
  - [ ] CSS Transitions/Animations で石を操作するアニメーション
  - [ ] ひっくり返るアニメーション (フリップ効果)
  - [ ] React Spring または Framer Motion の検討
- [ ] サウンドエフェクト (Web Audio API)
  - [ ] 石を置く音
  - [ ] ゲーム開始・終了音
- [ ] レスポンシブデザインの完成
  - [ ] タブレット対応
  - [ ] スマートフォン対応
- [ ] ダークモード対応 (CSS Variables + Context API)
- [ ] 子供向けUIの改善
  - [ ] 大きなボタン
  - [ ] わかりやすいアイコン
  - [ ] カラフルなデザイン

### フェーズ 3: 機能拡張
- [ ] ゲーム履歴機能
  - [ ] 手の履歴表示
  - [ ] アンドゥ機能
  - [ ] リプレイ機能
- [ ] 観戦機能
  - [ ] 観戦者モード
  - [ ] ルームの共有リンク
- [ ] チャット機能（オプション）
  - [ ] テキストチャット
  - [ ] スタンプ機能

### フェーズ 4: 運用最適化
- [ ] パフォーマンス最適化
  - [ ] Redisのメモリ使用量監視
  - [ ] 非アクティブなルームの自動削除
  - [ ] WebSocket接続数の制限
- [ ] 監視・ログ
  - [ ] アクセスログ
  - [ ] エラーログ
  - [ ] メトリクス収集（Railwayダッシュボード）
- [ ] セキュリティ強化
  - [ ] レート制限
  - [ ] CORS設定
  - [ ] 入力バリデーション

## 開発ガイドライン

### コーディング規約

#### フロントエンド（TypeScript/React）
- **TypeScript**: 厳格な型定義を使用
- **命名規則**:
  - camelCase: 変数、関数、フック
  - PascalCase: コンポーネント、型定義、インターフェース
  - UPPER_SNAKE_CASE: 定数
- **コンポーネント設計**:
  - 関数コンポーネント + Hooks を使用
  - 1ファイル1コンポーネントの原則
  - Props の型定義を明確に（interface または type）
  - デフォルトエクスポートよりも名前付きエクスポートを優先
- **コメント**: 複雑なロジックには日本語コメントを記載
- **スタイル**: CSS Modules で命名衝突を回避

#### バックエンド（Go）
- **命名規則**: Go標準の規約に従う
  - エクスポートする識別子: 大文字始まり
  - プライベートな識別子: 小文字始まり
- **エラーハンドリング**: すべてのエラーを適切に処理
- **並行処理**: goroutineとchannelを活用
- **コメント**: パブリック関数には必ずドキュメントコメント
- **テスト**: ユニットテストを必ず書く（`_test.go`）

### ゲームロジックの基本仕様

#### ボード
- 8x8 = 64マス
- 座標: (row, col) 0-indexed
- 初期配置: 中央4マスに白黒2個ずつ

#### 「アナーキー」の特徴
**重要**: このゲームは通常のリバーシルールに縛られません。

1. **手動操作**: プレイヤーは任意のマスをクリックして石を反転できる
2. **ルール無視**: 合法手の判定は行わない（すべてのマスが操作可能）
3. **イカサマ可能**: ターンを無視して何度でも操作できる
4. **自由度の高さ**: 子供が自由に遊べることを優先

#### 基本的な仕様
- 黒と白の石を盤面に配置
- クリックで石の色を反転（黒 ↔ 白 ↔ 空）
- スコアは単純にカウント（黒の数、白の数）
- ゲームリセット機能
- リアルタイムで対戦相手と同期

### 状態管理

#### フロントエンド状態管理

```typescript
// types/game.ts - 型定義
export type CellState = 'black' | 'white' | null;
export type Board = CellState[][];

export interface GameState {
  board: Board;
  score: { black: number; white: number };
  roomId: string | null;
  playerId: string | null;
  isConnected: boolean;
}

// hooks/useGameState.ts - カスタムフック
import { useReducer, useCallback } from 'react';

const initialState: GameState = {
  board: Array(8).fill(null).map(() => Array(8).fill(null)),
  score: { black: 0, white: 0 },
  roomId: null,
  playerId: null,
  isConnected: false
};

type GameAction =
  | { type: 'TOGGLE_CELL'; payload: { row: number; col: number } }
  | { type: 'UPDATE_BOARD'; payload: Board }
  | { type: 'RESET_GAME' }
  | { type: 'SET_ROOM'; payload: { roomId: string; playerId: string } }
  | { type: 'SET_CONNECTED'; payload: boolean };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TOGGLE_CELL': {
      const { row, col } = action.payload;
      const newBoard = state.board.map(r => [...r]);
      // 黒 → 白 → 空 → 黒 のサイクル
      const current = newBoard[row][col];
      newBoard[row][col] = current === 'black' ? 'white' : current === 'white' ? null : 'black';
      return { ...state, board: newBoard };
    }
    case 'UPDATE_BOARD':
      return { ...state, board: action.payload };
    case 'RESET_GAME':
      return { ...state, board: initialState.board };
    case 'SET_ROOM':
      return { ...state, ...action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    default:
      return state;
  }
}
```

#### バックエンド状態管理（Redis）

```go
// models/game.go - ゲーム状態
type CellState string

const (
    Black CellState = "black"
    White CellState = "white"
    Empty CellState = "empty"
)

type Board [8][8]CellState

type GameState struct {
    RoomID    string    `json:"room_id"`
    Board     Board     `json:"board"`
    UpdatedAt time.Time `json:"updated_at"`
}

// services/redis.go - Redis操作
func SaveGameState(ctx context.Context, gameState *GameState) error {
    data, err := json.Marshal(gameState)
    if err != nil {
        return err
    }

    key := fmt.Sprintf("game:%s", gameState.RoomID)
    // 1時間のTTL
    return redisClient.Set(ctx, key, data, time.Hour).Err()
}
```

**状態管理の方針**:
- フロントエンド: `useReducer` でローカル状態管理
- グローバル状態: Context API または Zustand
- バックエンド: Redis でゲーム状態を永続化
- WebSocket: 状態変更を双方向で同期

### UI/UXの方針
- **子供向けデザイン**:
  - 大きなボタンとタッチターゲット
  - わかりやすいアイコンとラベル
  - カラフルで楽しいビジュアル
- **シンプル第一**: 複雑な操作を避け、直感的なUI
- **即時フィードバック**:
  - クリックで即座に石が反転
  - アニメーション効果で視覚的フィードバック
  - 音声フィードバック（オプション）
- **レスポンシブ**: スマートフォン・タブレット対応
- **パフォーマンス**: WebSocketでの低遅延通信

## テスト方針

### 初期段階
- 手動テスト: ブラウザでの動作確認
- React DevTools でのデバッグ
- コンソールログでのデバッグ
- WebSocket通信の確認（ブラウザのDevTools Network）

### フロントエンドテスト
- **ユニットテスト**: Vitest
  - カスタムフックのテスト
  - ユーティリティ関数のテスト
- **コンポーネントテスト**: React Testing Library
  - コンポーネントの振る舞いテスト
  - ユーザーインタラクションのテスト
- **E2Eテスト**: Playwright
  - WebSocket接続のテスト
  - ルーム作成・参加フローのテスト
  - 2プレイヤー同期のテスト

### バックエンドテスト
- **ユニットテスト**: Go標準テストパッケージ
  - モデルのテスト
  - ビジネスロジックのテスト
- **統合テスト**:
  - Redis接続のテスト
  - WebSocketハンドラーのテスト
  - API エンドポイントのテスト

## 開発環境

### 必要なツール
- **Node.js**: v19以上 (LTS推奨)
- **Go**: v1.25以上
- **Redis**: v7以上
- **Docker & Docker Compose**: (オプション、推奨)
- **パッケージマネージャー**: npm / yarn / pnpm
- **モダンブラウザ**: Chrome, Firefox, Safari (最新版)
- **テキストエディタ**: VSCode推奨

### 推奨VSCode拡張

#### フロントエンド
- **ES7+ React/Redux/React-Native snippets**: Reactのスニペット
- **TypeScript Vue Plugin (Volar)**: TypeScript サポート
- **ESLint**: コード品質チェック
- **Prettier - Code formatter**: コードフォーマット
- **Tailwind CSS IntelliSense**: (Tailwind使用時)

#### バックエンド
- **Go**: Go言語サポート
- **Go Test Explorer**: テスト実行
- **Redis**: Redis接続・確認

### セットアップ手順

#### Docker Composeを使用する場合（推奨）

```bash
# プロジェクトのクローン
git clone https://github.com/IsodaZen/anarchy-reversi.git
cd anarchy-reversi

# Docker Composeで全サービスを起動
docker-compose up

# フロントエンド: http://localhost:5173
# バックエンド: http://localhost:8080
# Redis: localhost:6379
```

#### 個別にセットアップする場合

```bash
# 1. Redisを起動
redis-server

# 2. バックエンドのセットアップ
cd backend
go mod download
go run main.go
# サーバーが http://localhost:8080 で起動

# 3. フロントエンドのセットアップ（別ターミナル）
cd frontend
npm install
npm run dev
# アプリが http://localhost:5173 で起動
```

#### 環境変数設定

```bash
# backend/.env
REDIS_URL=localhost:6379
PORT=8080
CORS_ORIGIN=http://localhost:5173

# frontend/.env
VITE_WS_URL=ws://localhost:8080/ws
VITE_API_URL=http://localhost:8080
```

## デプロイ

### Railway へのデプロイ（推奨）

**予算**: 月額 $5 以内（Hobbyプラン）

#### 前提条件
- Railway アカウント
- GitHub リポジトリ連携
- 予算上限設定: $5

#### デプロイ手順

1. **Railwayプロジェクト作成**
```bash
# Railway CLIインストール
npm install -g @railway/cli

# ログイン
railway login

# プロジェクト作成
railway init
```

2. **サービス追加**
- Redis サービスを追加
- Goバックエンドサービスを追加（Dockerfile使用）
- フロントエンドビルド結果を静的ホスティング

3. **環境変数設定**
```bash
# Railwayダッシュボードで設定
REDIS_URL=${REDIS_PRIVATE_URL}
PORT=8080
CORS_ORIGIN=https://your-app.railway.app
```

4. **Dockerfile**
```dockerfile
# Goバックエンド用
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY backend/go.* ./
RUN go mod download
COPY backend/ .
RUN go build -o main .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

5. **デプロイ**
```bash
# 自動デプロイ（GitHubプッシュ時）
git push origin main

# または手動デプロイ
railway up
```

#### コスト管理
- **Redis**: Railwayの無料枠を使用
- **バックエンド**: 軽量なGoアプリ（メモリ使用量小）
- **フロントエンド**: 静的ファイルのみ
- **アラート設定**: $4で警告、$5で停止

### 代替デプロイオプション

#### フロントエンド単体
- **Vercel**: 無料プラン、自動デプロイ
- **Netlify**: 無料プラン、高速CDN
- **Cloudflare Pages**: 無料、グローバルエッジ配信

#### バックエンド単体
- **Fly.io**: 無料枠あり、グローバルデプロイ
- **Render**: 無料プラン（制限あり）

### 本番環境の設定

```bash
# backend/.env.production
REDIS_URL=${REDIS_URL}
PORT=8080
CORS_ORIGIN=https://your-app.railway.app
LOG_LEVEL=info

# frontend/.env.production
VITE_WS_URL=wss://your-app.railway.app/ws
VITE_API_URL=https://your-app.railway.app
```

## 参考リソース

### Go + WebSocket
- [gorilla/websocket ドキュメント](https://pkg.go.dev/github.com/gorilla/websocket)
- [Gin フレームワーク](https://gin-gonic.com/)
- [Go Redis クライアント](https://redis.uptrace.dev/)

### React + TypeScript
- [React 公式ドキュメント](https://react.dev/)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)
- [Vite ドキュメント](https://vitejs.dev/)

### WebSocket 実装
- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [リアルタイム通信のベストプラクティス](https://web.dev/websockets-basics/)

### Railway デプロイ
- [Railway 公式ドキュメント](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli)

### UI/UXデザイン
- [子供向けUIデザインのベストプラクティス](https://www.nngroup.com/articles/children-ux/)
- [ゲームボードデザイン](https://uxdesign.cc/)

## コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずIssueで議論してください。

## ライセンス

MIT License - 詳細は LICENSE ファイルを参照

---

**Last Updated**: 2026-01-20
**Current Phase**: フェーズ 1 - 基本実装（フロントエンド + バックエンド）
**Architecture**: React (TypeScript) + Go + Redis + WebSocket

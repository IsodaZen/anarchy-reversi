# アナーキーオセロ（Anarchy Reversi）

子供向けWeb版リバーシゲーム。手動で石をひっくり返せる自由度の高い実装が特徴。

## 🎮 プロジェクト概要

「アナーキーオセロ」は、従来のルールに縛られない自由なリバーシゲームです。
プレイヤーは手動で石を自由に操作でき、イカサマも含めて思い通りに遊べます。

### 主な仕様

- ✅ ターン制リバーシ（オセロ）
- ✅ プレイヤーが手動で石を自由に操作可能（イカサマも可能）
- ✅ リアルタイム対戦機能（WebSocket使用）
- ✅ マッチング機能なし：ルームID共有方式
- ✅ ユーザー登録不要

## 🛠️ 技術スタック

### フロントエンド

- React 19+
- TypeScript
- WebSocket Client
- CSS Modules または Tailwind CSS

### バックエンド

- Go 1.25+
- Gin（Webフレームワーク）
- gorilla/websocket（WebSocket実装）
- go-redis/redis（Redis接続）

### 主要パッケージ

```go
github.com/gin-gonic/gin      // Webフレームワーク
github.com/gorilla/websocket  // WebSocket実装
github.com/redis/go-redis/v9  // Redis接続
github.com/google/uuid        // ルームID生成
```

### デプロイ・インフラ

- Railway（Hobbyプラン）
- Docker containerデプロイ
- 月額予算：$5以内

## 🏗️ アーキテクチャ

```text
React Frontend（TypeScript）
    ↓ WebSocket
Gin Server（Go）
    - WebSocketハンドラー
    - ルーム管理API
    - ゲーム状態管理
    ↓
Redis
    - ルーム情報
    - 盤面状態
    - 接続プレイヤー情報
```

## 📁 ディレクトリ構成

```text
anarchy-reversi/
├── frontend/          # React アプリ
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── backend/           # Go サーバー
│   ├── main.go
│   ├── handlers/
│   │   ├── websocket.go
│   │   └── room.go
│   ├── models/
│   │   ├── game.go
│   │   └── room.go
│   ├── services/
│   │   └── redis.go
│   └── go.mod
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🚀 セットアップ

### 前提条件

- Node.js 19+
- Go 1.25+
- Redis
- Docker（オプション）

### ローカル開発

#### バックエンド

```bash
cd backend
go mod download
go run main.go
```

#### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

#### Docker使用時

```bash
docker-compose up
```

## 🎯 開発方針

- 子供が直感的に操作できるUI
- ルールに縛られない自由な遊び方を許容
- Goの並行処理を活かした効率的なWebSocket管理
- シンプルで軽量な実装
- 使用上限設定で予期しない課金を防ぐ

# 技術スタック

## フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19+ | UIライブラリ |
| TypeScript | 5.x | 型安全性 |
| Vite | 6.x | ビルドツール・開発サーバー |
| Redux Toolkit | 2.x | 状態管理 |
| React Router | 7.x | ルーティング（SPAモード） |
| Tailwind CSS | 4.x | スタイリング |

### 主要な依存関係

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^7.x",
  "@reduxjs/toolkit": "^2.x",
  "react-redux": "^9.x"
}
```

### 開発ツール

- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット（ESLint経由）
- **Vitest**: ユニットテスト
- **Playwright**: E2Eテスト（将来）

## バックエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Go | 1.25+ | サーバーサイド言語 |
| Gin | 1.x | Webフレームワーク |
| gorilla/websocket | 1.x | WebSocket実装 |
| go-redis/redis | 9.x | Redis接続 |
| google/uuid | 1.x | UUID生成 |

### 主要な依存関係

```go
require (
    github.com/gin-gonic/gin v1.10.0
    github.com/gorilla/websocket v1.5.0
    github.com/redis/go-redis/v9 v9.0.0
    github.com/google/uuid v1.6.0
)
```

## インフラストラクチャ

| 技術 | 用途 |
|------|------|
| Redis | ゲーム状態の永続化 |
| Docker | コンテナ化 |
| Docker Compose | ローカル開発環境 |
| Railway | 本番デプロイ |

### Redis データ構造

```
room:{roomId}     -> Hash (ルーム情報)
board:{roomId}    -> String (JSON形式の盤面)
player:{playerId} -> Hash (プレイヤー情報)
```

### TTL設定

- ルーム: 1時間（最終アクセスから）
- 盤面: 1時間
- プレイヤー: 30分

## 開発環境要件

| ツール | バージョン |
|--------|-----------|
| Node.js | 19+ (LTS推奨) |
| Go | 1.25+ |
| Docker | 最新 |
| Redis | 7+ |

## ブラウザサポート

- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

（モダンブラウザの最新2バージョン）

## パッケージマネージャー

- **フロントエンド**: npm（yarn/pnpmも可）
- **バックエンド**: Go Modules

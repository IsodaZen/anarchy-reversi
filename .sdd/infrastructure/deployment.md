# デプロイ設計

## デプロイ環境

### 本番環境（Railway）

- **プラン**: Hobbyプラン（$5/月）
- **リージョン**: US West または Asia Pacific
- **自動デプロイ**: GitHubプッシュ時

### ローカル開発環境

- **Docker Compose**: Redis + バックエンド
- **Vite Dev Server**: フロントエンド

## Dockerfile

```dockerfile
# マルチステージビルド
FROM golang:1.25-alpine AS builder

WORKDIR /app

# 依存関係のキャッシュ
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# ビルド
COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 本番イメージ
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
```

## Docker Compose（ローカル開発）

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - REDIS_URL=redis:6379
      - CORS_ORIGIN=http://localhost:5173
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

## 環境変数

### バックエンド

| 変数名 | 説明 | 開発環境 | 本番環境 |
|--------|------|---------|---------|
| `PORT` | サーバーポート | 8080 | 8080 |
| `REDIS_URL` | Redis接続URL | localhost:6379 | ${REDIS_URL} |
| `CORS_ORIGIN` | 許可オリジン | http://localhost:5173 | https://your-app.com |
| `LOG_LEVEL` | ログレベル | debug | info |

### フロントエンド

| 変数名 | 説明 | 開発環境 | 本番環境 |
|--------|------|---------|---------|
| `VITE_WS_URL` | WebSocket URL | ws://localhost:8080/ws | wss://api.your-app.com/ws |
| `VITE_API_URL` | API URL | http://localhost:8080 | https://api.your-app.com |

## デプロイ手順

### Railway（バックエンド）

```bash
# 1. Railway CLIインストール
npm install -g @railway/cli

# 2. ログイン
railway login

# 3. プロジェクト初期化
railway init

# 4. Redis追加
railway add --plugin redis

# 5. 環境変数設定
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app

# 6. デプロイ
railway up
```

### Vercel（フロントエンド）

```bash
# 1. Vercel CLIインストール
npm install -g vercel

# 2. デプロイ
cd frontend
vercel

# 3. 環境変数設定（Vercelダッシュボード）
VITE_WS_URL=wss://your-backend.railway.app/ws
VITE_API_URL=https://your-backend.railway.app
```

## CI/CD

### GitHub Actions（将来実装）

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-action@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## ヘルスチェック

### Railway設定

```toml
# railway.toml
[healthcheck]
path = "/api/health"
timeout = 30
interval = 60
```

## ロールバック

1. Railwayダッシュボードで前回のデプロイを選択
2. "Rollback" ボタンをクリック
3. 自動的に前バージョンに戻る

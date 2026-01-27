# REST API設計

## 概要

Ginフレームワークによるシンプルなルーム管理API。
主要な操作はWebSocket経由で行うため、REST APIは最小限。

## エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/rooms` | ルーム作成 |
| GET | `/api/rooms/:roomId` | ルーム情報取得 |
| GET | `/api/health` | ヘルスチェック |
| GET | `/ws` | WebSocket接続 |

## エンドポイント詳細

### POST /api/rooms

新しいルームを作成する。

**リクエスト**:
```json
{
  "playerName": "プレイヤー1"  // オプション
}
```

**レスポンス（成功）**:
```json
{
  "roomId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "playerId": "p1234567-89ab-cdef-0123-456789abcdef",
  "createdAt": 1706300000
}
```

**レスポンス（エラー）**:
```json
{
  "error": "ルームの作成に失敗しました",
  "code": "ROOM_CREATE_FAILED"
}
```

**ステータスコード**:
- 201 Created: 成功
- 400 Bad Request: リクエスト不正
- 500 Internal Server Error: サーバーエラー

### GET /api/rooms/:roomId

ルームの情報を取得する。

**パスパラメータ**:
- `roomId`: ルームID（UUID形式）

**レスポンス（成功）**:
```json
{
  "roomId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "playerCount": 2,
  "createdAt": 1706300000,
  "status": "playing"
}
```

**レスポンス（エラー）**:
```json
{
  "error": "ルームが見つかりません",
  "code": "ROOM_NOT_FOUND"
}
```

**ステータスコード**:
- 200 OK: 成功
- 404 Not Found: ルームが存在しない
- 500 Internal Server Error: サーバーエラー

### GET /api/health

サーバーとRedisの接続状態を確認する。

**レスポンス**:
```json
{
  "status": "healthy",
  "redis": "connected",
  "uptime": 3600
}
```

**ステータスコード**:
- 200 OK: 正常
- 503 Service Unavailable: Redis接続エラー

## 共通仕様

### リクエストヘッダー

```
Content-Type: application/json
```

### レスポンスヘッダー

```
Content-Type: application/json
Access-Control-Allow-Origin: <許可されたオリジン>
```

### CORS設定

```go
config := cors.Config{
    AllowOrigins:     []string{os.Getenv("CORS_ORIGIN")},
    AllowMethods:     []string{"GET", "POST", "OPTIONS"},
    AllowHeaders:     []string{"Content-Type"},
    AllowCredentials: true,
}
```

### エラーコード

| コード | 説明 |
|--------|------|
| `ROOM_CREATE_FAILED` | ルーム作成失敗 |
| `ROOM_NOT_FOUND` | ルームが存在しない |
| `ROOM_FULL` | ルームが満員 |
| `INVALID_REQUEST` | リクエスト不正 |
| `INTERNAL_ERROR` | サーバー内部エラー |

## レート制限（将来実装）

- ルーム作成: 1分あたり5回/IP
- 情報取得: 1分あたり60回/IP

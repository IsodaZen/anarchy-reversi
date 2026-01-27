# データベース（Redis）設計

## 概要

Redisをゲーム状態の永続化に使用。
インメモリDBの高速性を活かしたリアルタイム同期。

## 接続設定

### ローカル開発

```go
client := redis.NewClient(&redis.Options{
    Addr: "localhost:6379",
    DB:   0,
})
```

### Railway（本番）

```go
opt, _ := redis.ParseURL(os.Getenv("REDIS_URL"))
client := redis.NewClient(opt)
```

## データ構造

### room:{roomId}

ルーム情報をHashで保存。

```
HSET room:a1b2c3d4-...
    id          "a1b2c3d4-e5f6-..."
    status      "playing"
    createdAt   "1706300000"
    playerCount "2"

EXPIRE room:a1b2c3d4-... 3600
```

### board:{roomId}

盤面状態をJSON文字列で保存。

```
SET board:a1b2c3d4-... '[[null,null,...],...]'
EXPIRE board:a1b2c3d4-... 3600
```

### players:{roomId}

ルーム内のプレイヤーIDをSetで保存。

```
SADD players:a1b2c3d4-... "player1-..." "player2-..."
EXPIRE players:a1b2c3d4-... 3600
```

### player:{playerId}

プレイヤー情報をHashで保存。

```
HSET player:p1234567-...
    id        "p1234567-..."
    roomId    "a1b2c3d4-..."
    color     "black"
    joinedAt  "1706300000"

EXPIRE player:p1234567-... 1800
```

## TTL（Time To Live）設定

| キー | TTL | 理由 |
|-----|-----|------|
| room:* | 1時間 | 非アクティブルームの自動削除 |
| board:* | 1時間 | ルームと同期 |
| players:* | 1時間 | ルームと同期 |
| player:* | 30分 | 切断プレイヤーの早期削除 |

### TTL更新タイミング

- セル操作時にルーム・盤面のTTLをリフレッシュ
- プレイヤーのハートビート受信時にTTLをリフレッシュ

## Redis操作例

### ルーム作成

```go
func CreateRoom(ctx context.Context, roomID string) error {
    pipe := client.Pipeline()

    // ルーム情報
    pipe.HSet(ctx, "room:"+roomID, map[string]interface{}{
        "id":          roomID,
        "status":      "waiting",
        "createdAt":   time.Now().Unix(),
        "playerCount": 0,
    })
    pipe.Expire(ctx, "room:"+roomID, time.Hour)

    // 初期盤面
    initialBoard, _ := json.Marshal(NewInitialBoard())
    pipe.Set(ctx, "board:"+roomID, initialBoard, time.Hour)

    _, err := pipe.Exec(ctx)
    return err
}
```

### 盤面更新

```go
func UpdateBoard(ctx context.Context, roomID string, board Board) error {
    data, err := json.Marshal(board)
    if err != nil {
        return err
    }

    // 盤面を更新し、TTLをリフレッシュ
    pipe := client.Pipeline()
    pipe.Set(ctx, "board:"+roomID, data, time.Hour)
    pipe.Expire(ctx, "room:"+roomID, time.Hour)
    _, err = pipe.Exec(ctx)
    return err
}
```

### 盤面取得

```go
func GetBoard(ctx context.Context, roomID string) (Board, error) {
    data, err := client.Get(ctx, "board:"+roomID).Bytes()
    if err != nil {
        return Board{}, err
    }

    var board Board
    err = json.Unmarshal(data, &board)
    return board, err
}
```

## メモリ使用量見積もり

| データ | サイズ/個 | 最大数 | 合計 |
|--------|----------|--------|------|
| ルーム | ~200B | 50 | 10KB |
| 盤面 | ~500B | 50 | 25KB |
| プレイヤー | ~150B | 100 | 15KB |
| **合計** | | | **~50KB** |

Railway無料枠のRedis（25MB）で十分対応可能。

## バックアップ

### 現状（不要）

- ゲームデータは一時的なもの
- 障害時はリセットで対応

### 将来（必要に応じて）

- Redis RDB/AOFの有効化
- 定期的なスナップショット

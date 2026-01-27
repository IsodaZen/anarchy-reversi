# WebSocket設計

## 概要

gorilla/websocketを使用したリアルタイム双方向通信。
ルーム単位でブロードキャストを実現。

## 接続

### エンドポイント

```
ws://localhost:8080/ws?roomId={roomId}&playerId={playerId}
wss://your-app.railway.app/ws?roomId={roomId}&playerId={playerId}
```

### クエリパラメータ

| パラメータ | 必須 | 説明 |
|-----------|------|------|
| `roomId` | Yes | ルームID |
| `playerId` | No | プレイヤーID（再接続時） |

## メッセージ形式

### 基本構造

```typescript
interface WebSocketMessage {
  type: MessageType;
  payload?: unknown;
  timestamp: number;
}
```

## クライアント → サーバー メッセージ

### CELL_TOGGLE

セルの状態を切り替える。

```json
{
  "type": "CELL_TOGGLE",
  "payload": {
    "row": 3,
    "col": 4
  },
  "timestamp": 1706300000000
}
```

### GAME_RESET

ゲームをリセットする。

```json
{
  "type": "GAME_RESET",
  "timestamp": 1706300000000
}
```

## サーバー → クライアント メッセージ

### ROOM_CREATED

ルーム作成完了通知。

```json
{
  "type": "ROOM_CREATED",
  "payload": {
    "roomId": "a1b2c3d4-...",
    "playerId": "p1234567-..."
  },
  "timestamp": 1706300000000
}
```

### ROOM_JOINED

ルーム参加完了通知。

```json
{
  "type": "ROOM_JOINED",
  "payload": {
    "roomId": "a1b2c3d4-...",
    "playerId": "p1234567-...",
    "board": [
      [null, null, null, null, null, null, null, null],
      // ... 8x8 配列
    ]
  },
  "timestamp": 1706300000000
}
```

### PLAYER_JOINED

他プレイヤーの参加通知。

```json
{
  "type": "PLAYER_JOINED",
  "payload": {
    "playerId": "p7654321-...",
    "playerCount": 2
  },
  "timestamp": 1706300000000
}
```

### PLAYER_LEFT

プレイヤーの退出通知。

```json
{
  "type": "PLAYER_LEFT",
  "payload": {
    "playerId": "p7654321-...",
    "playerCount": 1
  },
  "timestamp": 1706300000000
}
```

### BOARD_UPDATE

盤面更新通知（ブロードキャスト）。

```json
{
  "type": "BOARD_UPDATE",
  "payload": {
    "board": [
      [null, null, null, null, null, null, null, null],
      // ... 8x8 配列
    ]
  },
  "timestamp": 1706300000000
}
```

### ERROR

エラー通知。

```json
{
  "type": "ERROR",
  "payload": {
    "message": "ルームが見つかりません",
    "code": "ROOM_NOT_FOUND"
  },
  "timestamp": 1706300000000
}
```

## 接続管理

### 接続フロー

```
クライアント                    サーバー
    │                              │
    │─── WebSocket接続リクエスト ─>│
    │                              │
    │                              │─── ルームID検証
    │                              │─── プレイヤー登録
    │                              │
    │<── ROOM_JOINED ──────────────│
    │                              │
    │                              │─── 他プレイヤーに通知
    │                              │──> PLAYER_JOINED
```

### 切断処理

```go
// クライアント切断時の処理
defer func() {
    // 1. コネクションをクローズ
    conn.Close()

    // 2. ルームから削除
    room.RemovePlayer(playerId)

    // 3. 他プレイヤーに通知
    room.Broadcast(PlayerLeftMessage{...})

    // 4. ルームが空なら削除（TTLに任せる）
}()
```

### 再接続

- 同じplayerIdで再接続可能
- 30秒以内の再接続で状態を復元
- 盤面状態はRedisから取得

## Ping/Pong

接続維持のためのハートビート。

```go
// サーバー側
ticker := time.NewTicker(30 * time.Second)
for {
    select {
    case <-ticker.C:
        conn.WriteMessage(websocket.PingMessage, nil)
    }
}

// クライアントは自動でPongを返す
```

## エラーハンドリング

| エラー | 対応 |
|--------|------|
| 接続タイムアウト | 自動再接続を試行 |
| 不正なメッセージ | ERRORメッセージを返す |
| ルーム満員 | 接続を拒否 |
| サーバーエラー | 接続をクローズ |

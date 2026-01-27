# データモデル設計

## 概要

Goの構造体で定義するドメインモデル。
Redisへのシリアライズ/デシリアライズにはJSONを使用。

## モデル定義

### CellState

セルの状態を表す型。

```go
type CellState string

const (
    CellBlack CellState = "black"
    CellWhite CellState = "white"
    CellEmpty CellState = ""  // JSONではnullとして扱う
)
```

### Board

8x8の盤面を表す型。

```go
type Board [8][8]CellState
```

**JSON表現**:
```json
[
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, "white", "black", null, null, null],
  [null, null, null, "black", "white", null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null]
]
```

### GameState

ゲームの状態を表す構造体。

```go
type GameState struct {
    RoomID    string    `json:"roomId"`
    Board     Board     `json:"board"`
    Score     Score     `json:"score"`
    UpdatedAt time.Time `json:"updatedAt"`
}

type Score struct {
    Black int `json:"black"`
    White int `json:"white"`
}
```

### Room

ルーム情報を表す構造体。

```go
type Room struct {
    ID        string    `json:"id"`
    Players   []Player  `json:"players"`
    CreatedAt time.Time `json:"createdAt"`
    Status    string    `json:"status"`  // "waiting", "playing", "finished"
}
```

### Player

プレイヤー情報を表す構造体。

```go
type Player struct {
    ID        string    `json:"id"`
    Name      string    `json:"name,omitempty"`
    Color     string    `json:"color"`  // "black", "white", "spectator"
    JoinedAt  time.Time `json:"joinedAt"`
    IsOnline  bool      `json:"isOnline"`
}
```

## Redisキー設計

### キー命名規則

```
{entity}:{id}
{entity}:{id}:{sub-entity}
```

### キー一覧

| キー | 型 | 説明 | TTL |
|-----|-----|------|-----|
| `room:{roomId}` | Hash | ルーム情報 | 1時間 |
| `board:{roomId}` | String | 盤面状態（JSON） | 1時間 |
| `players:{roomId}` | Set | ルーム内プレイヤーID | 1時間 |
| `player:{playerId}` | Hash | プレイヤー情報 | 30分 |

### データ例

**room:a1b2c3d4-...**
```
HSET room:a1b2c3d4-...
    id "a1b2c3d4-..."
    status "playing"
    createdAt "1706300000"
```

**board:a1b2c3d4-...**
```
SET board:a1b2c3d4-... '[[null,...],...]'
```

**players:a1b2c3d4-...**
```
SADD players:a1b2c3d4-... "p1234567-..." "p7654321-..."
```

## バリデーション

### 座標のバリデーション

```go
func ValidatePosition(row, col int) error {
    if row < 0 || row >= 8 || col < 0 || col >= 8 {
        return errors.New("invalid position: must be 0-7")
    }
    return nil
}
```

### ルームIDのバリデーション

```go
func ValidateRoomID(roomID string) error {
    _, err := uuid.Parse(roomID)
    if err != nil {
        return errors.New("invalid room ID format")
    }
    return nil
}
```

## ヘルパー関数

### 初期盤面の作成

```go
func NewInitialBoard() Board {
    var board Board
    // すべて空の状態で初期化
    // オプション: 中央4マスに初期配置
    return board
}
```

### スコア計算

```go
func (b *Board) CalculateScore() Score {
    var score Score
    for row := 0; row < 8; row++ {
        for col := 0; col < 8; col++ {
            switch b[row][col] {
            case CellBlack:
                score.Black++
            case CellWhite:
                score.White++
            }
        }
    }
    return score
}
```

### セル切り替え

```go
func (b *Board) ToggleCell(row, col int) {
    switch b[row][col] {
    case CellBlack:
        b[row][col] = CellWhite
    case CellWhite:
        b[row][col] = CellEmpty
    default:
        b[row][col] = CellBlack
    }
}
```

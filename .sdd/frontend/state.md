# 状態管理設計

## 状態管理アーキテクチャ

Redux Toolkitを使用したグローバル状態管理。

```
┌─────────────────────────────────────────┐
│              Redux Store                 │
├─────────────────────────────────────────┤
│  gameSlice                               │
│  ├── board: Board                        │
│  ├── score: { black, white }            │
│  ├── roomId: string | null              │
│  ├── playerId: string | null            │
│  └── isConnected: boolean               │
└─────────────────────────────────────────┘
```

## 型定義

### CellState

```typescript
type CellState = 'black' | 'white' | null;
```

### Board

```typescript
type Board = CellState[][];  // 8x8の2次元配列
```

### GameState

```typescript
interface GameState {
  board: Board;
  score: { black: number; white: number };
  roomId: string | null;
  playerId: string | null;
  isConnected: boolean;
}
```

## Actions

### toggleCell

セルの状態を切り替える（黒 → 白 → 空 → 黒）。

```typescript
toggleCell({ row: number, col: number })
```

**フロー**:
1. 現在のセル状態を取得
2. 次の状態に変更: black → white → null → black
3. スコアを再計算

### updateBoard

盤面全体を更新する（サーバーからの同期用）。

```typescript
updateBoard(board: Board)
```

### resetGame

ゲームを初期状態にリセット。

```typescript
resetGame()
```

### setRoom

ルーム情報を設定。

```typescript
setRoom({ roomId: string, playerId: string })
```

### setConnected

接続状態を更新。

```typescript
setConnected(isConnected: boolean)
```

### leaveRoom

ルームから退出し、状態をリセット。

```typescript
leaveRoom()
```

## セレクター

```typescript
// 盤面を取得
const board = useAppSelector((state) => state.game.board);

// スコアを取得
const score = useAppSelector((state) => state.game.score);

// 接続状態を取得
const isConnected = useAppSelector((state) => state.game.isConnected);

// ルームIDを取得
const roomId = useAppSelector((state) => state.game.roomId);
```

## 状態同期フロー

### 楽観的更新（Optimistic Update）

```
ユーザー操作
    │
    ▼
┌─────────────────┐
│  Redux更新      │ ← 即座にUIに反映
│  (toggleCell)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WebSocket送信  │ ← CELL_TOGGLEメッセージ
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  サーバー処理   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  BOARD_UPDATE   │ ← 全クライアントに配信
│  受信・同期     │
└─────────────────┘
```

### 競合解決

サーバーからのBOARD_UPDATEは常に正として扱い、ローカル状態を上書き。

## ローカル状態（useState）

コンポーネント固有の状態は useState で管理:

- フォーム入力値
- UIの開閉状態
- アニメーション状態
- ローディング状態

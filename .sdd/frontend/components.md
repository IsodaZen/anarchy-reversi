# コンポーネント設計

## コンポーネント階層

```
App
├── Home (/)
│   └── RoomControl
│       ├── CreateRoomButton
│       └── JoinRoomForm
│
└── GameRoom (/room/:roomId)
    ├── GameInfo
    │   ├── RoomIdDisplay
    │   └── ConnectionStatus
    ├── Board
    │   └── Cell (64個)
    │       └── Piece (条件付き)
    └── ScoreBoard
        ├── PlayerScore (Black)
        └── PlayerScore (White)
```

## 主要コンポーネント

### Board

ゲームボードを表示する8x8グリッドコンポーネント。

```typescript
interface BoardProps {
  board: Board;
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}
```

**責務**:
- 8x8グリッドのレンダリング
- セルクリックイベントの親への伝播
- 盤面の視覚的表現

### Cell

個別のマスを表す最小単位のコンポーネント。

```typescript
interface CellProps {
  state: CellState;
  row: number;
  col: number;
  onClick: () => void;
}
```

**責務**:
- セルの状態に応じた表示（黒/白/空）
- クリックイベントのハンドリング
- ホバー・フォーカス状態の表示

### Piece

石を表示するコンポーネント。

```typescript
interface PieceProps {
  color: 'black' | 'white';
  isAnimating?: boolean;
}
```

**責務**:
- 石の色の表示
- フリップアニメーション（将来実装）
- サイズのレスポンシブ対応

### RoomControl

ルーム作成・参加UIを提供するコンポーネント。

```typescript
interface RoomControlProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  isLoading?: boolean;
}
```

**責務**:
- ルーム作成ボタンの表示
- ルームID入力フォームの表示
- バリデーションとエラー表示

### ScoreBoard

スコアを表示するコンポーネント。

```typescript
interface ScoreBoardProps {
  blackScore: number;
  whiteScore: number;
  currentTurn?: 'black' | 'white';
}
```

**責務**:
- 黒・白の石の数を表示
- 現在のターンを視覚的に表示（オプション）

### GameInfo

ゲーム情報を表示するコンポーネント。

```typescript
interface GameInfoProps {
  roomId: string;
  isConnected: boolean;
  playerCount: number;
}
```

**責務**:
- ルームIDの表示とコピー機能
- 接続状態の表示
- プレイヤー数の表示

## 子供向けUI考慮事項

- **大きなクリックターゲット**: 最小44x44px
- **明確な視覚フィードバック**: ホバー、アクティブ状態
- **カラフルなデザイン**: 黒白以外にも背景色やアクセントカラー
- **シンプルなレイアウト**: 情報過多を避ける
- **大きなフォントサイズ**: 最小16px

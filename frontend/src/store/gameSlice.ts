import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Board, CellState } from '../types/game';

// 初期盤面を作成（8x8の空ボード）
const createInitialBoard = (): Board => {
  return Array(8).fill(null).map(() => Array(8).fill(null));
};

const initialState: GameState = {
  board: createInitialBoard(),
  score: { black: 0, white: 0 },
  roomId: null,
  playerId: null,
  isConnected: false,
};

// スコアを計算するヘルパー関数
const calculateScore = (board: Board): { black: number; white: number } => {
  let black = 0;
  let white = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'black') black++;
      if (board[row][col] === 'white') white++;
    }
  }

  return { black, white };
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // セルの状態を切り替え（黒 → 白 → 空 → 黒）
    toggleCell: (state, action: PayloadAction<{ row: number; col: number }>) => {
      const { row, col } = action.payload;
      const current = state.board[row][col];

      if (current === 'black') {
        state.board[row][col] = 'white';
      } else if (current === 'white') {
        state.board[row][col] = null;
      } else {
        state.board[row][col] = 'black';
      }

      // スコアを再計算
      state.score = calculateScore(state.board);
    },

    // ボード全体を更新
    updateBoard: (state, action: PayloadAction<Board>) => {
      state.board = action.payload;
      state.score = calculateScore(action.payload);
    },

    // ゲームをリセット
    resetGame: (state) => {
      state.board = createInitialBoard();
      state.score = { black: 0, white: 0 };
    },

    // ルーム情報を設定
    setRoom: (state, action: PayloadAction<{ roomId: string; playerId: string }>) => {
      state.roomId = action.payload.roomId;
      state.playerId = action.payload.playerId;
    },

    // 接続状態を更新
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    // ルームから退出
    leaveRoom: (state) => {
      state.roomId = null;
      state.playerId = null;
      state.isConnected = false;
      state.board = createInitialBoard();
      state.score = { black: 0, white: 0 };
    },
  },
});

export const {
  toggleCell,
  updateBoard,
  resetGame,
  setRoom,
  setConnected,
  leaveRoom,
} = gameSlice.actions;

export default gameSlice.reducer;

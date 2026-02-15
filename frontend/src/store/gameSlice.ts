import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GameState, Board, Position } from '../types/game';
import { createInitialBoard, calculateScore, hasValidMoves } from '../utils/gameLogic';

const initialBoard = createInitialBoard();

const initialState: GameState = {
  board: initialBoard,
  score: calculateScore(initialBoard),
  currentTurn: 'black',
  phase: 'placement',
  flippingCells: [],
  flippedCells: [],
  flipCount: 0,
  roomId: null,
  playerId: null,
  isConnected: false,
  isGameOver: false,
  winner: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // 配置フェーズで合法手に石を配置し、裏返しフェーズへ遷移
    placePiece: (state, action: PayloadAction<Position>) => {
      if (state.isGameOver) return;
      const { row, col } = action.payload;
      state.board[row][col] = state.currentTurn;
      state.phase = 'flipping';
      state.score = calculateScore(state.board);
    },

    // 裏返しフェーズで石を裏返す（相手→自分）またはアンフリップ（自分→相手）
    flipPiece: (state, action: PayloadAction<Position>) => {
      if (state.isGameOver) return;
      const { row, col } = action.payload;
      const opponent = state.currentTurn === 'black' ? 'white' : 'black';
      const isUnflip = state.flippedCells.some(
        (c) => c.row === row && c.col === col,
      );

      if (isUnflip) {
        // アンフリップ: 裏返し済みの石を元に戻す
        state.board[row][col] = opponent;
        state.flippingCells.push({ row, col });
        state.flippedCells = state.flippedCells.filter(
          (c) => c.row !== row || c.col !== col,
        );
        state.flipCount -= 1;
      } else {
        // 通常フリップ: 相手の石を自分の色に裏返す
        state.board[row][col] = state.currentTurn;
        state.flippingCells.push({ row, col });
        state.flippedCells.push({ row, col });
        state.flipCount += 1;
      }
      state.score = calculateScore(state.board);
    },

    // フリップアニメーション完了後にクリア
    clearFlipping: (state, action: PayloadAction<Position>) => {
      const { row, col } = action.payload;
      state.flippingCells = state.flippingCells.filter(
        (c) => c.row !== row || c.col !== col,
      );
    },

    // 手番終了：手番を交代し配置フェーズに戻す（自動パス対応）
    endTurn: (state) => {
      const opponent = state.currentTurn === 'black' ? 'white' : 'black';

      if (hasValidMoves(state.board, opponent)) {
        // 相手に合法手があれば交代
        state.currentTurn = opponent;
      } else if (hasValidMoves(state.board, state.currentTurn)) {
        // 相手に合法手がなく、自分にある場合は自動パス（手番そのまま）
      }
      // 両者とも合法手がない場合はゲーム終了
      if (!hasValidMoves(state.board, 'black') && !hasValidMoves(state.board, 'white')) {
        state.isGameOver = true;
        const { black, white } = state.score;
        state.winner = black > white ? 'black' : white > black ? 'white' : 'draw';
      }

      state.phase = 'placement';
      state.flippingCells = [];
      state.flippedCells = [];
      state.flipCount = 0;
    },

    // ボード全体を更新
    updateBoard: (state, action: PayloadAction<Board>) => {
      state.board = action.payload;
      state.score = calculateScore(action.payload);
    },

    // ゲームをリセット
    resetGame: (state) => {
      const board = createInitialBoard();
      state.board = board;
      state.score = calculateScore(board);
      state.currentTurn = 'black';
      state.phase = 'placement';
      state.flippingCells = [];
      state.flippedCells = [];
      state.flipCount = 0;
      state.isGameOver = false;
      state.winner = null;
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
      const board = createInitialBoard();
      state.board = board;
      state.score = calculateScore(board);
      state.currentTurn = 'black';
      state.phase = 'placement';
      state.flippingCells = [];
      state.flippedCells = [];
      state.flipCount = 0;
      state.isGameOver = false;
      state.winner = null;
    },
  },
});

export const {
  placePiece,
  flipPiece,
  clearFlipping,
  endTurn,
  updateBoard,
  resetGame,
  setRoom,
  setConnected,
  leaveRoom,
} = gameSlice.actions;

export default gameSlice.reducer;

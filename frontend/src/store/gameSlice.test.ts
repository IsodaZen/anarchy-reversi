import { describe, it, expect } from 'vitest';
import gameReducer, { placePiece, flipPiece, endTurn, resetGame } from './gameSlice';
import type { GameState, Board } from '../types/game';
import { createInitialBoard, calculateScore } from '../utils/gameLogic';

function createDefaultState(): GameState {
  const board = createInitialBoard();
  return {
    board,
    score: calculateScore(board),
    currentTurn: 'black',
    phase: 'placement',
    flippingCells: [],
    roomId: null,
    playerId: null,
    isConnected: false,
  };
}

describe('gameSlice - placePiece', () => {
  it('配置フェーズで合法手に石を配置する', () => {
    const state = createDefaultState();
    // (2,3) は黒番の合法手
    const next = gameReducer(state, placePiece({ row: 2, col: 3 }));
    expect(next.board[2][3]).toBe('black');
  });

  it('石の配置後にフェーズがflippingに遷移する', () => {
    const state = createDefaultState();
    const next = gameReducer(state, placePiece({ row: 2, col: 3 }));
    expect(next.phase).toBe('flipping');
  });

  it('石の配置後にスコアが再計算される', () => {
    const state = createDefaultState();
    const next = gameReducer(state, placePiece({ row: 2, col: 3 }));
    expect(next.score.black).toBe(3);
    expect(next.score.white).toBe(2);
  });

  it('手番は配置後も変わらない（flippingフェーズのため）', () => {
    const state = createDefaultState();
    const next = gameReducer(state, placePiece({ row: 2, col: 3 }));
    expect(next.currentTurn).toBe('black');
  });
});

describe('gameSlice - resetGame', () => {
  it('リセットで盤面が初期状態に戻る', () => {
    const state = createDefaultState();
    const modified = gameReducer(state, placePiece({ row: 2, col: 3 }));
    const reset = gameReducer(modified, resetGame());
    expect(reset.board).toEqual(createInitialBoard());
  });

  it('リセットで手番が黒番に戻る', () => {
    const state = createDefaultState();
    state.currentTurn = 'white';
    const reset = gameReducer(state, resetGame());
    expect(reset.currentTurn).toBe('black');
  });

  it('リセットでフェーズがplacementに戻る', () => {
    const state = createDefaultState();
    state.phase = 'flipping';
    const reset = gameReducer(state, resetGame());
    expect(reset.phase).toBe('placement');
  });

  it('リセットでスコアが初期値に戻る', () => {
    const state = createDefaultState();
    const reset = gameReducer(state, resetGame());
    expect(reset.score).toEqual({ black: 2, white: 2 });
  });
});

describe('gameSlice - flipPiece', () => {
  it('裏返しフェーズで相手の石を自分の色に変える', () => {
    const state = createDefaultState();
    // 黒が(2,3)に配置→flippingフェーズへ
    const afterPlace = gameReducer(state, placePiece({ row: 2, col: 3 }));
    // 白の石(3,3)を裏返す
    const afterFlip = gameReducer(afterPlace, flipPiece({ row: 3, col: 3 }));
    expect(afterFlip.board[3][3]).toBe('black');
  });

  it('裏返し後にスコアが再計算される', () => {
    const state = createDefaultState();
    const afterPlace = gameReducer(state, placePiece({ row: 2, col: 3 }));
    const afterFlip = gameReducer(afterPlace, flipPiece({ row: 3, col: 3 }));
    expect(afterFlip.score.black).toBe(4);
    expect(afterFlip.score.white).toBe(1);
  });

  it('複数回裏返しが可能（制限なし）', () => {
    const state = createDefaultState();
    const afterPlace = gameReducer(state, placePiece({ row: 2, col: 3 }));
    const afterFlip1 = gameReducer(afterPlace, flipPiece({ row: 3, col: 3 }));
    const afterFlip2 = gameReducer(afterFlip1, flipPiece({ row: 4, col: 4 }));
    expect(afterFlip2.board[3][3]).toBe('black');
    expect(afterFlip2.board[4][4]).toBe('black');
  });
});

describe('gameSlice - endTurn', () => {
  it('手番終了で手番が交代する', () => {
    const state = createDefaultState();
    const afterPlace = gameReducer(state, placePiece({ row: 2, col: 3 }));
    const afterEnd = gameReducer(afterPlace, endTurn());
    expect(afterEnd.currentTurn).toBe('white');
  });

  it('手番終了でフェーズがplacementに戻る', () => {
    const state = createDefaultState();
    const afterPlace = gameReducer(state, placePiece({ row: 2, col: 3 }));
    const afterEnd = gameReducer(afterPlace, endTurn());
    expect(afterEnd.phase).toBe('placement');
  });

  it('次の手番に合法手がない場合は自動パスして元の手番に戻す', () => {
    // 白に合法手がない盤面: 黒(0,0), 白(0,1)のみ → 黒は(0,2)に置ける、白は置けない
    const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[0][0] = 'black';
    board[0][1] = 'white';
    const state: GameState = {
      board,
      score: { black: 1, white: 1 },
      currentTurn: 'black',
      phase: 'flipping',
      flippingCells: [],
      roomId: null,
      playerId: null,
      isConnected: false,
    };
    const afterEnd = gameReducer(state, endTurn());
    // 白に合法手がないので自動パスで黒のまま
    expect(afterEnd.currentTurn).toBe('black');
    expect(afterEnd.phase).toBe('placement');
  });
});

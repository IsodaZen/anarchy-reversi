import { describe, it, expect } from 'vitest';
import {
  createInitialBoard,
  calculateScore,
  isValidMove,
  getValidMoves,
  hasValidMoves,
} from './gameLogic';
import type { Board } from '../types/game';

describe('createInitialBoard', () => {
  it('8x8の盤面を生成する', () => {
    const board = createInitialBoard();
    expect(board).toHaveLength(8);
    board.forEach((row) => {
      expect(row).toHaveLength(8);
    });
  });

  it('中央4マスに初期配置を行う（d4=白, e4=黒, d5=黒, e5=白）', () => {
    const board = createInitialBoard();
    // board[row][col] — 0-indexed: d4=(3,3), e4=(3,4), d5=(4,3), e5=(4,4)
    expect(board[3][3]).toBe('white');
    expect(board[3][4]).toBe('black');
    expect(board[4][3]).toBe('black');
    expect(board[4][4]).toBe('white');
  });

  it('中央4マス以外はすべてnullである', () => {
    const board = createInitialBoard();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row === 3 || row === 4) && (col === 3 || col === 4)) continue;
        expect(board[row][col]).toBeNull();
      }
    }
  });

  it('呼び出すたびに新しいインスタンスを返す', () => {
    const board1 = createInitialBoard();
    const board2 = createInitialBoard();
    expect(board1).not.toBe(board2);
    expect(board1[0]).not.toBe(board2[0]);
  });
});

describe('calculateScore', () => {
  it('初期盤面でblack=2, white=2を返す', () => {
    const board = createInitialBoard();
    const score = calculateScore(board);
    expect(score).toEqual({ black: 2, white: 2 });
  });

  it('空の盤面でblack=0, white=0を返す', () => {
    const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    const score = calculateScore(board);
    expect(score).toEqual({ black: 0, white: 0 });
  });

  it('全て黒の盤面でblack=64, white=0を返す', () => {
    const board: Board = Array(8).fill(null).map(() => Array(8).fill('black'));
    const score = calculateScore(board);
    expect(score).toEqual({ black: 64, white: 0 });
  });

  it('入力の盤面を変更しない', () => {
    const board = createInitialBoard();
    const boardCopy = board.map((row) => [...row]);
    calculateScore(board);
    expect(board).toEqual(boardCopy);
  });
});

describe('isValidMove', () => {
  it('初期盤面で黒番の合法手を正しく判定する', () => {
    const board = createInitialBoard();
    // 初期盤面の黒番合法手: (2,3), (3,2), (4,5), (5,4)
    expect(isValidMove(board, 2, 3, 'black')).toBe(true);
    expect(isValidMove(board, 3, 2, 'black')).toBe(true);
    expect(isValidMove(board, 4, 5, 'black')).toBe(true);
    expect(isValidMove(board, 5, 4, 'black')).toBe(true);
  });

  it('石が既にある位置はfalseを返す', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 3, 3, 'black')).toBe(false);
    expect(isValidMove(board, 3, 4, 'black')).toBe(false);
  });

  it('相手の石を挟めない位置はfalseを返す', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 0, 0, 'black')).toBe(false);
    expect(isValidMove(board, 7, 7, 'black')).toBe(false);
  });

  it('初期盤面で白番の合法手を正しく判定する', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 2, 4, 'white')).toBe(true);
    expect(isValidMove(board, 3, 5, 'white')).toBe(true);
    expect(isValidMove(board, 4, 2, 'white')).toBe(true);
    expect(isValidMove(board, 5, 3, 'white')).toBe(true);
  });

  it('入力の盤面を変更しない', () => {
    const board = createInitialBoard();
    const boardCopy = board.map((row) => [...row]);
    isValidMove(board, 2, 3, 'black');
    expect(board).toEqual(boardCopy);
  });
});

describe('getValidMoves', () => {
  it('初期盤面で黒番の合法手が4箇所ある', () => {
    const board = createInitialBoard();
    const moves = getValidMoves(board, 'black');
    expect(moves).toHaveLength(4);
  });

  it('初期盤面で黒番の合法手が正しい位置を返す', () => {
    const board = createInitialBoard();
    const moves = getValidMoves(board, 'black');
    const positions = moves.map((m) => `${m.row},${m.col}`).sort();
    expect(positions).toEqual(['2,3', '3,2', '4,5', '5,4']);
  });

  it('初期盤面で白番の合法手が4箇所ある', () => {
    const board = createInitialBoard();
    const moves = getValidMoves(board, 'white');
    expect(moves).toHaveLength(4);
    const positions = moves.map((m) => `${m.row},${m.col}`).sort();
    expect(positions).toEqual(['2,4', '3,5', '4,2', '5,3']);
  });

  it('合法手がない盤面で空配列を返す', () => {
    // 全て黒で埋まった盤面
    const board: Board = Array(8).fill(null).map(() => Array(8).fill('black'));
    const moves = getValidMoves(board, 'white');
    expect(moves).toEqual([]);
  });
});

describe('hasValidMoves', () => {
  it('初期盤面で黒番はtrueを返す', () => {
    const board = createInitialBoard();
    expect(hasValidMoves(board, 'black')).toBe(true);
  });

  it('合法手がない盤面でfalseを返す', () => {
    const board: Board = Array(8).fill(null).map(() => Array(8).fill('black'));
    expect(hasValidMoves(board, 'white')).toBe(false);
  });

  it('空の盤面でfalseを返す', () => {
    const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    expect(hasValidMoves(board, 'black')).toBe(false);
  });
});

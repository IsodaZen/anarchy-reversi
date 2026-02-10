import type { Board, PlayerColor, Position } from '../types/game';

export const BOARD_SIZE = 8;

// 8方向の移動ベクトル
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

/** 中央4マスに初期配置した8x8盤面を生成する */
export function createInitialBoard(): Board {
  const board: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  // d4=白, e4=黒, d5=黒, e5=白（0-indexed: row3col3, row3col4, row4col3, row4col4）
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';

  return board;
}

/** 盤面上の黒石・白石の数をカウントする */
export function calculateScore(board: Board): { black: number; white: number } {
  let black = 0;
  let white = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 'black') black++;
      if (board[row][col] === 'white') white++;
    }
  }

  return { black, white };
}

/** 指定位置が指定プレイヤーにとって合法手かどうかを判定する */
export function isValidMove(
  board: Board,
  row: number,
  col: number,
  player: PlayerColor,
): boolean {
  // 範囲外チェック
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;

  // 既に石がある場合は不可
  if (board[row][col] !== null) return false;

  const opponent: PlayerColor = player === 'black' ? 'white' : 'black';

  for (const [dr, dc] of DIRECTIONS) {
    let r = row + dr;
    let c = col + dc;
    let foundOpponent = false;

    // 相手の石を辿る
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
      foundOpponent = true;
      r += dr;
      c += dc;
    }

    // 相手の石の先に自分の石があれば挟める
    if (foundOpponent && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      return true;
    }
  }

  return false;
}

/** 指定プレイヤーの合法手（配置可能な位置）を全て返す */
export function getValidMoves(board: Board, player: PlayerColor): Position[] {
  const moves: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(board, row, col, player)) {
        moves.push({ row, col });
      }
    }
  }

  return moves;
}

/** 指定プレイヤーに1つ以上の合法手があるかどうかを判定する */
export function hasValidMoves(board: Board, player: PlayerColor): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(board, row, col, player)) {
        return true;
      }
    }
  }

  return false;
}

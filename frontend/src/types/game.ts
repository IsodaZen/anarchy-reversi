// ゲームの型定義

export type CellState = 'black' | 'white' | null;
export type Board = CellState[][];

export interface GameState {
  board: Board;
  score: { black: number; white: number };
  roomId: string | null;
  playerId: string | null;
  isConnected: boolean;
}

export interface Player {
  id: string;
  name?: string;
  color: 'black' | 'white';
}

export interface Room {
  id: string;
  players: Player[];
  createdAt: number;
}

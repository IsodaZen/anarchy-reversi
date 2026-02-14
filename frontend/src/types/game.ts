// ゲームの型定義

export type CellState = 'black' | 'white' | null;
export type Board = CellState[][];
export type PlayerColor = 'black' | 'white';
export type GamePhase = 'placement' | 'flipping';

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: Board;
  score: { black: number; white: number };
  currentTurn: PlayerColor;
  phase: GamePhase;
  flippingCells: Position[];
  flipCount: number;
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

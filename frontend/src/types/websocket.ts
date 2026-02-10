// WebSocketメッセージの型定義

import type { Board, CellState } from './game';

export type MessageType =
  | 'ROOM_CREATED'
  | 'ROOM_JOINED'
  | 'PLAYER_JOINED'
  | 'PLAYER_LEFT'
  | 'BOARD_UPDATE'
  | 'CELL_TOGGLE'
  | 'GAME_RESET'
  | 'ERROR';

export interface WebSocketMessage {
  type: MessageType;
  payload?: unknown;
  timestamp: number;
}

export interface RoomCreatedMessage extends WebSocketMessage {
  type: 'ROOM_CREATED';
  payload: {
    roomId: string;
    playerId: string;
  };
}

export interface RoomJoinedMessage extends WebSocketMessage {
  type: 'ROOM_JOINED';
  payload: {
    roomId: string;
    playerId: string;
    board: Board;
  };
}

export interface BoardUpdateMessage extends WebSocketMessage {
  type: 'BOARD_UPDATE';
  payload: {
    board: Board;
  };
}

export interface CellToggleMessage extends WebSocketMessage {
  type: 'CELL_TOGGLE';
  payload: {
    row: number;
    col: number;
    state: CellState;
  };
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'ERROR';
  payload: {
    message: string;
  };
}

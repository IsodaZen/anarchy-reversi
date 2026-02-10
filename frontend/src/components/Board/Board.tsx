import { useMemo } from 'react';
import type { Board as BoardType, GamePhase, PlayerColor, Position } from '../../types/game';
import { Cell } from '../Cell/Cell';

interface BoardProps {
  board: BoardType;
  validMoves: Position[];
  phase: GamePhase;
  currentTurn: PlayerColor;
  onCellClick: (row: number, col: number) => void;
}

export function Board({ board, validMoves, phase, currentTurn, onCellClick }: BoardProps) {
  const validMoveSet = useMemo(
    () => new Set(validMoves.map((m) => `${m.row},${m.col}`)),
    [validMoves],
  );
  const opponent = currentTurn === 'black' ? 'white' : 'black';

  return (
    <div
      data-testid="board"
      role="grid"
      aria-label="リバーシ盤面"
      className="grid grid-cols-8 aspect-square max-w-2xl mx-auto border-2 border-green-800 rounded"
    >
      {board.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const isValidMove = phase === 'placement' && validMoveSet.has(`${rowIdx},${colIdx}`);
          const isFlippable = phase === 'flipping' && cell === opponent;

          return (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              state={cell}
              isValidMove={isValidMove}
              isFlippable={isFlippable}
              row={rowIdx}
              col={colIdx}
              onClick={() => onCellClick(rowIdx, colIdx)}
            />
          );
        }),
      )}
    </div>
  );
}

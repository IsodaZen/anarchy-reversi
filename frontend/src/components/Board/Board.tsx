import { useMemo } from 'react';
import type { Board as BoardType, GamePhase, PlayerColor, Position } from '../../types/game';
import { Cell } from '../Cell/Cell';

interface BoardProps {
  board: BoardType;
  validMoves: Position[];
  phase: GamePhase;
  currentTurn: PlayerColor;
  flippingCells: Position[];
  flippedCells: Position[];
  onCellClick: (row: number, col: number) => void;
  onFlipEnd: (row: number, col: number) => void;
}

export function Board({ board, validMoves, phase, currentTurn, flippingCells, flippedCells, onCellClick, onFlipEnd }: BoardProps) {
  const validMoveSet = useMemo(
    () => new Set(validMoves.map((m) => `${m.row},${m.col}`)),
    [validMoves],
  );
  const flippingSet = useMemo(
    () => new Set(flippingCells.map((c) => `${c.row},${c.col}`)),
    [flippingCells],
  );
  const flippedSet = useMemo(
    () => new Set(flippedCells.map((c) => `${c.row},${c.col}`)),
    [flippedCells],
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
          const isFlippable = phase === 'flipping' && (cell === opponent || flippedSet.has(`${rowIdx},${colIdx}`));
          const isFlipping = flippingSet.has(`${rowIdx},${colIdx}`);

          return (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              state={cell}
              isValidMove={isValidMove}
              isFlippable={isFlippable}
              isFlipping={isFlipping}
              currentTurn={currentTurn}
              row={rowIdx}
              col={colIdx}
              onClick={() => onCellClick(rowIdx, colIdx)}
              onFlipEnd={() => onFlipEnd(rowIdx, colIdx)}
            />
          );
        }),
      )}
    </div>
  );
}

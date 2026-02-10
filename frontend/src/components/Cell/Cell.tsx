import type { CellState } from '../../types/game';
import { Piece } from '../Piece/Piece';

interface CellProps {
  state: CellState;
  isValidMove: boolean;
  isFlippable: boolean;
  onClick: () => void;
}

export function Cell({ state, isValidMove, isFlippable, onClick }: CellProps) {
  const isClickable = isValidMove || isFlippable;

  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  return (
    <div
      data-testid="cell"
      className={`
        aspect-square min-w-[44px] min-h-[44px]
        flex items-center justify-center
        bg-green-600 border border-green-700
        ${isClickable ? 'cursor-pointer' : ''}
        ${isFlippable ? 'hover:bg-green-500' : ''}
      `}
      onClick={handleClick}
    >
      {state && <Piece color={state} />}
      {isValidMove && !state && (
        <div
          data-testid="valid-move-indicator"
          className="w-[30%] h-[30%] rounded-full bg-black/20"
        />
      )}
    </div>
  );
}

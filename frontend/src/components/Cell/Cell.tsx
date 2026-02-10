import type { CellState } from '../../types/game';
import { Piece } from '../Piece/Piece';

interface CellProps {
  state: CellState;
  isValidMove: boolean;
  isFlippable: boolean;
  row: number;
  col: number;
  onClick: () => void;
}

export function Cell({ state, isValidMove, isFlippable, row, col, onClick }: CellProps) {
  const isClickable = isValidMove || isFlippable;

  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
      e.preventDefault();
      onClick();
    }
  };

  const stateLabel = state === 'black' ? '黒石' : state === 'white' ? '白石' : '空';
  const actionLabel = isValidMove ? '（配置可能）' : isFlippable ? '（裏返し可能）' : '';

  return (
    <div
      data-testid="cell"
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      aria-label={`${row + 1}行${col + 1}列: ${stateLabel}${actionLabel}`}
      className={`
        aspect-square min-w-[44px] min-h-[44px]
        flex items-center justify-center
        bg-green-600 border border-green-700
        ${isClickable ? 'cursor-pointer' : ''}
        ${isFlippable ? 'hover:bg-green-500' : ''}
        ${isClickable ? 'focus:outline-2 focus:outline-yellow-400 focus:z-10' : ''}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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

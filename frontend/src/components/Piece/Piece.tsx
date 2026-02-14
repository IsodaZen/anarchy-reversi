import type { PlayerColor } from '../../types/game';

interface PieceProps {
  color: PlayerColor;
  isFlipping?: boolean;
  flipFromColor?: PlayerColor;
  onFlipEnd?: () => void;
}

const COLOR_CLASSES = {
  black: 'bg-gray-900 shadow-md',
  white: 'bg-white border-2 border-gray-300 shadow-md',
} as const;

export function Piece({ color, isFlipping, flipFromColor, onFlipEnd }: PieceProps) {
  if (isFlipping && flipFromColor) {
    return (
      <div
        data-testid="piece"
        className="w-[80%] h-[80%]"
        style={{ perspective: '400px' }}
      >
        <div
          data-testid="piece-inner"
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'flip-piece 500ms ease-in-out forwards',
          }}
          onAnimationEnd={onFlipEnd}
        >
          <div
            className={`absolute inset-0 rounded-full ${COLOR_CLASSES[flipFromColor]}`}
            style={{ backfaceVisibility: 'hidden' }}
          />
          <div
            className={`absolute inset-0 rounded-full ${COLOR_CLASSES[color]}`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="piece"
      className={`w-[80%] h-[80%] rounded-full ${COLOR_CLASSES[color]}`}
    />
  );
}

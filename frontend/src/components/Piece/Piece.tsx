import type { PlayerColor } from '../../types/game';

interface PieceProps {
  color: PlayerColor;
}

export function Piece({ color }: PieceProps) {
  return (
    <div
      data-testid="piece"
      className={`w-[80%] h-[80%] rounded-full ${
        color === 'black'
          ? 'bg-gray-900 shadow-md'
          : 'bg-white border-2 border-gray-300 shadow-md'
      }`}
    />
  );
}

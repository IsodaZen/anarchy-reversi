import type { PlayerColor, GameResult } from '../../types/game';

interface ScoreBoardProps {
  blackCount: number;
  whiteCount: number;
  currentTurn: PlayerColor;
  winner?: GameResult | null;
}

function getHighlightClass(
  color: PlayerColor,
  currentTurn: PlayerColor,
  winner?: GameResult | null,
): string {
  if (winner === color) {
    return 'ring-2 ring-amber-400 bg-amber-50';
  }
  if (winner != null) {
    return 'bg-gray-50';
  }
  if (currentTurn === color) {
    return 'ring-2 ring-yellow-400 bg-gray-100';
  }
  return 'bg-gray-50';
}

export function ScoreBoard({ blackCount, whiteCount, currentTurn, winner }: ScoreBoardProps) {
  return (
    <div className="flex justify-around items-center gap-4">
      <div
        data-testid="score-black"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getHighlightClass('black', currentTurn, winner)}`}
      >
        <div className="w-6 h-6 rounded-full bg-gray-900" />
        <span className="text-2xl font-bold">{blackCount}</span>
      </div>
      <div
        data-testid="score-white"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getHighlightClass('white', currentTurn, winner)}`}
      >
        <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
        <span className="text-2xl font-bold">{whiteCount}</span>
      </div>
    </div>
  );
}

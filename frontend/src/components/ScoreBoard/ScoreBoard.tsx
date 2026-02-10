import type { PlayerColor } from '../../types/game';

interface ScoreBoardProps {
  blackCount: number;
  whiteCount: number;
  currentTurn: PlayerColor;
}

export function ScoreBoard({ blackCount, whiteCount, currentTurn }: ScoreBoardProps) {
  return (
    <div className="flex justify-around items-center gap-4">
      <div
        data-testid="score-black"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          currentTurn === 'black' ? 'ring-2 ring-yellow-400 bg-gray-100' : 'bg-gray-50'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-gray-900" />
        <span className="text-2xl font-bold">{blackCount}</span>
      </div>
      <div
        data-testid="score-white"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          currentTurn === 'white' ? 'ring-2 ring-yellow-400 bg-gray-100' : 'bg-gray-50'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
        <span className="text-2xl font-bold">{whiteCount}</span>
      </div>
    </div>
  );
}

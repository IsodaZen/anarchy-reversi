import type { PlayerColor, GamePhase } from '../../types/game';

interface GameInfoProps {
  currentTurn: PlayerColor;
  phase: GamePhase;
  flipCount: number;
  onEndTurn: () => void;
  isGameOver: boolean;
  onShowResult?: () => void;
}

export function GameInfo({ currentTurn, phase, flipCount, onEndTurn, isGameOver, onShowResult }: GameInfoProps) {
  const turnLabel = currentTurn === 'black' ? '黒' : '白';
  const phaseLabel = phase === 'placement' ? '石をおこう！' : 'ひっくり返せるよ！';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {isGameOver ? (
          <span className="text-lg font-bold text-gray-900 dark:text-white">ゲームしゅうりょう！</span>
        ) : (
          <>
            <div
              className={`w-5 h-5 rounded-full ${
                currentTurn === 'black'
                  ? 'bg-gray-900'
                  : 'bg-white border-2 border-gray-300'
              }`}
            />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{turnLabel}の番</span>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">({phaseLabel})</span>
          </>
        )}
      </div>
      {isGameOver ? (
        onShowResult && (
          <button
            onClick={onShowResult}
            className="px-4 py-2 rounded-lg font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
          >
            結果を見る
          </button>
        )
      ) : (
        <button
          onClick={onEndTurn}
          disabled={phase === 'placement' || flipCount < 1}
          className="px-4 py-2 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          手番終了
        </button>
      )}
    </div>
  );
}

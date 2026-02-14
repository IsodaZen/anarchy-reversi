import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/room/local');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStartGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            🎮 アナーキーオセロ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            自由に石を操作できるリバーシゲーム
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              <strong>配置フェーズ:</strong> 通常のリバーシルールで石を置きます
            </p>
            <p>
              <strong>裏返しフェーズ:</strong> 相手の石を自由に裏返せます
            </p>
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-label="ゲームを始める"
            onClick={handleStartGame}
            onKeyDown={handleKeyDown}
            className="w-full min-w-[44px] min-h-[44px] bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-center cursor-pointer focus:outline-2 focus:outline-yellow-400"
          >
            ゲームを始める
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>子供向け自由度の高いリバーシゲーム</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // ランダムなルームIDを生成
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-3">
            🎮 アナーキーオセロ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            自由に石を操作できるリバーシゲーム
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* ルーム作成 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              新しいルームを作成
            </h2>
            <button
              onClick={handleCreateRoom}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              ルームを作成
            </button>
          </div>

          {/* 区切り線 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                または
              </span>
            </div>
          </div>

          {/* ルーム参加 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              ルームに参加
            </h2>
            <form onSubmit={handleJoinRoom}>
              <div className="space-y-3">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="ルームIDを入力"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  maxLength={6}
                />
                <button
                  type="submit"
                  disabled={!roomId.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  参加する
                </button>
              </div>
            </form>
          </div>

          {/* 説明 */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>アナーキーモード:</strong> 通常のオセロとは違い、好きな場所をクリックして石を自由に操作できます！
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>子供向け自由度の高いリバーシゲーム</p>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setRoom } from '../store/gameSlice';

export default function GameRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isConnected, score } = useAppSelector((state) => state.game);

  useEffect(() => {
    if (!roomId) {
      // ルームIDがない場合はホームへ
      navigate('/');
      return;
    }

    // TODO: WebSocket接続を確立
    // 仮のプレイヤーIDを生成
    const playerId = Math.random().toString(36).substring(2, 15);
    dispatch(setRoom({ roomId, playerId }));

    return () => {
      // クリーンアップ: WebSocket切断処理
    };
  }, [roomId, navigate, dispatch]);

  const handleLeaveRoom = () => {
    // TODO: WebSocket切断
    navigate('/');
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      // TODO: コピー成功のトースト表示
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* ヘッダー */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                アナーキーオセロ
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  ルームID:
                </span>
                <code className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded font-mono text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  {roomId}
                </code>
                <button
                  onClick={copyRoomId}
                  className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                >
                  📋 コピー
                </button>
              </div>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              退出
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ゲームボードエリア */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <div className="aspect-square max-w-2xl mx-auto">
                {/* TODO: ゲームボードコンポーネントを配置 */}
                <div className="w-full h-full bg-green-600 rounded-lg flex items-center justify-center">
                  <p className="text-white text-2xl font-semibold">
                    ゲームボード（準備中）
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 接続状態 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                接続状態
              </h2>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {isConnected ? '接続中' : '未接続'}
                </span>
              </div>
            </div>

            {/* スコアボード */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                スコア
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black rounded-full border-2 border-white" />
                    <span className="text-white font-semibold">黒</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {score.black}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-900" />
                    <span className="text-gray-900 dark:text-white font-semibold">
                      白
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {score.white}
                  </span>
                </div>
              </div>
            </div>

            {/* コントロール */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                コントロール
              </h2>
              <div className="space-y-2">
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  リセット
                </button>
              </div>
            </div>

            {/* 説明 */}
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                💡 遊び方
              </h3>
              <ul className="text-xs text-indigo-800 dark:text-indigo-200 space-y-1">
                <li>• マスをクリックして石を自由に操作</li>
                <li>• 黒 → 白 → 空 の順に切り替わります</li>
                <li>• ルールに縛られず自由に遊べます！</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setRoom, placePiece, flipPiece, endTurn, resetGame } from '../store/gameSlice';
import { getValidMoves, isValidMove } from '../utils/gameLogic';
import { Board } from '../components/Board/Board';
import { ScoreBoard } from '../components/ScoreBoard/ScoreBoard';
import { GameInfo } from '../components/GameInfo/GameInfo';

export default function GameRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { board, score, currentTurn, phase, isConnected } = useAppSelector(
    (state) => state.game,
  );

  const validMoves = useMemo(() => getValidMoves(board, currentTurn), [board, currentTurn]);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    // TODO: WebSocket接続を確立
    const playerId = crypto.randomUUID();
    dispatch(setRoom({ roomId, playerId }));

    return () => {
      // クリーンアップ: WebSocket切断処理
    };
  }, [roomId, navigate, dispatch]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (phase === 'placement') {
        if (isValidMove(board, row, col, currentTurn)) {
          dispatch(placePiece({ row, col }));
        }
      } else if (phase === 'flipping') {
        const opponent = currentTurn === 'black' ? 'white' : 'black';
        if (board[row][col] === opponent) {
          dispatch(flipPiece({ row, col }));
        }
      }
    },
    [board, currentTurn, phase, dispatch],
  );

  const handleEndTurn = useCallback(() => {
    dispatch(endTurn());
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetGame());
  }, [dispatch]);

  const handleLeaveRoom = () => {
    navigate('/');
  };

  const copyRoomId = async () => {
    if (roomId) {
      try {
        await navigator.clipboard.writeText(roomId);
      } catch {
        // クリップボードAPIが使えない場合は無視
      }
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
                  コピー
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
              <Board
                board={board}
                validMoves={validMoves}
                phase={phase}
                currentTurn={currentTurn}
                onCellClick={handleCellClick}
              />
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
              <ScoreBoard
                blackCount={score.black}
                whiteCount={score.white}
                currentTurn={currentTurn}
              />
            </div>

            {/* ゲーム情報 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                ゲーム情報
              </h2>
              <GameInfo
                currentTurn={currentTurn}
                phase={phase}
                onEndTurn={handleEndTurn}
              />
            </div>

            {/* コントロール */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                コントロール
              </h2>
              <button
                onClick={handleReset}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                リセット
              </button>
            </div>

            {/* 説明 */}
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                遊び方
              </h3>
              <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-2">
                <li>1. まるいしるしが出ているところに石をおこう！</li>
                <li>2. あいての石をタップしてひっくり返せるよ！</li>
                <li>3.「手番終了」ボタンをおしたら交代だよ</li>
                <li>何回でもひっくり返してOK！</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

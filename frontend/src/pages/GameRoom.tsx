import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setRoom, placePiece, flipPiece, clearFlipping, endTurn, resetGame } from '../store/gameSlice';
import { getValidMoves, isValidMove } from '../utils/gameLogic';
import { Board } from '../components/Board/Board';
import { ScoreBoard } from '../components/ScoreBoard/ScoreBoard';
import { GameInfo } from '../components/GameInfo/GameInfo';

export default function GameRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { board, score, currentTurn, phase, flippingCells, flippedCells, flipCount } = useAppSelector(
    (state) => state.game,
  );
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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

  // Escapeキーでダイアログを閉じる
  useEffect(() => {
    if (!showHowToPlay) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHowToPlay(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showHowToPlay]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (phase === 'placement') {
        if (isValidMove(board, row, col, currentTurn)) {
          dispatch(placePiece({ row, col }));
        }
      } else if (phase === 'flipping') {
        const opponent = currentTurn === 'black' ? 'white' : 'black';
        const isFlipped = flippedCells.some(
          (c) => c.row === row && c.col === col,
        );
        if (board[row][col] === opponent || isFlipped) {
          dispatch(flipPiece({ row, col }));
        }
      }
    },
    [board, currentTurn, phase, flippedCells, dispatch],
  );

  const handleFlipEnd = useCallback(
    (row: number, col: number) => {
      dispatch(clearFlipping({ row, col }));
    },
    [dispatch],
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

  const turnLabel = currentTurn === 'black' ? '黒' : '白';
  const phaseLabel = phase === 'placement' ? '石をおこう！' : 'ひっくり返せるよ！';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-4">
        {/* ヘッダー */}
        <header className="mb-3">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm font-semibold"
              aria-label="遊び方を表示"
            >
              遊び方
            </button>
            <button
              onClick={handleReset}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-semibold"
            >
              リセット
            </button>
            <button
              onClick={handleLeaveRoom}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              退出
            </button>
          </div>
        </header>

        {/* モバイル: ターン情報 + スコア（ボード上部） */}
        <div className="mb-3 lg:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                className={`w-6 h-6 rounded-full ${
                  currentTurn === 'black'
                    ? 'bg-gray-900'
                    : 'bg-white border-2 border-gray-300'
                }`}
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {turnLabel}の番
              </span>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {phaseLabel}
              </span>
            </div>
            <ScoreBoard
              blackCount={score.black}
              whiteCount={score.white}
              currentTurn={currentTurn}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ゲームボードエリア */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6">
              <Board
                board={board}
                validMoves={validMoves}
                phase={phase}
                currentTurn={currentTurn}
                flippingCells={flippingCells}
                flippedCells={flippedCells}
                onCellClick={handleCellClick}
                onFlipEnd={handleFlipEnd}
              />
            </div>

            {/* モバイル: アクションボタン（ボード直下） */}
            <div className="mt-3 lg:hidden">
              <button
                onClick={handleEndTurn}
                disabled={phase === 'placement' || flipCount < 1}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
              >
                手番終了
              </button>
            </div>
          </div>

          {/* デスクトップ: サイドバー */}
          <div className="hidden lg:block space-y-6">
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
                flipCount={flipCount}
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
          </div>
        </div>

        {/* 遊び方ダイアログ */}
        {showHowToPlay && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHowToPlay(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="遊び方"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                遊び方
              </h2>
              <ul className="text-base text-gray-700 dark:text-gray-200 space-y-3">
                <li>1. まるいしるしが出ているところに石をおこう！</li>
                <li>2. あいての石をタップしてひっくり返せるよ！</li>
                <li>3.「手番終了」ボタンをおしたら交代だよ</li>
                <li>何回でもひっくり返してOK！</li>
              </ul>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                とじる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

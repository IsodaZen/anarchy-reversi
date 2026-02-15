import { useEffect, useRef } from 'react';
import type { GameResult } from '../../types/game';
import { ConfettiEffect } from '../ConfettiEffect/ConfettiEffect';

interface GameResultDialogProps {
  isOpen: boolean;
  winner: GameResult | null;
  score: { black: number; white: number };
  onPlayAgain: () => void;
  onClose: () => void;
}

function getResultMessage(winner: GameResult | null): string {
  if (winner === 'black') return 'くろのかち！';
  if (winner === 'white') return 'しろのかち！';
  return 'ひきわけ！';
}

function getAriaLabel(winner: GameResult | null): string {
  if (winner === 'black') return 'ゲーム結果: 黒の勝ち';
  if (winner === 'white') return 'ゲーム結果: 白の勝ち';
  return 'ゲーム結果: 引き分け';
}

export function GameResultDialog({
  isOpen,
  winner,
  score,
  onPlayAgain,
  onClose,
}: GameResultDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const showConfetti = winner !== null && winner !== 'draw';

  // フォーカス移動 & Escapeキー
  useEffect(() => {
    if (!isOpen) return;

    // フォーカスをダイアログ内に移動
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <ConfettiEffect active={showConfetti} />
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        data-testid="result-backdrop"
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={getAriaLabel(winner)}
          tabIndex={-1}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* スクリーンリーダー通知 */}
          <div aria-live="assertive" className="sr-only">
            {getAriaLabel(winner)}
          </div>

          {/* 結果メッセージ */}
          <div className="mb-4">
            {winner === 'black' && (
              <div className="w-16 h-16 rounded-full bg-gray-900 shadow-lg mx-auto mb-3" />
            )}
            {winner === 'white' && (
              <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-lg mx-auto mb-3" />
            )}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getResultMessage(winner)}
            </h2>
          </div>

          {/* スコア表示 */}
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-900" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{score.black}</span>
            </div>
            <span className="text-xl text-gray-500">-</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{score.white}</span>
            </div>
          </div>

          {/* もう一回あそぶボタン */}
          <button
            onClick={onPlayAgain}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-colors text-lg"
          >
            もう一回あそぶ
          </button>
        </div>
      </div>
    </>
  );
}

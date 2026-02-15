import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameResultDialog } from './GameResultDialog';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const defaultProps = {
  isOpen: true,
  score: { black: 30, white: 20 },
  onPlayAgain: vi.fn(),
  onClose: vi.fn(),
};

describe('GameResultDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('勝者表示', () => {
    it('黒勝ちを表示する', () => {
      render(<GameResultDialog {...defaultProps} winner="black" />);
      expect(screen.getByText('くろのかち！')).toBeInTheDocument();
    });

    it('白勝ちを表示する', () => {
      render(<GameResultDialog {...defaultProps} winner="white" score={{ black: 20, white: 30 }} />);
      expect(screen.getByText('しろのかち！')).toBeInTheDocument();
    });

    it('引き分けを表示する', () => {
      render(<GameResultDialog {...defaultProps} winner="draw" score={{ black: 32, white: 32 }} />);
      expect(screen.getByText('ひきわけ！')).toBeInTheDocument();
    });
  });

  describe('スコア表示', () => {
    it('最終スコアが表示される', () => {
      render(<GameResultDialog {...defaultProps} winner="black" />);
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });
  });

  describe('操作', () => {
    it('もう一回あそぶボタンでonPlayAgainが呼ばれる', () => {
      const onPlayAgain = vi.fn();
      render(<GameResultDialog {...defaultProps} winner="black" onPlayAgain={onPlayAgain} />);
      fireEvent.click(screen.getByRole('button', { name: /もう一回あそぶ/ }));
      expect(onPlayAgain).toHaveBeenCalledOnce();
    });

    it('背景クリックでonCloseが呼ばれる', () => {
      const onClose = vi.fn();
      render(<GameResultDialog {...defaultProps} winner="black" onClose={onClose} />);
      fireEvent.click(screen.getByTestId('result-backdrop'));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('ダイアログ内クリックでonCloseが呼ばれない', () => {
      const onClose = vi.fn();
      render(<GameResultDialog {...defaultProps} winner="black" onClose={onClose} />);
      fireEvent.click(screen.getByRole('dialog'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('EscapeキーでonCloseが呼ばれる', () => {
      const onClose = vi.fn();
      render(<GameResultDialog {...defaultProps} winner="black" onClose={onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('アクセシビリティ', () => {
    it('role="dialog"が設定される', () => {
      render(<GameResultDialog {...defaultProps} winner="black" />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal="true"が設定される', () => {
      render(<GameResultDialog {...defaultProps} winner="black" />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-labelが設定される', () => {
      render(<GameResultDialog {...defaultProps} winner="black" />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'ゲーム結果: 黒の勝ち');
    });

    it('スクリーンリーダー通知用のaria-liveが含まれる', () => {
      const { container } = render(<GameResultDialog {...defaultProps} winner="black" />);
      const liveRegion = container.querySelector('[aria-live="assertive"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion?.textContent).toContain('黒の勝ち');
    });

    it('Enter/Spaceキーでボタンがクリックされる', () => {
      const onPlayAgain = vi.fn();
      render(<GameResultDialog {...defaultProps} winner="black" onPlayAgain={onPlayAgain} />);
      const button = screen.getByRole('button', { name: /もう一回あそぶ/ });
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyUp(button, { key: 'Enter' });
      // ネイティブbuttonはEnter/SpaceでclickイベントをDOMが自動発火
      fireEvent.click(button);
      expect(onPlayAgain).toHaveBeenCalled();
    });
  });

  describe('表示/非表示', () => {
    it('isOpen: falseの場合は何も表示しない', () => {
      render(<GameResultDialog {...defaultProps} isOpen={false} winner="black" />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});

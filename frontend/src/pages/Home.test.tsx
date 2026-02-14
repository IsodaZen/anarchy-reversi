import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

import Home from './Home';

describe('Home', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('表示要素', () => {
    it('タイトル「アナーキーオセロ」がh1で表示される', () => {
      render(<Home />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('アナーキーオセロ');
    });

    it('キャッチコピーが表示される', () => {
      render(<Home />);
      expect(screen.getByText(/自由に石を操作できるリバーシゲーム/)).toBeInTheDocument();
    });

    it('アナーキーモード説明文が表示される', () => {
      render(<Home />);
      expect(screen.getByText(/配置フェーズ/)).toBeInTheDocument();
      expect(screen.getByText(/裏返しフェーズ/)).toBeInTheDocument();
    });

    it('フッターテキストが表示される', () => {
      render(<Home />);
      expect(screen.getByText(/子供向け自由度の高いリバーシゲーム/)).toBeInTheDocument();
    });

    it('ルーム作成・参加関連のUI要素が表示されない', () => {
      render(<Home />);
      expect(screen.queryByText('新しいルームを作成')).not.toBeInTheDocument();
      expect(screen.queryByText('ルームを作成')).not.toBeInTheDocument();
      expect(screen.queryByText('ルームに参加')).not.toBeInTheDocument();
      expect(screen.queryByText('参加する')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('ルームIDを入力')).not.toBeInTheDocument();
    });
  });

  describe('ゲーム開始ナビゲーション', () => {
    it('「ゲームを始める」ボタンクリックで /room/local へ遷移する', () => {
      render(<Home />);
      fireEvent.click(screen.getByRole('button', { name: /ゲームを始める/ }));
      expect(mockNavigate).toHaveBeenCalledWith('/room/local');
    });

    it('Enterキー押下でゲームが開始される', () => {
      render(<Home />);
      const button = screen.getByRole('button', { name: /ゲームを始める/ });
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockNavigate).toHaveBeenCalledWith('/room/local');
    });

    it('Spaceキー押下でゲームが開始される', () => {
      render(<Home />);
      const button = screen.getByRole('button', { name: /ゲームを始める/ });
      fireEvent.keyDown(button, { key: ' ' });
      expect(mockNavigate).toHaveBeenCalledWith('/room/local');
    });
  });

  describe('アクセシビリティ', () => {
    it('ボタンにrole="button"が設定されている', () => {
      render(<Home />);
      expect(screen.getByRole('button', { name: /ゲームを始める/ })).toBeInTheDocument();
    });

    it('ボタンにtabIndex={0}が設定されている', () => {
      render(<Home />);
      const button = screen.getByRole('button', { name: /ゲームを始める/ });
      expect(button).toHaveAttribute('tabindex', '0');
    });

    it('ボタンにaria-labelが設定されている', () => {
      render(<Home />);
      const button = screen.getByRole('button', { name: /ゲームを始める/ });
      expect(button).toHaveAttribute('aria-label');
    });
  });
});

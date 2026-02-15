import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameInfo } from './GameInfo';

describe('GameInfo', () => {
  it('黒番の手番を表示する', () => {
    render(<GameInfo currentTurn="black" phase="placement" flipCount={0} onEndTurn={vi.fn()} isGameOver={false} />);
    expect(screen.getByText(/黒/)).toBeInTheDocument();
  });

  it('白番の手番を表示する', () => {
    render(<GameInfo currentTurn="white" phase="placement" flipCount={0} onEndTurn={vi.fn()} isGameOver={false} />);
    expect(screen.getByText(/白/)).toBeInTheDocument();
  });

  it('配置フェーズを表示する', () => {
    render(<GameInfo currentTurn="black" phase="placement" flipCount={0} onEndTurn={vi.fn()} isGameOver={false} />);
    expect(screen.getByText(/石をおこう/)).toBeInTheDocument();
  });

  it('裏返しフェーズを表示する', () => {
    render(<GameInfo currentTurn="black" phase="flipping" flipCount={0} onEndTurn={vi.fn()} isGameOver={false} />);
    expect(screen.getByText(/ひっくり返せるよ/)).toBeInTheDocument();
  });

  it('裏返しフェーズで1個以上裏返し済みなら手番終了ボタンが有効', () => {
    render(<GameInfo currentTurn="black" phase="flipping" flipCount={1} onEndTurn={vi.fn()} isGameOver={false} />);
    const button = screen.getByRole('button', { name: /手番終了/ });
    expect(button).not.toBeDisabled();
  });

  it('裏返しフェーズで裏返し0個なら手番終了ボタンが無効', () => {
    render(<GameInfo currentTurn="black" phase="flipping" flipCount={0} onEndTurn={vi.fn()} isGameOver={false} />);
    const button = screen.getByRole('button', { name: /手番終了/ });
    expect(button).toBeDisabled();
  });

  it('配置フェーズで手番終了ボタンが無効', () => {
    render(<GameInfo currentTurn="black" phase="placement" flipCount={0} onEndTurn={vi.fn()} isGameOver={false} />);
    const button = screen.getByRole('button', { name: /手番終了/ });
    expect(button).toBeDisabled();
  });

  it('手番終了ボタンクリックでonEndTurnが呼ばれる', () => {
    const onEndTurn = vi.fn();
    render(<GameInfo currentTurn="black" phase="flipping" flipCount={1} onEndTurn={onEndTurn} isGameOver={false} />);
    fireEvent.click(screen.getByRole('button', { name: /手番終了/ }));
    expect(onEndTurn).toHaveBeenCalledOnce();
  });

  describe('ゲーム終了時', () => {
    it('ゲーム終了メッセージが表示される', () => {
      render(<GameInfo currentTurn="black" phase="placement" flipCount={0} onEndTurn={vi.fn()} isGameOver={true} />);
      expect(screen.getByText(/ゲームしゅうりょう/)).toBeInTheDocument();
    });

    it('手番表示が非表示になる', () => {
      render(<GameInfo currentTurn="black" phase="placement" flipCount={0} onEndTurn={vi.fn()} isGameOver={true} />);
      expect(screen.queryByText(/黒の番/)).not.toBeInTheDocument();
    });

    it('手番終了ボタンが非表示になる', () => {
      render(<GameInfo currentTurn="black" phase="placement" flipCount={0} onEndTurn={vi.fn()} isGameOver={true} />);
      expect(screen.queryByRole('button', { name: /手番終了/ })).not.toBeInTheDocument();
    });

    it('onShowResultが渡された場合「結果を見る」ボタンが表示される', () => {
      const onShowResult = vi.fn();
      render(
        <GameInfo
          currentTurn="black"
          phase="placement"
          flipCount={0}
          onEndTurn={vi.fn()}
          isGameOver={true}
          onShowResult={onShowResult}
        />,
      );
      const button = screen.getByRole('button', { name: /結果を見る/ });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(onShowResult).toHaveBeenCalledOnce();
    });

    it('onShowResultが渡されない場合「結果を見る」ボタンが非表示', () => {
      render(<GameInfo currentTurn="black" phase="placement" flipCount={0} onEndTurn={vi.fn()} isGameOver={true} />);
      expect(screen.queryByRole('button', { name: /結果を見る/ })).not.toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameInfo } from './GameInfo';

describe('GameInfo', () => {
  it('黒番の手番を表示する', () => {
    render(<GameInfo currentTurn="black" phase="placement" onEndTurn={vi.fn()} />);
    expect(screen.getByText(/黒/)).toBeInTheDocument();
  });

  it('白番の手番を表示する', () => {
    render(<GameInfo currentTurn="white" phase="placement" onEndTurn={vi.fn()} />);
    expect(screen.getByText(/白/)).toBeInTheDocument();
  });

  it('配置フェーズを表示する', () => {
    render(<GameInfo currentTurn="black" phase="placement" onEndTurn={vi.fn()} />);
    expect(screen.getByText(/石をおこう/)).toBeInTheDocument();
  });

  it('裏返しフェーズを表示する', () => {
    render(<GameInfo currentTurn="black" phase="flipping" onEndTurn={vi.fn()} />);
    expect(screen.getByText(/ひっくり返せるよ/)).toBeInTheDocument();
  });

  it('裏返しフェーズで手番終了ボタンが有効', () => {
    render(<GameInfo currentTurn="black" phase="flipping" onEndTurn={vi.fn()} />);
    const button = screen.getByRole('button', { name: /手番終了/ });
    expect(button).not.toBeDisabled();
  });

  it('配置フェーズで手番終了ボタンが無効', () => {
    render(<GameInfo currentTurn="black" phase="placement" onEndTurn={vi.fn()} />);
    const button = screen.getByRole('button', { name: /手番終了/ });
    expect(button).toBeDisabled();
  });

  it('手番終了ボタンクリックでonEndTurnが呼ばれる', () => {
    const onEndTurn = vi.fn();
    render(<GameInfo currentTurn="black" phase="flipping" onEndTurn={onEndTurn} />);
    fireEvent.click(screen.getByRole('button', { name: /手番終了/ }));
    expect(onEndTurn).toHaveBeenCalledOnce();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Board } from './Board';
import { createInitialBoard } from '../../utils/gameLogic';

describe('Board', () => {
  it('64個のセルを描画する', () => {
    const board = createInitialBoard();
    render(
      <Board
        board={board}
        validMoves={[]}
        phase="placement"
        currentTurn="black"
        flippingCells={[]}
        onCellClick={vi.fn()}
        onFlipEnd={vi.fn()}
      />,
    );
    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(64);
  });

  it('8x8のグリッドレイアウトで構成される', () => {
    const board = createInitialBoard();
    render(
      <Board
        board={board}
        validMoves={[]}
        phase="placement"
        currentTurn="black"
        flippingCells={[]}
        onCellClick={vi.fn()}
        onFlipEnd={vi.fn()}
      />,
    );
    const boardElement = screen.getByTestId('board');
    expect(boardElement).toHaveClass('grid-cols-8');
  });

  it('初期盤面で石が4個表示される', () => {
    const board = createInitialBoard();
    render(
      <Board
        board={board}
        validMoves={[]}
        phase="placement"
        currentTurn="black"
        flippingCells={[]}
        onCellClick={vi.fn()}
        onFlipEnd={vi.fn()}
      />,
    );
    const pieces = screen.getAllByTestId('piece');
    expect(pieces).toHaveLength(4);
  });

  it('role="grid"とaria-labelを持つ', () => {
    const board = createInitialBoard();
    render(
      <Board
        board={board}
        validMoves={[]}
        phase="placement"
        currentTurn="black"
        flippingCells={[]}
        onCellClick={vi.fn()}
        onFlipEnd={vi.fn()}
      />,
    );
    const boardElement = screen.getByTestId('board');
    expect(boardElement).toHaveAttribute('role', 'grid');
    expect(boardElement).toHaveAttribute('aria-label', 'リバーシ盤面');
  });
});

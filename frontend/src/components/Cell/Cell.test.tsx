import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Cell } from './Cell';

describe('Cell', () => {
  it('黒石がある場合にPieceを表示する', () => {
    render(
      <Cell state="black" isValidMove={false} isFlippable={false} onClick={vi.fn()} />,
    );
    expect(screen.getByTestId('piece')).toBeInTheDocument();
  });

  it('白石がある場合にPieceを表示する', () => {
    render(
      <Cell state="white" isValidMove={false} isFlippable={false} onClick={vi.fn()} />,
    );
    expect(screen.getByTestId('piece')).toBeInTheDocument();
  });

  it('空のセルにはPieceを表示しない', () => {
    render(
      <Cell state={null} isValidMove={false} isFlippable={false} onClick={vi.fn()} />,
    );
    expect(screen.queryByTestId('piece')).not.toBeInTheDocument();
  });

  it('合法手の位置にインジケータを表示する', () => {
    render(
      <Cell state={null} isValidMove={true} isFlippable={false} onClick={vi.fn()} />,
    );
    expect(screen.getByTestId('valid-move-indicator')).toBeInTheDocument();
  });

  it('合法手の位置をクリックするとonClickが呼ばれる', () => {
    const onClick = vi.fn();
    render(
      <Cell state={null} isValidMove={true} isFlippable={false} onClick={onClick} />,
    );
    fireEvent.click(screen.getByTestId('cell'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('裏返し可能な石をクリックするとonClickが呼ばれる', () => {
    const onClick = vi.fn();
    render(
      <Cell state="white" isValidMove={false} isFlippable={true} onClick={onClick} />,
    );
    fireEvent.click(screen.getByTestId('cell'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('操作不可のセルをクリックしてもonClickは呼ばれない', () => {
    const onClick = vi.fn();
    render(
      <Cell state={null} isValidMove={false} isFlippable={false} onClick={onClick} />,
    );
    fireEvent.click(screen.getByTestId('cell'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('最低44x44pxのタッチターゲットを確保する', () => {
    render(
      <Cell state={null} isValidMove={false} isFlippable={false} onClick={vi.fn()} />,
    );
    const cell = screen.getByTestId('cell');
    expect(cell).toHaveClass('min-w-[44px]');
    expect(cell).toHaveClass('min-h-[44px]');
  });
});

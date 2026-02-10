import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Cell } from './Cell';

describe('Cell', () => {
  it('黒石がある場合にPieceを表示する', () => {
    render(
      <Cell state="black" isValidMove={false} isFlippable={false} row={0} col={0} onClick={vi.fn()} />,
    );
    expect(screen.getByTestId('piece')).toBeInTheDocument();
  });

  it('白石がある場合にPieceを表示する', () => {
    render(
      <Cell state="white" isValidMove={false} isFlippable={false} row={0} col={0} onClick={vi.fn()} />,
    );
    expect(screen.getByTestId('piece')).toBeInTheDocument();
  });

  it('空のセルにはPieceを表示しない', () => {
    render(
      <Cell state={null} isValidMove={false} isFlippable={false} row={0} col={0} onClick={vi.fn()} />,
    );
    expect(screen.queryByTestId('piece')).not.toBeInTheDocument();
  });

  it('合法手の位置にインジケータを表示する', () => {
    render(
      <Cell state={null} isValidMove={true} isFlippable={false} row={2} col={3} onClick={vi.fn()} />,
    );
    expect(screen.getByTestId('valid-move-indicator')).toBeInTheDocument();
  });

  it('合法手の位置をクリックするとonClickが呼ばれる', () => {
    const onClick = vi.fn();
    render(
      <Cell state={null} isValidMove={true} isFlippable={false} row={0} col={0} onClick={onClick} />,
    );
    fireEvent.click(screen.getByTestId('cell'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('裏返し可能な石をクリックするとonClickが呼ばれる', () => {
    const onClick = vi.fn();
    render(
      <Cell state="white" isValidMove={false} isFlippable={true} row={0} col={0} onClick={onClick} />,
    );
    fireEvent.click(screen.getByTestId('cell'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('操作不可のセルをクリックしてもonClickは呼ばれない', () => {
    const onClick = vi.fn();
    render(
      <Cell state={null} isValidMove={false} isFlippable={false} row={0} col={0} onClick={onClick} />,
    );
    fireEvent.click(screen.getByTestId('cell'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('最低44x44pxのタッチターゲットを確保する', () => {
    render(
      <Cell state={null} isValidMove={false} isFlippable={false} row={0} col={0} onClick={vi.fn()} />,
    );
    const cell = screen.getByTestId('cell');
    expect(cell).toHaveClass('min-w-[44px]');
    expect(cell).toHaveClass('min-h-[44px]');
  });

  // アクセシビリティテスト
  it('操作可能なセルにはrole="button"とtabIndex=0を設定する', () => {
    render(
      <Cell state={null} isValidMove={true} isFlippable={false} row={2} col={4} onClick={vi.fn()} />,
    );
    const cell = screen.getByTestId('cell');
    expect(cell).toHaveAttribute('role', 'button');
    expect(cell).toHaveAttribute('tabindex', '0');
  });

  it('操作不可のセルにはrole="button"を設定しない', () => {
    render(
      <Cell state={null} isValidMove={false} isFlippable={false} row={0} col={0} onClick={vi.fn()} />,
    );
    const cell = screen.getByTestId('cell');
    expect(cell).not.toHaveAttribute('role');
    expect(cell).toHaveAttribute('tabindex', '-1');
  });

  it('aria-labelに位置と状態を含む', () => {
    render(
      <Cell state="black" isValidMove={false} isFlippable={false} row={2} col={4} onClick={vi.fn()} />,
    );
    const cell = screen.getByTestId('cell');
    expect(cell).toHaveAttribute('aria-label', '3行5列: 黒石');
  });

  it('合法手のセルはaria-labelに「配置可能」を含む', () => {
    render(
      <Cell state={null} isValidMove={true} isFlippable={false} row={0} col={0} onClick={vi.fn()} />,
    );
    const cell = screen.getByTestId('cell');
    expect(cell.getAttribute('aria-label')).toContain('（配置可能）');
  });

  it('Enterキーで操作可能なセルをクリックできる', () => {
    const onClick = vi.fn();
    render(
      <Cell state={null} isValidMove={true} isFlippable={false} row={0} col={0} onClick={onClick} />,
    );
    fireEvent.keyDown(screen.getByTestId('cell'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('スペースキーで操作可能なセルをクリックできる', () => {
    const onClick = vi.fn();
    render(
      <Cell state={null} isValidMove={true} isFlippable={false} row={0} col={0} onClick={onClick} />,
    );
    fireEvent.keyDown(screen.getByTestId('cell'), { key: ' ' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('操作不可のセルではキーボード操作が無効', () => {
    const onClick = vi.fn();
    render(
      <Cell state={null} isValidMove={false} isFlippable={false} row={0} col={0} onClick={onClick} />,
    );
    fireEvent.keyDown(screen.getByTestId('cell'), { key: 'Enter' });
    fireEvent.keyDown(screen.getByTestId('cell'), { key: ' ' });
    expect(onClick).not.toHaveBeenCalled();
  });
});

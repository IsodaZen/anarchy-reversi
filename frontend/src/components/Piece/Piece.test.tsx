import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Piece } from './Piece';

describe('Piece', () => {
  it('黒石を描画する', () => {
    render(<Piece color="black" />);
    const piece = screen.getByTestId('piece');
    expect(piece).toBeInTheDocument();
    expect(piece).toHaveClass('bg-gray-900');
  });

  it('白石を描画する', () => {
    render(<Piece color="white" />);
    const piece = screen.getByTestId('piece');
    expect(piece).toBeInTheDocument();
    expect(piece).toHaveClass('bg-white');
  });

  it('円形で表示する', () => {
    render(<Piece color="black" />);
    const piece = screen.getByTestId('piece');
    expect(piece).toHaveClass('rounded-full');
  });

  it('フリップ時に2面構造でレンダリングする', () => {
    render(<Piece color="black" isFlipping flipFromColor="white" />);
    const piece = screen.getByTestId('piece');
    expect(piece).toBeInTheDocument();
    const inner = screen.getByTestId('piece-inner');
    expect(inner).toBeInTheDocument();
    // 2面（旧色・新色）が存在する
    const faces = inner.children;
    expect(faces).toHaveLength(2);
  });

  it('フリップアニメーション完了時にonFlipEndが呼ばれる', () => {
    const onFlipEnd = vi.fn();
    render(<Piece color="black" isFlipping flipFromColor="white" onFlipEnd={onFlipEnd} />);
    const inner = screen.getByTestId('piece-inner');
    fireEvent.animationEnd(inner);
    expect(onFlipEnd).toHaveBeenCalledOnce();
  });

  it('フリップなしの場合は通常の単一div構造', () => {
    render(<Piece color="black" />);
    expect(screen.queryByTestId('piece-inner')).not.toBeInTheDocument();
  });
});

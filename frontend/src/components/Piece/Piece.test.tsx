import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});

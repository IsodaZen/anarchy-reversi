import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  it('黒石の数を表示する', () => {
    render(<ScoreBoard blackCount={10} whiteCount={5} currentTurn="black" />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('白石の数を表示する', () => {
    render(<ScoreBoard blackCount={10} whiteCount={5} currentTurn="black" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('現在の手番がハイライトされる', () => {
    const { container } = render(
      <ScoreBoard blackCount={2} whiteCount={2} currentTurn="black" />,
    );
    const blackSection = container.querySelector('[data-testid="score-black"]');
    expect(blackSection).toHaveClass('ring-2');
  });

  it('黒と白のスコアが視覚的に区別される', () => {
    const { container } = render(
      <ScoreBoard blackCount={2} whiteCount={2} currentTurn="black" />,
    );
    expect(container.querySelector('[data-testid="score-black"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="score-white"]')).toBeInTheDocument();
  });
});

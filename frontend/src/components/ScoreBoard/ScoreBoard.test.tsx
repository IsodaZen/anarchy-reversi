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

  describe('勝者ハイライト', () => {
    it('黒勝ちで黒パネルにamberハイライトが適用される', () => {
      const { container } = render(
        <ScoreBoard blackCount={40} whiteCount={24} currentTurn="black" winner="black" />,
      );
      const blackSection = container.querySelector('[data-testid="score-black"]');
      expect(blackSection).toHaveClass('ring-amber-400');
      expect(blackSection).toHaveClass('bg-amber-50');
    });

    it('白勝ちで白パネルにamberハイライトが適用される', () => {
      const { container } = render(
        <ScoreBoard blackCount={20} whiteCount={44} currentTurn="black" winner="white" />,
      );
      const whiteSection = container.querySelector('[data-testid="score-white"]');
      expect(whiteSection).toHaveClass('ring-amber-400');
      expect(whiteSection).toHaveClass('bg-amber-50');
    });

    it('黒勝ちで白パネルにはハイライトなし', () => {
      const { container } = render(
        <ScoreBoard blackCount={40} whiteCount={24} currentTurn="black" winner="black" />,
      );
      const whiteSection = container.querySelector('[data-testid="score-white"]');
      expect(whiteSection).not.toHaveClass('ring-amber-400');
    });

    it('引き分けで両パネルにハイライトなし', () => {
      const { container } = render(
        <ScoreBoard blackCount={32} whiteCount={32} currentTurn="black" winner="draw" />,
      );
      const blackSection = container.querySelector('[data-testid="score-black"]');
      const whiteSection = container.querySelector('[data-testid="score-white"]');
      expect(blackSection).not.toHaveClass('ring-amber-400');
      expect(whiteSection).not.toHaveClass('ring-amber-400');
    });

    it('winner未指定時は既存のcurrentTurnハイライトが維持される', () => {
      const { container } = render(
        <ScoreBoard blackCount={2} whiteCount={2} currentTurn="white" />,
      );
      const whiteSection = container.querySelector('[data-testid="score-white"]');
      expect(whiteSection).toHaveClass('ring-yellow-400');
    });
  });
});

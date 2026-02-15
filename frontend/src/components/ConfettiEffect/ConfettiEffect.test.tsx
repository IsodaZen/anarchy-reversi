import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ConfettiEffect } from './ConfettiEffect';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

import confetti from 'canvas-confetti';

describe('ConfettiEffect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('active: trueでconfettiが呼ばれる', () => {
    render(<ConfettiEffect active={true} />);
    expect(confetti).toHaveBeenCalledTimes(2);
  });

  it('active: falseでconfettiが呼ばれない', () => {
    render(<ConfettiEffect active={false} />);
    expect(confetti).not.toHaveBeenCalled();
  });

  it('activeがfalse→trueに変わった時のみ発火する', () => {
    const { rerender } = render(<ConfettiEffect active={false} />);
    expect(confetti).not.toHaveBeenCalled();
    rerender(<ConfettiEffect active={true} />);
    expect(confetti).toHaveBeenCalledTimes(2);
  });

  it('activeがtrue→trueのままでは再発火しない', () => {
    const { rerender } = render(<ConfettiEffect active={true} />);
    expect(confetti).toHaveBeenCalledTimes(2);
    vi.clearAllMocks();
    rerender(<ConfettiEffect active={true} />);
    expect(confetti).not.toHaveBeenCalled();
  });

  it('disableForReducedMotionオプションが含まれる', () => {
    render(<ConfettiEffect active={true} />);
    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({ disableForReducedMotion: true }),
    );
  });
});

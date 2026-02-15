import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  active: boolean;
}

export function ConfettiEffect({ active }: ConfettiEffectProps) {
  const prevActiveRef = useRef(false);

  useEffect(() => {
    if (active && !prevActiveRef.current) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.1, y: 0.6 },
          angle: 60,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.9, y: 0.6 },
          angle: 120,
          disableForReducedMotion: true,
        });
      } catch {
        // canvas-confetti の Canvas 生成に失敗した場合は無視
      }
    }
    prevActiveRef.current = active;
  }, [active]);

  return null;
}

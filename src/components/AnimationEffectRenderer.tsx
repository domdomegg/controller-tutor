import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

export type AnimationEffect = {
  id: number;
  type: 'floatingScore' | 'bonus';
  score?: number;
  text?: string;
};

interface Props {
  effect: AnimationEffect;
  onComplete: () => void;
}

const AnimationEffectRenderer: React.FC<Props> = ({
  effect, onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [offset] = useState({ x: (Math.random() * 200) - 100, y: (Math.random() * 60) + 30 });

  // Trigger load in animations
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  // Disappear after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(), 200); // Wait for fade out
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // eslint-disable-next-line no-nested-ternary
  const colorClass = effect.score !== undefined ? (effect.score > 0 ? 'text-green-400' : 'text-red-400')
    : 'text-yellow-400';

  return (
    <div
      className={clsx(
        'absolute pointer-events-none z-40 font-bold text-2xl transition-all -translate-x-1/2',
        isVisible ? 'opacity-100 -translate-y-16' : 'opacity-0 -translate-y-8 scale-0',
        colorClass,
      )}
      style={{
        left: `${offset.x}px`,
        top: `${offset.y}px`,
      }}
    >
      {effect.score !== undefined ? `${effect.score > 0 ? '+' : ''}${effect.score}` : effect.text}
    </div>
  );
};

export default AnimationEffectRenderer;

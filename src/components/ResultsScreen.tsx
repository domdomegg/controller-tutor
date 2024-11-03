import React, { useEffect, useState } from 'react';
import { useGamepad } from '../contexts/GamepadContext';
import ControllerButton from './ControllerButton';

interface Props {
  score: number;
  onPlayAgain: () => void;
  onViewCredits: () => void;
}

const RANK_THRESHOLDS = [
  { min: 8000, rank: 'Pro-gamer' },
  { min: 6000, rank: 'Expert' },
  { min: 4000, rank: 'Skilled' },
  { min: 2000, rank: 'Intermediate' },
  { min: 0, rank: 'Novice' },
] as const;

const ResultsScreen: React.FC<Props> = ({ score, onPlayAgain, onViewCredits }) => {
  const { useButtonListener } = useGamepad();

  const [buttonsReady, setButtonsReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setButtonsReady(true), 2500);
  });

  // Handle gamepad input
  useButtonListener((button) => {
    if (!buttonsReady) {
      return;
    }

    if (button === 'A') {
      onPlayAgain();
    }
    if (button === 'Y') {
      onViewCredits();
    }
  }, [buttonsReady, onPlayAgain, onViewCredits]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold mb-8">Nice try, but you can do better</h2>

      <div className="text-4xl font-bold mb-8">Your score: {score}</div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg mb-8">
        {RANK_THRESHOLDS.map((threshold, index) => (
          <React.Fragment key={threshold.rank}>
            <div className="text-right">
              {index === 0 ? `${threshold.min}-10000`
                : `${threshold.min}-${RANK_THRESHOLDS[index - 1].min}`}
            </div>
            <div className={score >= threshold.min ? 'text-blue-400' : ''}>
              {threshold.rank}
            </div>
          </React.Fragment>
        ))}
      </div>

      {buttonsReady
        ? (
          <div className="space-y-4 flex flex-col items-center">
            <div className="flex items-center">
              <ControllerButton button="A" />
              <span className="ml-2 text-xl">Play again</span>
            </div>
            <div className="flex items-center">
              <ControllerButton button="Y" />
              <span className="ml-2 text-xl">View credits</span>
            </div>
          </div>
        )
        : <div className="text-2xl font-bold mb-8 animate-pulse">Preparing next round...</div>}
    </div>
  );
};

export default ResultsScreen;

import React, { useEffect, useState } from 'react';
import { useGamepad } from '../contexts/GamepadContext';
import ControllerButton from './ControllerButton';

interface Props {
  score: number;
  onPlayAgain: () => void;
  onViewCredits: () => void;
}

const RANK_THRESHOLDS = [
  { min: 30000, rank: 'Pro-gamer', message: 'Incredible! You\'re a true controller master!' },
  { min: 20000, rank: 'Expert', message: 'Outstanding performance! You\'ve mastered the controls!' },
  { min: 15000, rank: 'Skilled', message: 'Great job! Your controller skills are impressive!' },
  { min: 10000, rank: 'Intermediate', message: 'Well done! You\'re getting the hang of it!' },
  { min: 8000, rank: 'Novice', message: 'Good effort! Keep practicing to improve!' },
  { min: 4000, rank: 'Beginner', message: 'Nice try! Practice makes perfect!' },
  { min: 0, rank: 'NPC', message: 'You\'ll get there one day!' },
] as const;

const ResultsScreen: React.FC<Props> = ({ score, onPlayAgain, onViewCredits }) => {
  const { useButtonListener } = useGamepad();

  const [buttonsReady, setButtonsReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setButtonsReady(true), 2500);
  });

  // Find the appropriate rank and message based on score
  const currentRank = RANK_THRESHOLDS.find((threshold) => score >= threshold.min) || RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];

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
      <div className="text-4xl font-bold mb-8">Your score: {score}</div>
      <h2 className="text-2xl text-center">{currentRank.message}</h2>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg my-12">
        {RANK_THRESHOLDS.map((threshold, index) => (
          <React.Fragment key={threshold.rank}>
            <div className="text-right">
              {index === 0 ? `${threshold.min}+`
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

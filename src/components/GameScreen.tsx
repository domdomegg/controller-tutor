import React, { useState, useEffect } from 'react';
import { ButtonType, GameStatus } from '../types/game';
import ButtonsLayout from './ButtonsLayout';
import { useGamepad } from '../contexts/GamepadContext';

interface Props {
  onGameOver: (finalScore: number) => void;
}

const SEQUENCE_LENGTH = 6;
const PRESS_BUTTON_TYPES: ButtonType[] = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT'];
const STICK_AND_DIRECTION_BUTTON_TYPES: ButtonType[] = ['LS', 'RS', 'DUp', 'DDown', 'DLeft', 'DRight', 'LUp', 'LDown', 'LLeft', 'LRight', 'RUp', 'RDown', 'RLeft', 'RRight'];

const generateSequence = (length: number): ButtonType[] => {
  const sequence: ButtonType[] = [];
  for (let i = 0; i < length; i++) {
    const buttonTypes = Math.random() > 0.15 ? PRESS_BUTTON_TYPES : STICK_AND_DIRECTION_BUTTON_TYPES;
    sequence.push(buttonTypes[Math.floor(Math.random() * buttonTypes.length)]);
  }
  return sequence;
};

const GameScreen: React.FC<Props> = ({ onGameOver }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    currentScore: 0,
    currentSequence: generateSequence(SEQUENCE_LENGTH),
    completedButtons: [],
    totalRoundTime: 30_000,
    roundTimeRemaining: 30_000,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setGameStatus((prev) => {
        if (prev.roundTimeRemaining <= 0) {
          clearInterval(timer);
          onGameOver(prev.currentScore);
          return prev;
        }
        return { ...prev, roundTimeRemaining: prev.roundTimeRemaining - 100 };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onGameOver]);

  const { useButtonListener } = useGamepad();

  // Handle gamepad input
  useButtonListener((button) => {
    const {
      currentSequence, completedButtons, currentScore, totalRoundTime, roundTimeRemaining,
    } = gameStatus;
    const currentButton = currentSequence[completedButtons.length];

    if (button === currentButton) {
      if (currentSequence.length === completedButtons.length + 1) {
        // Sequence completed

        // Reduce the time for next round - more if the total time is high
        const nextRoundTime = Math.floor(totalRoundTime * (totalRoundTime > 10_000 ? 0.75 : 0.95));

        setGameStatus({
          currentScore: currentScore + 100 + Math.floor(roundTimeRemaining / 10),
          currentSequence: generateSequence(SEQUENCE_LENGTH),
          completedButtons: [],
          totalRoundTime: nextRoundTime,
          roundTimeRemaining: nextRoundTime,
        });
      } else {
        // Button correctly pressed
        setGameStatus({
          ...gameStatus,
          currentScore: currentScore + 100,
          completedButtons: [...completedButtons, button],
        });
      }
    } else {
      // Incorrect button press penalty
      setGameStatus({
        ...gameStatus,
        currentScore: Math.max(0, currentScore - 25),
      });
    }
  }, [gameStatus, setGameStatus]);

  const timePercentage = (gameStatus.roundTimeRemaining / gameStatus.totalRoundTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Timer bar */}
      <div className="w-full h-2 bg-gray-700 mb-8">
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      <div className="mb-8">
        <div className="text-2xl font-bold">Score: {gameStatus.currentScore}</div>
      </div>

      <ButtonsLayout
        sequence={gameStatus.currentSequence}
        completedButtons={gameStatus.completedButtons}
      />

      <div className="mt-8 text-xl">
        Press the highlighted button!
      </div>
    </div>
  );
};

export default GameScreen;

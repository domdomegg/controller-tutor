import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { ButtonType, GameStatus } from '../types/game';
import ButtonsLayout from './ButtonsLayout';
import { useGamepad } from '../contexts/GamepadContext';
import PlayArea from './PlayArea';
import ScreenEffects from './ScreenEffects';
import AnimationEffectRenderer, { AnimationEffect } from './AnimationEffectRenderer';
import ConfettiCelebration from './ConfettiCelebration';

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

  // Animation states
  const [showErrorFlash, setShowErrorFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationEffects, setAnimationEffects] = useState<AnimationEffect[]>([]);
  const [lastPressTime, setLastPressTime] = useState<number>(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const effectIdCounter = useRef(0);

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

  const { useButtonListener, rumble } = useGamepad();

  // Helper functions for animations
  const addAnimationEffect = useCallback((type: AnimationEffect['type'], opts?: { score?: number, text?: string }) => {
    const newEffect: AnimationEffect = {
      // eslint-disable-next-line no-plusplus
      id: effectIdCounter.current++,
      type,
      score: opts?.score,
      text: opts?.text,
    };
    setAnimationEffects((prev) => [...prev, newEffect]);
  }, []);

  const removeAnimationEffect = useCallback((id: number) => {
    setAnimationEffects((prev) => {
      return prev.filter((effect) => effect.id !== id);
    });
  }, [setAnimationEffects]);

  const triggerErrorEffects = useCallback(() => {
    setShowErrorFlash(true);
    setTimeout(() => setShowErrorFlash(false), 1000);
  }, []);

  // Handle gamepad input
  useButtonListener((button) => {
    const {
      currentSequence, completedButtons, currentScore, totalRoundTime, roundTimeRemaining,
    } = gameStatus;
    const currentButton = currentSequence[completedButtons.length];
    const now = Date.now();

    if (button === currentButton) {
      // Add particle explosion and floating score
      addAnimationEffect('floatingScore', { score: 100 });

      // Track timing for bonuses
      const timeSinceLastPress = now - lastPressTime;
      setLastPressTime(now);

      if (timeSinceLastPress < 500 && lastPressTime > 0) {
        setConsecutiveCorrect((prev) => prev + 1);
        if (consecutiveCorrect >= 2) {
          addAnimationEffect('bonus', { text: 'COMBO!' });
        }
      } else {
        setConsecutiveCorrect(1);
      }

      if (currentSequence.length === completedButtons.length + 1) {
        // Sequence completed!
        const timeBonus = Math.floor(roundTimeRemaining / 10);
        const totalPoints = 100 + timeBonus;

        // Check for perfect bonus (>75% time remaining)
        if (roundTimeRemaining > totalRoundTime * 0.75) {
          addAnimationEffect('bonus', { text: 'PERFECT!' });
        }

        // Show confetti
        setShowConfetti(true);

        // Reduce the time for next round
        const nextRoundTime = Math.floor(totalRoundTime * (totalRoundTime > 10_000 ? 0.75 : 0.95));

        setGameStatus({
          currentScore: currentScore + totalPoints,
          currentSequence: generateSequence(SEQUENCE_LENGTH),
          completedButtons: [],
          totalRoundTime: nextRoundTime,
          roundTimeRemaining: nextRoundTime,
        });

        // Clear all animation effects when starting new sequence
        setAnimationEffects([]);
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
      rumble();
      triggerErrorEffects();
      setConsecutiveCorrect(0);

      // Add floating score for penalty
      addAnimationEffect('floatingScore', { score: -25 });

      setGameStatus({
        ...gameStatus,
        currentScore: Math.max(0, currentScore - 25),
      });
    }
  }, [gameStatus, setGameStatus, lastPressTime, consecutiveCorrect, addAnimationEffect, triggerErrorEffects, rumble]);

  const timePercentage = (gameStatus.roundTimeRemaining / gameStatus.totalRoundTime) * 100;

  return (
    <PlayArea>
      {/* Timer bar */}
      <div className="w-full h-2 bg-gray-700 mb-8">
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      <div className="mb-8 w-full flex flex-row justify-center">
        <div className="absolute">
          {/* Animation Effects */}
          {animationEffects.map((effect) => (
            <AnimationEffectRenderer
              key={effect.id}
              effect={effect}
              onComplete={() => removeAnimationEffect(effect.id)}
            />
          ))}
        </div>
        <div className="text-2xl font-bold">Score: {gameStatus.currentScore}</div>
      </div>

      <ButtonsLayout
        sequence={gameStatus.currentSequence}
        completedButtons={gameStatus.completedButtons}
      />

      <div className="mt-8 text-xl">
        Press the highlighted button!
      </div>

      {/* Screen Effects */}
      <ScreenEffects
        showErrorFlash={showErrorFlash}
      />

      {/* Confetti Celebration */}
      {showConfetti && (
        <ConfettiCelebration
          onComplete={() => setShowConfetti(false)}
        />
      )}
    </PlayArea>
  );
};

export default GameScreen;

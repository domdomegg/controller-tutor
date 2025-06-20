import React from 'react';
import clsx from 'clsx';
import ControllerButton from './ControllerButton';
import { useGamepad } from '../contexts/GamepadContext';
import PlayArea from './PlayArea';
import { H1 } from './Text';

interface Props {
  onStartGame: () => void;
  onViewCredits: () => void;
}

const MainMenu: React.FC<Props> = ({ onStartGame, onViewCredits }) => {
  const { useButtonListener, isGamepadConnected } = useGamepad();

  useButtonListener((button) => {
    if (button === 'A') {
      onStartGame();
    }
    if (button === 'Y') {
      onViewCredits();
    }
  }, [onStartGame, onViewCredits]);

  return (
    <PlayArea>
      <H1>Controller tutor</H1>

      {!isGamepadConnected && (
        <div className="mb-12 bg-yellow-900 rounded-lg p-6 max-w-md">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-yellow-400">🎮 Controller Required!</h2>
            <div className="text-sm text-yellow-400 space-y-2">
              <p>Connect your Xbox, PlayStation, or other compatible controller via USB or Bluetooth.</p>
              <p>Then, press any button on your controller to activate it.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-yellow-600">
              <p className="text-xs text-yellow-300">
                No controller?{' '}
                <a
                  href="https://github.com/domdomegg/controller-tutor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-200 underline hover:text-white transition-colors"
                >
                  See the GitHub README for a brief demo video.
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={clsx('space-y-6 text-xl', { 'opacity-50': !isGamepadConnected })}>
        <div className="flex items-center">
          <ControllerButton button="A" />
          <span className="ml-4">Start</span>
        </div>
        <div className="flex items-center">
          <ControllerButton button="Y" />
          <span className="ml-4">Credits</span>
        </div>
      </div>
    </PlayArea>
  );
};

export default MainMenu;

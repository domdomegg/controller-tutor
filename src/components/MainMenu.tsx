import React from 'react';
import ControllerButton from './ControllerButton';
import { useGamepad } from '../contexts/GamepadContext';

interface Props {
  onStartGame: () => void;
  onViewCredits: () => void;
}

const MainMenu: React.FC<Props> = ({ onStartGame, onViewCredits }) => {
  const { useButtonListener } = useGamepad();

  useButtonListener((button) => {
    if (button === 'A') {
      onStartGame();
    }
    if (button === 'Y') {
      onViewCredits();
    }
  }, [onStartGame, onViewCredits]);

  return (
    <div className="flex flex-col items-start justify-center min-h-screen bg-gray-900 text-white p-16">
      <h1 className="text-4xl font-bold mb-12">Controller tutor</h1>

      <div className="space-y-6 text-xl">
        <div className="flex items-center">
          <ControllerButton button="A" />
          <span className="ml-4">Start</span>
        </div>
        <div className="flex items-center">
          <ControllerButton button="Y" />
          <span className="ml-4">Credits</span>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

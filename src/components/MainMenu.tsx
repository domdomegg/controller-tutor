import React from 'react';
import ControllerButton from './ControllerButton';
import { useGamepad } from '../contexts/GamepadContext';
import PlayArea from './PlayArea';
import { H1 } from './Text';

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
    <PlayArea>
      <H1>Controller tutor</H1>

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
    </PlayArea>
  );
};

export default MainMenu;

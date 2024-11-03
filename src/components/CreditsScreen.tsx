import React from 'react';
import { useGamepad } from '../contexts/GamepadContext';
import ControllerButton from './ControllerButton';

interface Props {
  onBackToMenu: () => void;
}

const CreditsScreen: React.FC<Props> = ({ onBackToMenu }) => {
  const { useButtonListener } = useGamepad();

  // Handle gamepad input
  useButtonListener((button) => {
    if (button === 'B') {
      onBackToMenu();
    }
  }, [onBackToMenu]);

  return (
    <div className="flex flex-col items-start justify-center min-h-screen bg-gray-900 text-white p-16">
      <h2 className="text-4xl font-bold mb-12">Credits</h2>

      <div className="space-y-6 text-lg max-w-2xl">
        <p>Game built by Adam Jones, with a lot of help from Anthropic's Claude in <a href="https://github.com/cline/cline" className="text-blue-400 hover:text-blue-300 underline">Cline</a></p>

        <p>Inspired by <a href="https://malenaschmidt.com/" className="text-blue-400 hover:text-blue-300 underline">Malena Schmidt</a>'s inability to remember where buttons are</p>

        <p>Controller icons by <a href="https://kenney.nl" className="text-blue-400 hover:text-blue-300 underline">Kenney</a></p>

        <p>Source code on <a href="https://github.com/domdomegg/controller-tutor/" className="text-blue-400 hover:text-blue-300 underline">GitHub</a></p>
      </div>

      <div className="mt-12 flex items-center">
        <ControllerButton button="B" />
        <span className="ml-2 text-xl">Return to Menu</span>
      </div>
    </div>
  );
};

export default CreditsScreen;

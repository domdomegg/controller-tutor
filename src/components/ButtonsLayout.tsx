import React from 'react';
import { ButtonType } from '../types/game';
import ControllerButton from './ControllerButton';

interface Props {
  sequence: ButtonType[];
  completedButtons: ButtonType[];
}

const ButtonsLayout: React.FC<Props> = ({ sequence, completedButtons }) => {
  return (
    <div className="relative w-[900px] h-[400px] bg-gray-900 rounded-lg border-2 border-gray-700">
      <div className="flex justify-center items-center h-full gap-4">
        {sequence.map((button, index) => (
          <ControllerButton
            // eslint-disable-next-line react/no-array-index-key
            key={`${button}-${index}`}
            button={button}
            className={index === completedButtons.length ? 'scale-125' : ''}
            disabled={index < completedButtons.length}
          />
        ))}
      </div>
    </div>
  );
};

export default ButtonsLayout;

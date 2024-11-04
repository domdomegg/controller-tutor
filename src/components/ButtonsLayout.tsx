import React from 'react';
import clsx from 'clsx';
import { ButtonType } from '../types/game';
import ControllerButton from './ControllerButton';

interface Props {
  sequence: ButtonType[];
  completedButtons: ButtonType[];
}

const ButtonsLayout: React.FC<Props> = ({ sequence, completedButtons }) => {
  return (
    <div className="h-80 w-full bg-gray-900 rounded-lg border-2 border-gray-700">
      <div className="flex justify-center items-center h-full gap-8">
        {sequence.map((button, index) => (
          <ControllerButton
            // eslint-disable-next-line react/no-array-index-key
            key={`${button}-${index}`}
            button={button}
            className={clsx(index === completedButtons.length && 'scale-125', index > completedButtons.length && 'opacity-60')}
            disabled={index < completedButtons.length}
          />
        ))}
      </div>
    </div>
  );
};

export default ButtonsLayout;

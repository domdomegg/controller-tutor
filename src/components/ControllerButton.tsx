import React from 'react';
import clsx from 'clsx';
import { ButtonType } from '../types/game';

interface Props {
  button: ButtonType;
  className?: string;
  disabled?: boolean;
}

const ControllerButton: React.FC<Props> = ({
  button,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={clsx(
      'relative w-16 h-16 transition-all duration-300',
      disabled ? 'opacity-10' : 'opacity-100',
      className,
    )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`./xbox_${button}.svg`}
        alt={`${button} button`}
        className="object-contain h-full w-full"
      />
    </div>
  );
};

export default ControllerButton;

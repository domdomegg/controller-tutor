import React from 'react';
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
    <div className={`
      ${className}
      ${disabled ? 'opacity-20' : 'opacity-100'}
      transition-all duration-300
      relative w-16 h-16`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/xbox_${button}.svg`}
        alt={`${button} button`}
        className="object-contain h-full w-full"
      />
    </div>
  );
};

export default ControllerButton;

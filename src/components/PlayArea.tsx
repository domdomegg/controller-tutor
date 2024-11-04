import React from 'react';
import clsx from 'clsx';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

const PlayArea: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-16', className)}>
      {children}
    </div>
  );
};

export default PlayArea;

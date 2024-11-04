import React from 'react';
import clsx from 'clsx';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export const H1: React.FC<Props> = ({ className, children }) => {
  return (
    <h1 className={clsx('text-4xl font-bold mb-12', className)}>
      {children}
    </h1>
  );
};

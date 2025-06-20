import React from 'react';

interface Props {
  showErrorFlash: boolean;
}

const ScreenEffects: React.FC<Props> = ({ showErrorFlash }) => {
  return (
    <>
      {/* Red vignette flash overlay */}
      {showErrorFlash && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div
            className="absolute inset-0 bg-red-500/30 animate-ping"
            style={{ animationDuration: '2000ms', animationIterationCount: '1' }}
          />
          <div
            className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-red-600/50 animate-pulse"
            style={{ animationDuration: '2000ms', animationIterationCount: '1' }}
          />
        </div>
      )}
    </>
  );
};

export default ScreenEffects;

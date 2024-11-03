import { useState } from 'react';
import MainMenu from '../components/MainMenu';
import GameScreen from '../components/GameScreen';
import ResultsScreen from '../components/ResultsScreen';
import CreditsScreen from '../components/CreditsScreen';
import { GameView } from '../types/game';

const Home = () => {
  const [gameView, setGameView] = useState<GameView>('menu');
  const [score, setScore] = useState(0);

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameView('results');
  };

  return (
    <main className="min-h-screen bg-gray-900">
      {gameView === 'menu' && (
        <MainMenu
          onStartGame={() => setGameView('game')}
          onViewCredits={() => setGameView('credits')}
        />
      )}
      {gameView === 'game' && (
        <GameScreen
          onGameOver={handleGameOver}
        />
      )}
      {gameView === 'results' && (
        <ResultsScreen
          score={score}
          onPlayAgain={() => setGameView('game')}
          onViewCredits={() => setGameView('credits')}
        />
      )}
      {gameView === 'credits' && (
        <CreditsScreen
          onBackToMenu={() => setGameView('menu')}
        />
      )}
    </main>
  );
};

export default Home;

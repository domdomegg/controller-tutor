import type { AppProps } from 'next/app';
import { GamepadProvider } from '../contexts/GamepadContext';
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GamepadProvider>
      <Component {...pageProps} />
    </GamepadProvider>
  );
};

export default App;

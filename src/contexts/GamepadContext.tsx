import React, {
  createContext, useContext, useEffect, useState, useMemo,
  DependencyList
  ,
} from 'react';
import { ButtonType, GamepadState } from '../types/game';

type ButtonCallback = (button: ButtonType) => void;

interface GamepadContextType {
  isGamepadConnected: boolean;
  useButtonListener: (callback: ButtonCallback, deps: DependencyList) => void;
}

const GamepadContext = createContext<GamepadContextType>({
  isGamepadConnected: false,
  useButtonListener: () => {},
});

interface Props {
  children: React.ReactNode;
}

const mapGamepadToGamepadState = (gamepad: Gamepad, deadzone = 0.5): GamepadState => {
  const { axes, buttons } = gamepad;

  return {
    buttons: {
      A: buttons[0].pressed,
      B: buttons[1].pressed,
      X: buttons[2].pressed,
      Y: buttons[3].pressed,
      LB: buttons[4].pressed,
      RB: buttons[5].pressed,
      LT: buttons[6].pressed,
      RT: buttons[7].pressed,
      View: buttons[8].pressed,
      Menu: buttons[9].pressed,
      LS: buttons[10].pressed,
      RS: buttons[11].pressed,
      DUp: buttons[12].pressed,
      DDown: buttons[13].pressed,
      DLeft: buttons[14].pressed,
      DRight: buttons[15].pressed,
      Xbox: buttons[16].pressed,

      LUp: axes[1] < -deadzone,
      LDown: axes[1] > deadzone,
      LLeft: axes[0] < -deadzone,
      LRight: axes[0] > deadzone,
      RUp: axes[3] < -deadzone,
      RDown: axes[3] > deadzone,
      RLeft: axes[2] < -deadzone,
      RRight: axes[2] > deadzone,
    },
    axes: {
      L: {
        x: axes[0],
        y: axes[1],
      },
      R: {
        x: axes[2],
        y: axes[3],
      },
    },
  };
};

export const GamepadProvider: React.FC<Props> = ({ children }) => {
  const [gamepadIndex, setGamepadIndex] = useState<number | null>(null);
  const [buttonStates, setButtonStates] = useState<{
    current: Set<ButtonType>;
    previous: Set<ButtonType>;
  }>({
    current: new Set(),
    previous: new Set(),
  });
  const [buttonCallbacks] = useState<Set<ButtonCallback>>(new Set());

  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log('Gamepad connected:', e.gamepad);
      setGamepadIndex(e.gamepad.index);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log('Gamepad disconnected:', e.gamepad);
      if (e.gamepad.index === gamepadIndex) {
        setGamepadIndex(null);
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [gamepadIndex]);

  useEffect(() => {
    if (gamepadIndex === null) return undefined;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[gamepadIndex];
      if (!gamepad) return;

      const newCurrentButtons = new Set<ButtonType>();

      const gamepadState = mapGamepadToGamepadState(gamepad);

      Object.entries(gamepadState.buttons).forEach(([button, pressed]) => {
        if (pressed) newCurrentButtons.add(button as ButtonType);
      });

      setButtonStates((prev) => ({
        previous: prev.current,
        current: newCurrentButtons,
      }));
    };

    const intervalId = setInterval(pollGamepad, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, [gamepadIndex]);

  // Calculate newly pressed buttons (buttons that are pressed now but weren't before)
  const newlyPressedButtons = useMemo(() => {
    const newButtons = new Set<ButtonType>();
    buttonStates.current.forEach((button) => {
      if (!buttonStates.previous.has(button)) {
        newButtons.add(button);
      }
    });
    return newButtons;
  }, [buttonStates]);

  // Notify callbacks of newly pressed buttons
  useEffect(() => {
    newlyPressedButtons.forEach((button) => {
      buttonCallbacks.forEach((callback) => {
        callback(button);
      });
    });
  }, [newlyPressedButtons, buttonCallbacks]);

  const useButtonListener = (callback: ButtonCallback, deps: DependencyList) => {
    useEffect(() => {
      buttonCallbacks.add(callback);
      return () => {
        buttonCallbacks.delete(callback);
      };
    }, [buttonCallbacks, ...deps]);
  };

  const contextValue = useMemo(() => ({
    isGamepadConnected: gamepadIndex !== null,
    useButtonListener,
  }), [gamepadIndex, buttonCallbacks]);

  return (
    <GamepadContext.Provider value={contextValue}>
      {children}
    </GamepadContext.Provider>
  );
};

export const useGamepad = () => useContext(GamepadContext);

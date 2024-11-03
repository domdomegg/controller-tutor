export type GameView = 'menu' | 'game' | 'results' | 'credits';

export type GamepadState = {
  buttons: {
    A: boolean,
    B: boolean,
    X: boolean,
    Y: boolean,
    LB: boolean,
    RB: boolean,
    LT: boolean,
    RT: boolean,
    View: boolean,
    Menu: boolean,
    LS: boolean,
    RS: boolean,
    DUp: boolean,
    DDown: boolean,
    DLeft: boolean,
    DRight: boolean,
    Xbox: boolean,

    // Virtual buttons, based on joystick position
    LUp: boolean,
    LDown: boolean,
    LLeft: boolean,
    LRight: boolean,
    RUp: boolean,
    RDown: boolean,
    RLeft: boolean,
    RRight: boolean,
  },
  axes: {
    L: {
      x: number,
      y: number,
    },
    R: {
      x: number,
      y: number,
    },
  }
};

export type ButtonType = keyof GamepadState['buttons'];

export type GameStatus = {
  currentScore: number;
  currentSequence: ButtonType[];
  completedButtons: ButtonType[];
  totalRoundTime: number;
  roundTimeRemaining: number;
};

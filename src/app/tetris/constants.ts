// commons constants
export class KEY {
  static readonly ESC = 27;
  static readonly SPACE = 32;
  static readonly LEFT = 37;
  static readonly UP = 38;
  static readonly RIGHT = 39;
  static readonly DOWN = 40;
}

// Tetris constants
export const COLUMNS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export const LINES_PER_LEVEL = 10;
export const COLORS = [
  'none',
  'cyan',
  'blue',
  'orange',
  'yellow',
  'green',
  'purple',
  'red',
];
export const SHAPES = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];

/* export class KEY {
  static readonly ESC = 27;
  static readonly SPACE = 32;
  static readonly LEFT = 37;
  static readonly UP = 38;
  static readonly RIGHT = 39;
  static readonly DOWN = 40;
} */

export class POINTS {
  static readonly SINGLE = 100;
  static readonly DOUBLE = 300;
  static readonly TRIPLE = 500;
  static readonly TETRIS = 800;
  static readonly SOFT_DROP = 1;
  static readonly HARD_DROP = 2;
}

export class LEVEL2 {
  static readonly 0 = 800;
  static readonly 1 = 720;
  static readonly 2 = 630;
  static readonly 3 = 550;
  static readonly 4 = 470;
  static readonly 5 = 380;
  static readonly 6 = 300;
  static readonly 7 = 220;
  static readonly 8 = 130;
  static readonly 9 = 100;
  static readonly 10 = 80;
  static readonly 11 = 80;
  static readonly 12 = 80;
  static readonly 13 = 70;
  static readonly 14 = 70;
  static readonly 15 = 70;
  static readonly 16 = 50;
  static readonly 17 = 50;
  static readonly 18 = 50;
  static readonly 19 = 30;
  static readonly 20 = 30;
  // 29+ is 20ms
}

export const LEVEL: { [key: number]: number } = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 70,
  16: 50,
  17: 50,
  18: 50,
  19: 30,
  20: 30,
};

export class Games {
  static readonly TETRIS = 'tetris';
  static readonly SPACE_INVADERS = 'space';
  static readonly FLAPPY_TILAPIA = 'flappy';
  static readonly DINO = 'dino';
}

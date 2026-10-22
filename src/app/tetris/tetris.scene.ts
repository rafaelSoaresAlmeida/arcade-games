import Phaser from 'phaser';

const COLS = 10;
const ROWS = 20;
const CELL = 28;
const GAME_W = COLS * CELL;
const GAME_H = ROWS * CELL + 30;

const SHAPES: number[][][] = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
];

const COLORS = [0x05d9e8, 0xfee440, 0xd300c5, 0xff2a6d, 0x39ff14, 0xff8800, 0x00ff88];

interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: number;
}

export class TetrisScene extends Phaser.Scene {
  private grid: (number | null)[][] = [];
  private currentPiece: Piece | null = null;
  private blocks: Phaser.GameObjects.Rectangle[] = [];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver = false;
  private dropTimer = 0;
  private dropInterval = 0.8;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private leftKey!: Phaser.Input.Keyboard.Key;
  private rightKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private upKey!: Phaser.Input.Keyboard.Key;
  private leftPressed = false;
  private rightPressed = false;
  private downPressed = false;
  private moveTimer = 0;

  constructor() {
    super({ key: 'TetrisScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#000');
    this.score = 0;
    this.gameOver = false;
    this.dropTimer = 0;
    this.dropInterval = 0.8;
    this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    this.blocks = [];

    this.scoreText = this.add.text(8, GAME_H - 26, 'SCORE: 0', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#fee440',
    });

    this.leftKey = this.input.keyboard!.addKey('LEFT');
    this.rightKey = this.input.keyboard!.addKey('RIGHT');
    this.downKey = this.input.keyboard!.addKey('DOWN');
    this.upKey = this.input.keyboard!.addKey('UP');
    this.restartKey = this.input.keyboard!.addKey('R');

    this.spawnPiece();
  }

  private spawnPiece() {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx].map((r) => [...r]);
    this.currentPiece = {
      shape,
      x: Math.floor((COLS - shape[0].length) / 2),
      y: 0,
      color: COLORS[idx],
    };
    if (this.collides(this.currentPiece, 0, 0)) {
      this.endGame();
    }
  }

  private collides(piece: Piece, dx: number, dy: number, shape?: number[][]): boolean {
    const s = shape ?? piece.shape;
    for (let r = 0; r < s.length; r++) {
      for (let c = 0; c < s[r].length; c++) {
        if (!s[r][c]) continue;
        const nx = piece.x + c + dx;
        const ny = piece.y + r + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && this.grid[ny][nx] !== null) return true;
      }
    }
    return false;
  }

  private merge(piece: Piece) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] && piece.y + r >= 0) {
          this.grid[piece.y + r][piece.x + c] = piece.color;
        }
      }
    }
  }

  private clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (this.grid[r].every((c) => c !== null)) {
        this.grid.splice(r, 1);
        this.grid.unshift(Array(COLS).fill(null));
        cleared++;
        r++;
      }
    }
    if (cleared > 0) {
      this.score += [0, 100, 300, 500, 800][cleared];
      this.dropInterval = Math.max(0.15, 0.8 - this.score / 5000);
      this.scoreText.setText('SCORE: ' + this.score);
    }
  }

  private rotate(piece: Piece): number[][] {
    const s = piece.shape;
    const rows = s.length;
    const cols = s[0].length;
    const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        rotated[c][rows - 1 - r] = s[r][c];
      }
    }
    return rotated;
  }

  override update(_time: number, delta: number) {
    const dt = delta / 1000;

    if (this.gameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
        this.scene.restart();
      }
      return;
    }

    if (!this.currentPiece) return;

    this.moveTimer += dt;
    const canMove = this.moveTimer > 0.08;

    if (this.leftKey.isDown && !this.leftPressed && canMove) {
      if (!this.collides(this.currentPiece, -1, 0)) {
        this.currentPiece.x--;
        this.moveTimer = 0;
      }
    }
    if (this.rightKey.isDown && !this.rightPressed && canMove) {
      if (!this.collides(this.currentPiece, 1, 0)) {
        this.currentPiece.x++;
        this.moveTimer = 0;
      }
    }
    if (this.downKey.isDown) {
      this.dropTimer += dt * 8;
    }
    if (Phaser.Input.Keyboard.JustDown(this.upKey)) {
      const rotated = this.rotate(this.currentPiece);
      if (!this.collides(this.currentPiece, 0, 0, rotated)) {
        this.currentPiece.shape = rotated;
      }
    }

    this.leftPressed = this.leftKey.isDown;
    this.rightPressed = this.rightKey.isDown;

    this.dropTimer += dt;
    if (this.dropTimer >= this.dropInterval) {
      this.dropTimer = 0;
      if (!this.collides(this.currentPiece, 0, 1)) {
        this.currentPiece.y++;
      } else {
        this.merge(this.currentPiece);
        this.clearLines();
        this.spawnPiece();
      }
    }

    this.render();
  }

  private render() {
    this.blocks.forEach((b) => b.destroy());
    this.blocks = [];

    // Grid blocks
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const color = this.grid[r][c];
        if (color !== null) {
          this.blocks.push(this.drawCell(c, r, color));
        }
      }
    }

    // Current piece
    if (this.currentPiece) {
      for (let r = 0; r < this.currentPiece.shape.length; r++) {
        for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
          if (this.currentPiece.shape[r][c]) {
            this.blocks.push(this.drawCell(
              this.currentPiece.x + c,
              this.currentPiece.y + r,
              this.currentPiece.color
            ));
          }
        }
      }
    }
  }

  private drawCell(col: number, row: number, color: number): Phaser.GameObjects.Rectangle {
    const x = col * CELL + CELL / 2;
    const y = row * CELL + CELL / 2;
    const rect = this.add.rectangle(x, y, CELL - 2, CELL - 2, color);
    rect.setStrokeStyle(1, 0x000000);
    return rect;
  }

  private endGame() {
    this.gameOver = true;
    this.add.text(GAME_W / 2, GAME_H / 2 - 15, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '18px',
      color: '#ff2a6d',
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, GAME_H / 2 + 15, 'PRESS R', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#fee440',
    }).setOrigin(0.5);
  }

  getScore(): number {
    return this.score;
  }
}

export const tetrisGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'tetris-game',
  backgroundColor: '#000',
  scene: [TetrisScene],
};

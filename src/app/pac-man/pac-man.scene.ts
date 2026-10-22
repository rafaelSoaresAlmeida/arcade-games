import Phaser from 'phaser';

const TILE = 24;
const COLS = 19;
const ROWS = 21;
const GAME_W = TILE * COLS;
const GAME_H = TILE * ROWS;

// Maze: # = wall, . = dot, o = power pellet, ' ' = empty, G = ghost spawn, P = pacman spawn
const MAZE: string[] = [
  '###################',
  '#........#........#',
  '#o##.###.#.###.##o#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '####.### # ###.####',
  '   #.#       #.#   ',
  '####.# ##=## #.####',
  '    .  #   #  .    ',
  '####.# ##### #.####',
  '   #.#       #.#   ',
  '####.# ##### #.####',
  '#........#........#',
  '#.##.###.#.###.##.#',
  '#o.#.....P.....#.o#',
  '##.#.#.#####.#.#.##',
  '#....#...#...#....#',
  '#.######.#.######.#',
  '#.................#',
  '###################',
];

const GHOST_SPAWN = { col: 9, row: 9 };

type Dir = 'up' | 'down' | 'left' | 'right' | 'none';
const DIR_VEC: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  none: { x: 0, y: 0 },
};

interface Ghost {
  body: Phaser.GameObjects.Arc;
  color: number;
  dir: Dir;
  speed: number;
  scared: boolean;
  eaten: boolean;
  respawnTimer: number;
  scatterTimer: number;
}

export class PacManScene extends Phaser.Scene {
  private walls: Phaser.GameObjects.Rectangle[] = [];
  private dots: Phaser.GameObjects.Arc[] = [];
  private pellets: Phaser.GameObjects.Arc[] = [];
  private pacman!: Phaser.GameObjects.Arc;
  private pacmanMouthAngle = 0;
  private pacmanDir: Dir = 'none';
  private pacmanNextDir: Dir = 'none';
  private ghosts: Ghost[] = [];
  private score = 0;
  private lives = 3;
  private dotsRemaining = 0;
  private powerMode = false;
  private powerTimer = 0;
  private gameOver = false;
  private win = false;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private pacmanSpeed = 120;
  private ghostSpeed = 90;
  private scaredSpeed = 50;
  private pacmanMouthOpen = true;
  private mouthTimer = 0;

  constructor() {
    super({ key: 'PacManScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.win = false;
    this.powerMode = false;
    this.powerTimer = 0;
    this.walls = [];
    this.dots = [];
    this.pellets = [];
    this.ghosts = [];
    this.dotsRemaining = 0;

    this.buildMaze();

    const pacmanCol = MAZE[15].indexOf('P');
    this.pacman = this.add.circle(
      pacmanCol * TILE + TILE / 2,
      15 * TILE + TILE / 2,
      TILE / 2 - 2,
      0xfee440
    );

    this.spawnGhosts();

    this.scoreText = this.add.text(8, GAME_H + 4, 'SCORE: 0', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#fee440',
    });
    this.livesText = this.add.text(GAME_W - 90, GAME_H + 4, 'LIVES: 3', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ff2a6d',
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.restartKey = this.input.keyboard!.addKey('R');
    this.pacmanDir = 'left';
    this.pacmanNextDir = 'left';
  }

  private buildMaze() {
    for (let r = 0; r < MAZE.length; r++) {
      for (let c = 0; c < MAZE[r].length; c++) {
        const ch = MAZE[r][c];
        const x = c * TILE + TILE / 2;
        const y = r * TILE + TILE / 2;
        if (ch === '#') {
          const w = this.add.rectangle(x, y, TILE, TILE, 0x000080);
          w.setStrokeStyle(1, 0x0000ff);
          this.walls.push(w);
        } else if (ch === '.') {
          const d = this.add.circle(x, y, 3, 0xffe88a);
          this.dots.push(d);
          this.dotsRemaining++;
        } else if (ch === 'o') {
          const p = this.add.circle(x, y, 7, 0xffe88a);
          this.pellets.push(p);
          this.dotsRemaining++;
        }
      }
    }
  }

  private spawnGhosts() {
    const colors = [0xff0000, 0xff69b4, 0x00ffff, 0xffa500];
    const names = ['blinky', 'pinky', 'inky', 'clyde'];
    const offsets = [
      { x: -TILE, y: 0 },
      { x: 0, y: 0 },
      { x: TILE, y: 0 },
      { x: 0, y: -TILE },
    ];

    for (let i = 0; i < 4; i++) {
      const x = GHOST_SPAWN.col * TILE + TILE / 2 + offsets[i].x;
      const y = GHOST_SPAWN.row * TILE + TILE / 2 + offsets[i].y;
      const body = this.add.circle(x, y, TILE / 2 - 2, colors[i]);
      // Ghost eyes
      this.add.circle(x - 4, y - 2, 3, 0xffffff);
      this.add.circle(x + 4, y - 2, 3, 0xffffff);

      this.ghosts.push({
        body,
        color: colors[i],
        dir: 'up',
        speed: this.ghostSpeed,
        scared: false,
        eaten: false,
        respawnTimer: 0,
        scatterTimer: i * 2,
      });
    }
  }

  override update(_time: number, delta: number) {
    const dt = delta / 1000;

    if (this.gameOver || this.win) {
      if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
        this.scene.restart();
      }
      return;
    }

    // Input
    if (this.cursors.left?.isDown) this.pacmanNextDir = 'left';
    else if (this.cursors.right?.isDown) this.pacmanNextDir = 'right';
    else if (this.cursors.up?.isDown) this.pacmanNextDir = 'up';
    else if (this.cursors.down?.isDown) this.pacmanNextDir = 'down';

    // Pacman movement
    const pacCol = Math.floor(this.pacman.x / TILE);
    const pacRow = Math.floor(this.pacman.y / TILE);
    const centeredX = Math.abs(this.pacman.x - (pacCol * TILE + TILE / 2)) < 3;
    const centeredY = Math.abs(this.pacman.y - (pacRow * TILE + TILE / 2)) < 3;

    if (centeredX && centeredY) {
      // Try to change direction
      if (this.pacmanNextDir !== 'none') {
        const v = DIR_VEC[this.pacmanNextDir];
        if (!this.isWall(pacCol + v.x, pacRow + v.y)) {
          this.pacmanDir = this.pacmanNextDir;
          this.pacman.x = pacCol * TILE + TILE / 2;
          this.pacman.y = pacRow * TILE + TILE / 2;
        }
      }
      // Stop if wall ahead
      const v = DIR_VEC[this.pacmanDir];
      if (this.isWall(pacCol + v.x, pacRow + v.y)) {
        this.pacmanDir = 'none';
      }
    }

    if (this.pacmanDir !== 'none') {
      const v = DIR_VEC[this.pacmanDir];
      this.pacman.x += v.x * this.pacmanSpeed * dt;
      this.pacman.y += v.y * this.pacmanSpeed * dt;

      // Mouth animation
      this.mouthTimer += dt;
      if (this.mouthTimer > 0.1) {
        this.pacmanMouthOpen = !this.pacmanMouthOpen;
        this.mouthTimer = 0;
      }

      // Tunnel wrap
      if (this.pacman.x < -TILE / 2) this.pacman.x = GAME_W + TILE / 2;
      if (this.pacman.x > GAME_W + TILE / 2) this.pacman.x = -TILE / 2;
    }

    // Eat dots
    for (let i = this.dots.length - 1; i >= 0; i--) {
      const d = this.dots[i];
      if (Phaser.Math.Distance.Between(this.pacman.x, this.pacman.y, d.x, d.y) < TILE / 2) {
        d.destroy();
        this.dots.splice(i, 1);
        this.score += 10;
        this.dotsRemaining--;
        this.updateHUD();
      }
    }

    // Eat power pellets
    for (let i = this.pellets.length - 1; i >= 0; i--) {
      const p = this.pellets[i];
      if (Phaser.Math.Distance.Between(this.pacman.x, this.pacman.y, p.x, p.y) < TILE / 2) {
        p.destroy();
        this.pellets.splice(i, 1);
        this.score += 50;
        this.dotsRemaining--;
        this.powerMode = true;
        this.powerTimer = 7;
        for (const g of this.ghosts) {
          if (!g.eaten) {
            g.scared = true;
            g.body.setFillStyle(0x0000ff);
          }
        }
        this.updateHUD();
      }
    }

    // Power mode timer
    if (this.powerMode) {
      this.powerTimer -= dt;
      if (this.powerTimer <= 0) {
        this.powerMode = false;
        for (const g of this.ghosts) {
          if (!g.eaten) {
            g.scared = false;
            g.body.setFillStyle(g.color);
          }
        }
      }
    }

    // Ghost movement
    for (const g of this.ghosts) {
      if (g.eaten) {
        g.respawnTimer -= dt;
        const spawnX = GHOST_SPAWN.col * TILE + TILE / 2;
        const spawnY = GHOST_SPAWN.row * TILE + TILE / 2;
        // Move back to spawn
        const dx = spawnX - g.body.x;
        const dy = spawnY - g.body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4 || g.respawnTimer <= 0) {
          g.eaten = false;
          g.scared = false;
          g.body.setFillStyle(g.color);
          g.body.setPosition(spawnX, spawnY);
          g.body.setVisible(true);
        } else {
          const speed = 200;
          g.body.x += (dx / dist) * speed * dt;
          g.body.y += (dy / dist) * speed * dt;
        }
        continue;
      }

      const gCol = Math.floor(g.body.x / TILE);
      const gRow = Math.floor(g.body.y / TILE);
      const gCenteredX = Math.abs(g.body.x - (gCol * TILE + TILE / 2)) < 3;
      const gCenteredY = Math.abs(g.body.y - (gRow * TILE + TILE / 2)) < 3;

      if (gCenteredX && gCenteredY) {
        g.body.x = gCol * TILE + TILE / 2;
        g.body.y = gRow * TILE + TILE / 2;

        // Choose direction: avoid reversing, pick direction toward target
        const dirs: Dir[] = ['up', 'down', 'left', 'right'];
        const opposite: Record<Dir, Dir> = {
          up: 'down', down: 'up', left: 'right', right: 'left', none: 'none'
        };
        let bestDir: Dir = g.dir;
        let bestDist = Infinity;

        for (const d of dirs) {
          if (d === opposite[g.dir]) continue;
          const v = DIR_VEC[d];
          if (this.isWall(gCol + v.x, gRow + v.y)) continue;

          let targetX: number, targetY: number;
          if (g.scared) {
            // Run away
            targetX = GAME_W - this.pacman.x;
            targetY = GAME_H - this.pacman.y;
          } else {
            targetX = this.pacman.x;
            targetY = this.pacman.y;
          }
          const nx = g.body.x + v.x * TILE;
          const ny = g.body.y + v.y * TILE;
          const dist = Phaser.Math.Distance.Squared(nx, ny, targetX, targetY);
          if (dist < bestDist || (Math.random() < 0.1)) {
            bestDist = dist;
            bestDir = d;
          }
        }

        // If stuck, allow reversing
        if (bestDir === g.dir) {
          const v = DIR_VEC[g.dir];
          if (this.isWall(gCol + v.x, gRow + v.y)) {
            bestDir = opposite[g.dir];
          }
        }

        g.dir = bestDir;
      }

      const speed = g.scared ? this.scaredSpeed : this.ghostSpeed;
      const v = DIR_VEC[g.dir];
      g.body.x += v.x * speed * dt;
      g.body.y += v.y * speed * dt;

      // Tunnel wrap
      if (g.body.x < -TILE / 2) g.body.x = GAME_W + TILE / 2;
      if (g.body.x > GAME_W + TILE / 2) g.body.x = -TILE / 2;

      // Collision with pacman
      if (Phaser.Math.Distance.Between(this.pacman.x, this.pacman.y, g.body.x, g.body.y) < TILE * 0.7) {
        if (g.scared) {
          // Eat ghost
          g.eaten = true;
          g.respawnTimer = 5;
          g.body.setVisible(false);
          this.score += 200;
          this.updateHUD();
        } else {
          // Pacman dies
          this.lives--;
          this.updateHUD();
          if (this.lives <= 0) {
            this.endGame(false);
          } else {
            this.resetPositions();
          }
        }
      }
    }

    // Win
    if (this.dotsRemaining <= 0) {
      this.endGame(true);
    }
  }

  private isWall(col: number, row: number): boolean {
    if (row < 0 || row >= MAZE.length) return true;
    if (col < 0 || col >= MAZE[row].length) {
      // Tunnel rows (row 9 is the tunnel)
      if (row === 9) return false;
      return true;
    }
    const ch = MAZE[row][col];
    return ch === '#' || ch === '=';
  }

  private resetPositions() {
    const pacmanCol = MAZE[15].indexOf('P');
    this.pacman.setPosition(pacmanCol * TILE + TILE / 2, 15 * TILE + TILE / 2);
    this.pacmanDir = 'left';
    this.pacmanNextDir = 'left';

    const offsets = [
      { x: -TILE, y: 0 },
      { x: 0, y: 0 },
      { x: TILE, y: 0 },
      { x: 0, y: -TILE },
    ];
    for (let i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].body.setPosition(
        GHOST_SPAWN.col * TILE + TILE / 2 + offsets[i].x,
        GHOST_SPAWN.row * TILE + TILE / 2 + offsets[i].y
      );
      this.ghosts[i].dir = 'up';
      this.ghosts[i].scared = false;
      this.ghosts[i].eaten = false;
      this.ghosts[i].body.setFillStyle(this.ghosts[i].color);
      this.ghosts[i].body.setVisible(true);
    }
  }

  private updateHUD() {
    if (this.scoreText) this.scoreText.setText('SCORE: ' + this.score);
    if (this.livesText) this.livesText.setText('LIVES: ' + this.lives);
  }

  private endGame(victory: boolean) {
    this.gameOver = !victory;
    this.win = victory;
    const msg = victory ? 'YOU WIN!' : 'GAME OVER';
    const color = victory ? '#39ff14' : '#ff2a6d';
    this.add.text(GAME_W / 2, GAME_H / 2, msg, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '20px',
      color,
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, GAME_H / 2 + 36, 'PRESS R TO RESTART', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#fee440',
    }).setOrigin(0.5);
  }
}

export const pacManGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H + 28,
  parent: 'pac-man-game',
  backgroundColor: '#000',
  scene: [PacManScene],
};

import Phaser from 'phaser';

const TILE = 28;
const COLS = 16;
const ROWS = 16;
const GAME_W = TILE * COLS;
const GAME_H = TILE * ROWS;

type Dir = 'up' | 'down' | 'left' | 'right';
const DIR_VEC: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

interface TankState {
  sprite: Phaser.GameObjects.Rectangle;
  barrel: Phaser.GameObjects.Rectangle;
  dir: Dir;
  speed: number;
  isPlayer: boolean;
  shootCd: number;
  alive: boolean;
  color: number;
}

interface Bullet {
  rect: Phaser.GameObjects.Rectangle;
  vx: number;
  vy: number;
  fromPlayer: boolean;
  active: boolean;
}

export class BattleCityScene extends Phaser.Scene {
  private walls: Phaser.GameObjects.Rectangle[] = [];
  private steelWalls: Phaser.GameObjects.Rectangle[] = [];
  private tanks: TankState[] = [];
  private bullets: Bullet[] = [];
  private base!: Phaser.GameObjects.Rectangle;
  private baseAlive = true;
  private score = 0;
  private lives = 3;
  private enemiesRemaining = 0;
  private maxEnemies = 8;
  private spawnTimer = 0;
  private gameOver = false;
  private win = false;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private enemyText!: Phaser.GameObjects.Text;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private readonly enemySpeed = 70;
  private readonly playerSpeed = 110;

  constructor() {
    super({ key: 'BattleCityScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this.score = 0;
    this.lives = 3;
    this.enemiesRemaining = this.maxEnemies;
    this.gameOver = false;
    this.win = false;
    this.baseAlive = true;
    this.spawnTimer = 0;
    this.tanks = [];
    this.bullets = [];
    this.walls = [];
    this.steelWalls = [];

    this.buildMap();
    this.spawnPlayer();

    this.scoreText = this.add.text(8, GAME_H + 6, 'SCORE: 0', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#fee440',
    });
    this.livesText = this.add.text(GAME_W / 2 - 40, GAME_H + 6, 'LIVES: 3', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ff2a6d',
    });
    this.enemyText = this.add.text(GAME_W - 120, GAME_H + 6, 'ENEMY: 8', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#05d9e8',
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.fireKey = this.input.keyboard!.addKey('SPACE');
    this.restartKey = this.input.keyboard!.addKey('R');

    this.spawnEnemy();
  }

  private buildMap() {
    const brick = 0xff6600;
    const steel = 0xaaaaaa;

    for (let c = 0; c < COLS; c++) {
      this.addBrick(c * TILE, 0, brick);
      this.addBrick(c * TILE, (ROWS - 1) * TILE, brick);
    }
    for (let r = 1; r < ROWS - 1; r++) {
      this.addBrick(0, r * TILE, brick);
      this.addBrick((COLS - 1) * TILE, r * TILE, brick);
    }

    const layout: Array<[number, number, 'b' | 's']> = [
      [4, 3, 'b'], [5, 3, 'b'], [4, 4, 'b'], [5, 4, 'b'],
      [10, 3, 'b'], [11, 3, 'b'], [10, 4, 'b'], [11, 4, 'b'],
      [2, 6, 'b'], [3, 6, 'b'], [2, 7, 'b'], [3, 7, 'b'],
      [7, 5, 's'], [8, 5, 's'],
      [12, 6, 'b'], [13, 6, 'b'], [12, 7, 'b'], [13, 7, 'b'],
      [4, 9, 'b'], [5, 9, 'b'], [4, 10, 'b'], [5, 10, 'b'],
      [10, 9, 'b'], [11, 9, 'b'], [10, 10, 'b'], [11, 10, 'b'],
      [7, 8, 'b'], [8, 8, 'b'],
      [2, 11, 'b'], [3, 11, 's'],
      [12, 11, 's'], [13, 11, 'b'],
      [7, 12, 'b'], [8, 12, 'b'],
    ];

    for (const [c, r, type] of layout) {
      if (type === 's') {
        this.addSteel(c * TILE, r * TILE, steel);
      } else {
        this.addBrick(c * TILE, r * TILE, brick);
      }
    }

    const bx = (COLS / 2 - 1) * TILE;
    const by = (ROWS - 2) * TILE;
    this.base = this.add.rectangle(bx + TILE / 2, by + TILE / 2, TILE, TILE, 0x39ff14);
    this.add.text(bx + 4, by + 4, 'H', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      color: '#000',
    });

    this.addBrick(bx - TILE, by, brick);
    this.addBrick(bx - TILE, by - TILE, brick);
    this.addBrick(bx, by - TILE, brick);
    this.addBrick(bx + TILE, by - TILE, brick);
    this.addBrick(bx + 2 * TILE, by - TILE, brick);
    this.addBrick(bx + 2 * TILE, by, brick);
  }

  private addBrick(x: number, y: number, color: number) {
    const w = this.add.rectangle(x + TILE / 2, y + TILE / 2, TILE - 2, TILE - 2, color);
    w.setStrokeStyle(1, 0x883300);
    this.walls.push(w);
  }

  private addSteel(x: number, y: number, color: number) {
    const w = this.add.rectangle(x + TILE / 2, y + TILE / 2, TILE - 2, TILE - 2, color);
    w.setStrokeStyle(2, 0x666666);
    this.steelWalls.push(w);
  }

  private spawnPlayer() {
    const px = TILE * 2;
    const py = (ROWS - 2) * TILE;
    const tank = this.createTank(px, py, 0xfee440, true);
    tank.dir = 'up';
    this.tanks.push(tank);
  }

  private spawnEnemy() {
    if (this.enemiesRemaining <= 0) return;
    const spawnPoints = [
      { x: TILE * 2, y: TILE },
      { x: (COLS / 2 - 1) * TILE, y: TILE },
      { x: (COLS - 3) * TILE, y: TILE },
    ];
    const sp = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
    const colors = [0xff2a6d, 0xd300c5, 0x05d9e8, 0x39ff14];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const tank = this.createTank(sp.x, sp.y, color, false);
    tank.dir = 'down';
    this.tanks.push(tank);
    this.enemiesRemaining--;
    this.updateHUD();
  }

  private createTank(x: number, y: number, color: number, isPlayer: boolean): TankState {
    const sprite = this.add.rectangle(x + TILE / 2, y + TILE / 2, TILE - 4, TILE - 4, color);
    sprite.setStrokeStyle(2, 0x000000);
    const barrel = this.add.rectangle(x + TILE / 2, y + TILE / 2, 6, TILE - 6, 0x000000);
    return {
      sprite,
      barrel,
      dir: 'up',
      speed: isPlayer ? this.playerSpeed : this.enemySpeed,
      isPlayer,
      shootCd: 0,
      alive: true,
      color,
    };
  }

  private rotateBarrel(tank: TankState) {
    const cx = tank.sprite.x;
    const cy = tank.sprite.y;
    switch (tank.dir) {
      case 'up':
        tank.barrel.setSize(6, TILE - 6);
        tank.barrel.setPosition(cx, cy - 2);
        break;
      case 'down':
        tank.barrel.setSize(6, TILE - 6);
        tank.barrel.setPosition(cx, cy + 2);
        break;
      case 'left':
        tank.barrel.setSize(TILE - 6, 6);
        tank.barrel.setPosition(cx - 2, cy);
        break;
      case 'right':
        tank.barrel.setSize(TILE - 6, 6);
        tank.barrel.setPosition(cx + 2, cy);
        break;
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

    const player = this.tanks.find((t) => t.isPlayer && t.alive);
    if (player) {
      let moved = false;
      if (this.cursors.left?.isDown) {
        player.dir = 'left';
        moved = true;
      } else if (this.cursors.right?.isDown) {
        player.dir = 'right';
        moved = true;
      } else if (this.cursors.up?.isDown) {
        player.dir = 'up';
        moved = true;
      } else if (this.cursors.down?.isDown) {
        player.dir = 'down';
        moved = true;
      }

      if (moved) {
        const v = DIR_VEC[player.dir];
        const nx = player.sprite.x + v.x * player.speed * dt;
        const ny = player.sprite.y + v.y * player.speed * dt;
        if (!this.collidesWithWalls(nx, ny) && !this.collidesWithTank(nx, ny, player)) {
          player.sprite.x = nx;
          player.sprite.y = ny;
        }
        this.rotateBarrel(player);
      }

      player.shootCd -= dt;
      if (this.fireKey.isDown && player.shootCd <= 0) {
        this.shoot(player);
        player.shootCd = 0.4;
      }
    } else if (this.lives > 0 && !this.gameOver) {
      this.lives--;
      this.updateHUD();
      if (this.lives > 0) {
        this.spawnPlayer();
      } else {
        this.endGame(false);
      }
    }

    for (const t of this.tanks) {
      if (!t.alive || t.isPlayer) continue;
      t.shootCd -= dt;

      if (Math.random() < 0.01) {
        const dirs: Dir[] = ['up', 'down', 'left', 'right'];
        t.dir = dirs[Math.floor(Math.random() * dirs.length)];
      }

      const v = DIR_VEC[t.dir];
      const nx = t.sprite.x + v.x * t.speed * dt;
      const ny = t.sprite.y + v.y * t.speed * dt;
      if (!this.collidesWithWalls(nx, ny) && !this.collidesWithTank(nx, ny, t)) {
        t.sprite.x = nx;
        t.sprite.y = ny;
      } else {
        const dirs: Dir[] = ['up', 'down', 'left', 'right'];
        t.dir = dirs[Math.floor(Math.random() * dirs.length)];
      }
      this.rotateBarrel(t);

      const aimAtBase = Math.random() < 0.5;
      let targetX: number, targetY: number;
      if (aimAtBase && this.baseAlive) {
        targetX = this.base.x;
        targetY = this.base.y;
      } else if (player && player.alive) {
        targetX = player.sprite.x;
        targetY = player.sprite.y;
      } else {
        targetX = this.base.x;
        targetY = this.base.y;
      }

      const dx = targetX - t.sprite.x;
      const dy = targetY - t.sprite.y;
      if (Math.abs(dx) < TILE || Math.abs(dy) < TILE) {
        if (t.shootCd <= 0) {
          this.shoot(t);
          t.shootCd = 1.2 + Math.random();
        }
      }
    }

    for (const b of this.bullets) {
      if (!b.active) continue;
      b.rect.x += b.vx * dt;
      b.rect.y += b.vy * dt;

      if (b.rect.x < 0 || b.rect.x > GAME_W || b.rect.y < 0 || b.rect.y > GAME_H) {
        b.active = false;
        b.rect.setVisible(false);
        continue;
      }

      for (let i = this.walls.length - 1; i >= 0; i--) {
        const w = this.walls[i];
        if (this.rectOverlap(b.rect, w)) {
          this.walls.splice(i, 1);
          w.destroy();
          b.active = false;
          b.rect.setVisible(false);
          break;
        }
      }
      if (!b.active) continue;

      for (const w of this.steelWalls) {
        if (this.rectOverlap(b.rect, w)) {
          b.active = false;
          b.rect.setVisible(false);
          break;
        }
      }
      if (!b.active) continue;

      if (this.baseAlive && this.rectOverlap(b.rect, this.base)) {
        this.baseAlive = false;
        this.base.setFillStyle(0x333333);
        b.active = false;
        b.rect.setVisible(false);
        this.endGame(false);
        continue;
      }

      for (const t of this.tanks) {
        if (!t.alive) continue;
        if (b.fromPlayer && !t.isPlayer) {
          if (this.hitTank(b, t)) {
            this.score += 100;
            this.updateHUD();
            break;
          }
        } else if (!b.fromPlayer && t.isPlayer) {
          if (this.hitTank(b, t)) {
            break;
          }
        }
      }
    }

    if (this.tanks.filter((t) => !t.isPlayer && t.alive).length < 3 && this.enemiesRemaining > 0) {
      this.spawnTimer += dt;
      if (this.spawnTimer > 2) {
        this.spawnTimer = 0;
        this.spawnEnemy();
      }
    }

    if (this.enemiesRemaining === 0 && this.tanks.filter((t) => !t.isPlayer && t.alive).length === 0) {
      this.endGame(true);
    }
  }

  private rectOverlap(a: Phaser.GameObjects.Rectangle, b: Phaser.GameObjects.Rectangle): boolean {
    const ax = a.x - a.width / 2, ay = a.y - a.height / 2;
    const bx = b.x - b.width / 2, by = b.y - b.height / 2;
    return ax < bx + b.width && ax + a.width > bx && ay < by + b.height && ay + a.height > by;
  }

  private hitTank(b: Bullet, t: TankState): boolean {
    if (this.rectOverlap(b.rect, t.sprite)) {
      t.alive = false;
      t.sprite.destroy();
      t.barrel.destroy();
      b.active = false;
      b.rect.setVisible(false);
      return true;
    }
    return false;
  }

  private shoot(tank: TankState) {
    const existing = this.bullets.filter((b) => b.active && b.fromPlayer === tank.isPlayer);
    if (existing.length >= 1) return;

    const v = DIR_VEC[tank.dir];
    const b: Bullet = {
      rect: this.add.rectangle(
        tank.sprite.x + v.x * TILE / 2,
        tank.sprite.y + v.y * TILE / 2,
        6, 6, 0xffffff
      ),
      vx: v.x * 200,
      vy: v.y * 200,
      fromPlayer: tank.isPlayer,
      active: true,
    };
    this.bullets.push(b);
  }

  private collidesWithWalls(x: number, y: number): boolean {
    const half = (TILE - 4) / 2;
    for (const w of [...this.walls, ...this.steelWalls]) {
      const wx = w.x - w.width / 2, wy = w.y - w.height / 2;
      if (x - half < wx + w.width && x + half > wx && y - half < wy + w.height && y + half > wy) {
        return true;
      }
    }
    return false;
  }

  private collidesWithTank(x: number, y: number, tank: TankState): boolean {
    const half = (TILE - 4) / 2;
    for (const t of this.tanks) {
      if (t === tank || !t.alive) continue;
      if (x - half < t.sprite.x + half && x + half > t.sprite.x - half &&
          y - half < t.sprite.y + half && y + half > t.sprite.y - half) {
        return true;
      }
    }
    return false;
  }

  private updateHUD() {
    if (this.scoreText) this.scoreText.setText('SCORE: ' + this.score);
    if (this.livesText) this.livesText.setText('LIVES: ' + this.lives);
    if (this.enemyText) {
      const remaining = this.enemiesRemaining + this.tanks.filter((t) => !t.isPlayer && t.alive).length;
      this.enemyText.setText('ENEMY: ' + remaining);
    }
  }

  private endGame(victory: boolean) {
    this.gameOver = !victory;
    this.win = victory;
    const msg = victory ? 'YOU WIN!' : 'GAME OVER';
    const color = victory ? '#39ff14' : '#ff2a6d';
    this.add.text(GAME_W / 2, GAME_H / 2, msg, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '24px',
      color,
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, GAME_H / 2 + 40, 'PRESS R TO RESTART', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#fee440',
    }).setOrigin(0.5);
  }
}

export const battleCityGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H + 30,
  parent: 'battle-city-game',
  backgroundColor: '#000',
  scene: [BattleCityScene],
};

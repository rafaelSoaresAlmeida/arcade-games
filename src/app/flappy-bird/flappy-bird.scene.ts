import Phaser from 'phaser';

const GAME_W = 400;
const GAME_H = 500;
const BIRD_X = 100;
const GRAVITY = 1400;
const FLAP_VELOCITY = -420;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_INTERVAL = 1.6;
const PIPE_SPEED = 180;

interface PipePair {
  top: Phaser.GameObjects.Rectangle;
  bottom: Phaser.GameObjects.Rectangle;
  passed: boolean;
}

export class FlappyScene extends Phaser.Scene {
  private bird!: Phaser.GameObjects.Arc;
  private birdVy = 0;
  private pipes: PipePair[] = [];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver = false;
  private started = false;
  private spawnTimer = 0;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private flapKey!: Phaser.Input.Keyboard.Key;
  private wingTimer = 0;

  constructor() {
    super({ key: 'FlappyScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#70c5ce');
    this.score = 0;
    this.gameOver = false;
    this.started = false;
    this.birdVy = 0;
    this.spawnTimer = 0;
    this.pipes = [];

    this.bird = this.add.circle(BIRD_X, GAME_H / 2, 14, 0xfee440);
    this.bird.setStrokeStyle(2, 0x000000);
    // Eye
    this.add.circle(BIRD_X + 5, GAME_H / 2 - 4, 3, 0x000000);

    this.scoreText = this.add.text(GAME_W / 2 - 40, 30, '0', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '28px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4,
    });

    this.add.text(GAME_W / 2 - 100, GAME_H / 2 + 50, 'PRESS SPACE', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#fff',
    });

    this.flapKey = this.input.keyboard!.addKey('SPACE');
    this.restartKey = this.input.keyboard!.addKey('R');
  }

  override update(_time: number, delta: number) {
    const dt = delta / 1000;

    if (this.gameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
        this.scene.restart();
      }
      return;
    }

    if (!this.started) {
      if (Phaser.Input.Keyboard.JustDown(this.flapKey)) {
        this.started = true;
        this.birdVy = FLAP_VELOCITY;
      }
      return;
    }

    // Gravity
    this.birdVy += GRAVITY * dt;
    this.bird.y += this.birdVy * dt;

    // Wing animation
    this.wingTimer += dt;

    // Spawn pipes
    this.spawnTimer += dt;
    if (this.spawnTimer >= PIPE_INTERVAL) {
      this.spawnTimer = 0;
      this.spawnPipe();
    }

    // Move pipes
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.top.x -= PIPE_SPEED * dt;
      p.bottom.x -= PIPE_SPEED * dt;

      if (!p.passed && p.top.x < BIRD_X) {
        p.passed = true;
        this.score++;
        this.scoreText.setText(String(this.score));
      }

      // Collision
      if (this.circleRectOverlap(this.bird, p.top) || this.circleRectOverlap(this.bird, p.bottom)) {
        this.endGame();
      }

      if (p.top.x < -PIPE_WIDTH) {
        p.top.destroy();
        p.bottom.destroy();
        this.pipes.splice(i, 1);
      }
    }

    // Ground / ceiling collision
    if (this.bird.y > GAME_H - 14 || this.bird.y < 14) {
      this.endGame();
    }
  }

  private spawnPipe() {
    const gapY = 80 + Math.random() * (GAME_H - 200);
    const topHeight = gapY - PIPE_GAP / 2;
    const bottomY = gapY + PIPE_GAP / 2;
    const bottomHeight = GAME_H - bottomY;

    const top = this.add.rectangle(GAME_W + PIPE_WIDTH / 2, topHeight / 2, PIPE_WIDTH, topHeight, 0x39ff14);
    top.setStrokeStyle(2, 0x000000);
    const bottom = this.add.rectangle(GAME_W + PIPE_WIDTH / 2, bottomY + bottomHeight / 2, PIPE_WIDTH, bottomHeight, 0x39ff14);
    bottom.setStrokeStyle(2, 0x000000);

    this.pipes.push({ top, bottom, passed: false });
  }

  private circleRectOverlap(circle: Phaser.GameObjects.Arc, rect: Phaser.GameObjects.Rectangle): boolean {
    const cx = circle.x, cy = circle.y, r = circle.radius;
    const rx = rect.x - rect.width / 2, ry = rect.y - rect.height / 2;
    const closestX = Math.max(rx, Math.min(cx, rx + rect.width));
    const closestY = Math.max(ry, Math.min(cy, ry + rect.height));
    const dx = cx - closestX, dy = cy - closestY;
    return dx * dx + dy * dy < r * r;
  }

  private endGame() {
    this.gameOver = true;
    this.add.text(GAME_W / 2, GAME_H / 2 - 30, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '18px',
      color: '#ff2a6d',
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, GAME_H / 2 + 10, 'PRESS R', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#fff',
    }).setOrigin(0.5);
  }

  getScore(): number {
    return this.score;
  }
}

export const flappyGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'flappy-game',
  backgroundColor: '#70c5ce',
  scene: [FlappyScene],
};

import Phaser from 'phaser';

const GAME_W = 600;
const GAME_H = 300;
const GROUND_Y = 260;
const DINO_X = 60;

type Obstacle = {
  rect: Phaser.GameObjects.Rectangle;
  width: number;
  height: number;
  passed: boolean;
};

export class DinoScene extends Phaser.Scene {
  private dino!: Phaser.GameObjects.Rectangle;
  private dinoVy = 0;
  private onGround = true;
  private obstacles: Obstacle[] = [];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver = false;
  private spawnTimer = 0;
  private spawnInterval = 1.8;
  private gameSpeed = 250;
  private ground!: Phaser.GameObjects.Rectangle;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private isDucking = false;
  private crouchKey!: Phaser.Input.Keyboard.Key;
  private clouds: Phaser.GameObjects.Arc[] = [];
  private cloudTimer = 0;

  constructor() {
    super({ key: 'DinoScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#f7f7f7');
    this.score = 0;
    this.gameOver = false;
    this.spawnTimer = 0;
    this.spawnInterval = 1.8;
    this.gameSpeed = 250;
    this.obstacles = [];
    this.dinoVy = 0;
    this.onGround = true;
    this.isDucking = false;

    this.ground = this.add.rectangle(GAME_W / 2, GROUND_Y + 10, GAME_W, 4, 0x333333);

    this.dino = this.add.rectangle(DINO_X, GROUND_Y - 25, 30, 50, 0x222222);

    this.scoreText = this.add.text(GAME_W - 140, 12, 'SCORE: 0', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#222222',
    });

    this.jumpKey = this.input.keyboard!.addKey('SPACE');
    this.crouchKey = this.input.keyboard!.addKey('DOWN');
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

    // Jump
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && this.onGround) {
      this.dinoVy = -480;
      this.onGround = false;
    }

    // Crouch
    this.isDucking = this.crouchKey.isDown && this.onGround;
    if (this.isDucking) {
      this.dino.setSize(44, 28);
      this.dino.y = GROUND_Y - 14;
    } else {
      this.dino.setSize(30, 50);
      this.dino.y = GROUND_Y - 25;
    }

    // Gravity
    this.dinoVy += 1200 * dt;
    this.dino.y += this.dinoVy * dt;
    if (this.dino.y >= GROUND_Y - (this.isDucking ? 14 : 25)) {
      this.dino.y = GROUND_Y - (this.isDucking ? 14 : 25);
      this.dinoVy = 0;
      this.onGround = true;
    }

    // Spawn obstacles
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnInterval = 1.2 + Math.random() * 1.5;
      this.spawnObstacle();
    }

    // Move obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const o = this.obstacles[i];
      o.rect.x -= this.gameSpeed * dt;

      if (!o.passed && o.rect.x < DINO_X) {
        o.passed = true;
        this.score += 10;
        this.scoreText.setText('SCORE: ' + this.score);
        this.gameSpeed = Math.min(500, 250 + this.score);
        this.spawnInterval = Math.max(0.7, this.spawnInterval * 0.97);
      }

      // Collision
      const dw = this.dino.width, dh = this.dino.height;
      const dx = this.dino.x - dw / 2, dy = this.dino.y - dh / 2;
      const ox = o.rect.x - o.width / 2, oy = o.rect.y - o.height / 2;
      if (dx < ox + o.width && dx + dw > ox && dy < oy + o.height && dy + dh > oy) {
        this.endGame();
      }

      if (o.rect.x < -50) {
        o.rect.destroy();
        this.obstacles.splice(i, 1);
      }
    }

    // Clouds
    this.cloudTimer += dt;
    if (this.cloudTimer > 2) {
      this.cloudTimer = 0;
      const cy = 40 + Math.random() * 80;
      const cloud = this.add.circle(GAME_W + 20, cy, 12, 0xcccccc);
      this.clouds.push(cloud);
    }
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      this.clouds[i].x -= 60 * dt;
      if (this.clouds[i].x < -20) {
        this.clouds[i].destroy();
        this.clouds.splice(i, 1);
      }
    }
  }

  private spawnObstacle() {
    const isBird = Math.random() < 0.25;
    if (isBird) {
      const y = GROUND_Y - 60 - Math.random() * 40;
      const rect = this.add.rectangle(GAME_W + 30, y, 36, 24, 0x555555);
      this.obstacles.push({ rect, width: 36, height: 24, passed: false });
    } else {
      const h = 30 + Math.random() * 40;
      const w = 20 + Math.random() * 20;
      const rect = this.add.rectangle(GAME_W + 30, GROUND_Y - h / 2, w, h, 0x333333);
      this.obstacles.push({ rect, width: w, height: h, passed: false });
    }
  }

  private endGame() {
    this.gameOver = true;
    this.add.text(GAME_W / 2, GAME_H / 2 - 20, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '20px',
      color: '#ff2a6d',
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, GAME_H / 2 + 10, 'PRESS R TO RESTART', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#222',
    }).setOrigin(0.5);
  }

  getScore(): number {
    return this.score;
  }
}

export const dinoGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'dino-game',
  backgroundColor: '#f7f7f7',
  scene: [DinoScene],
};

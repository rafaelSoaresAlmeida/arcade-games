import { Alien } from '../actors/alien';
import { Bullet } from '../actors/bullet';
import { EnemyBullet } from '../actors/enemy-bullet';
import { Ship } from '../actors/ship';
import { AssetType, SoundType } from '../assets';
import { AnimationFactory, AnimationType } from '../factory/animation-factory';
import { GameState } from '../game-state';
import { Kaboom } from '../kaboom';
import { AlienManager } from '../manager/alien-manager';
import { AssetManager } from '../manager/asset-manager';
import { ScoreManager } from '../manager/score-manager';

export class MainScene extends Phaser.Scene {
  state!: GameState;
  assetManager!: AssetManager;
  animationFactory!: AnimationFactory;
  scoreManager!: ScoreManager;
  bulletTime = 0;
  firingTimer = 0;
  starfield!: Phaser.GameObjects.TileSprite;
  player!: Phaser.Physics.Arcade.Sprite;
  alienManager!: AlienManager;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  fireKey!: Phaser.Input.Keyboard.Key;
  intialEnemySpeed = 150;
  enemySpeed = this.intialEnemySpeed;
  enemySpeedMultiplication = 5;

  constructor() {
    super({
      key: 'MainScene',
    });
  }

  preload() {
    this.load.setBaseURL('  images/space-invaders/');
    this.load.image(AssetType.Starfield, 'starfield.png');
    this.load.image(AssetType.Bullet, 'bullet.png');
    this.load.image(AssetType.EnemyBullet, 'enemy-bullet.png');
    this.load.spritesheet(AssetType.Alien, 'invader.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image(AssetType.Ship, 'player.png');
    this.load.spritesheet(AssetType.Kaboom, 'explode.png', {
      frameWidth: 128,
      frameHeight: 128,
    });

    /*     this.sound.volume = 0.5;
    this.load.audio(SoundType.Shoot, '/audio/shoot.wav');
    this.load.audio(SoundType.Kaboom, '/audio/explosion.wav');
    this.load.audio(SoundType.InvaderKilled, '/audio/invaderkilled.wav'); */
  }

  create() {
    this.state = GameState.Playing;
    this.starfield = this.add
      .tileSprite(0, 0, 800, 600, AssetType.Starfield)
      .setOrigin(0, 0);
    this.assetManager = new AssetManager(this);
    this.animationFactory = new AnimationFactory(this);
    this.cursors = this.input!.keyboard!.createCursorKeys();

    if (this.input.keyboard) {
      this.fireKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
    }

    this.player = Ship.create(this);
    this.alienManager = new AlienManager(this);
    this.scoreManager = new ScoreManager(this);

    this.fireKey.on('down', () => {
      switch (this.state) {
        case GameState.NextLevel:
          this.enemySpeed = this.enemySpeed * this.enemySpeedMultiplication;
          this.restart(false);
          break;
        case GameState.Win:
        case GameState.GameOver:
          this.enemySpeed = this.intialEnemySpeed;
          this.restart(true);
          break;
      }
    });
  }

  override update() {
    this.starfield.tilePositionY -= 1;
    this._shipKeyboardHandler();
    if (this.time.now > this.firingTimer) {
      this._enemyFires();
    }

    this.physics.overlap(
      this.assetManager.bullets,
      this.alienManager.aliens,
      this._bulletHitAliens,
      undefined,
      this
    );

    this.physics.overlap(
      this.assetManager.enemyBullets,
      this.player,
      this._enemyBulletHitPlayer,
      undefined,
      this
    );
  }

  private _shipKeyboardHandler() {
    let playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setVelocity(0, 0);
    if (this.cursors.left.isDown) {
      playerBody.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      playerBody.setVelocityX(200);
    }

    if (this.fireKey.isDown) {
      this._fireBullet();
    }
  }

  private _bulletHitAliens(bullet: any, alien: any) {
    let explosion: Kaboom = this.assetManager.explosions.get();
    (bullet as Bullet).kill();
    (alien as Alien).kill(explosion);
    this.scoreManager.increaseScore();
    if (!this.alienManager.hasAliveAliens) {
      this.scoreManager.increaseScore(1000);
      this.scoreManager.setGameNextLevelText();

      this.state = GameState.NextLevel;
    }
  }

  private _enemyBulletHitPlayer(ship: any, enemyBullet: any) {
    let explosion: Kaboom = this.assetManager.explosions.get();
    (enemyBullet as EnemyBullet).kill();
    let live: Phaser.GameObjects.Sprite =
      this.scoreManager.lives.getFirstAlive();
    if (live) {
      live.setActive(false).setVisible(false);
    }

    explosion.setPosition(
      (this.player as Phaser.Physics.Arcade.Sprite).x,
      (this.player as Phaser.Physics.Arcade.Sprite).y
    );
    explosion.play(AnimationType.Kaboom);
    // this.sound.play(SoundType.Kaboom);
    if (this.scoreManager.noMoreLives) {
      this.scoreManager.setGameOverText();
      this.assetManager.gameOver();
      this.state = GameState.GameOver;
      this.player.disableBody(true, true);
    }
  }

  private _enemyFires() {
    if (!this.player.active) {
      return;
    }
    let enemyBullet: EnemyBullet = this.assetManager.enemyBullets.get();
    let randomEnemy = this.alienManager.getRandomAliveEnemy();
    if (enemyBullet && randomEnemy) {
      enemyBullet.setPosition(randomEnemy.x, randomEnemy.y);
      this.physics.moveToObject(enemyBullet, this.player, this.enemySpeed);
      this.firingTimer = this.time.now + 2000;
    }
  }

  private _fireBullet() {
    if (!this.player.active) {
      return;
    }

    if (this.time.now > this.bulletTime) {
      let bullet: Bullet = this.assetManager.bullets.get();
      if (bullet) {
        bullet.shoot(this.player.x, this.player.y - 18);
        this.bulletTime = this.time.now + 200;
      }
    }
  }

  restart(resetLives: boolean) {
    this.state = GameState.Playing;
    this.player.enableBody(true, this.player.x, this.player.y, true, true);

    if (resetLives) {
      this.scoreManager.resetLives();
    }

    this.scoreManager.hideText();
    this.alienManager.reset();
    this.assetManager.reset();
  }
}

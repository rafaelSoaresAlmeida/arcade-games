import * as Phaser from "phaser";
import { BulletAnimations } from "../animations/bullet-animations";
import { EnemiesHeavyAnimations } from "../animations/enemies-heavy-animations";
import { EnemiesRegularAnimations } from "../animations/enemies-regular-animations";
import { EnemiesShooterAnimations } from "../animations/enemies-shooter-animations";
import { EnemiesSpeedyAnimations } from "../animations/enemies-speedy-animations";
import { FortressAnimations } from "../animations/fortress-animations";
import { PlayerOneAnimations } from "../animations/player-one-animations";
import { PlayerTwoAnimations } from "../animations/player-two-animations";
import { SpawnPointAnimations } from "../animations/spawn-point-animations";

import { GameProgress } from "../entities/game-progress";
import { ScriptManager } from "../scripting/script-manager";
import { StateMachine } from "../scripting/state-machine";

import { StateControlBullets } from "../state-control/state-bullets";
import { StateControlEnemies } from "../state-control/state-enemies";
import { StateControlPlayer } from "../state-control/state-player";

export class StageScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private background!: Phaser.GameObjects.Image;
  private logoEnemiesCount!: Phaser.GameObjects.Group;
  private logoGameOver!: Phaser.GameObjects.Image;
  private logoLevelCount!: Phaser.GameObjects.Image;
  private textLevelCount!: Phaser.GameObjects.BitmapText;
  private logoLivesCount1!: Phaser.GameObjects.Image;
  private textLivesCount1A!: Phaser.GameObjects.BitmapText;
  private textLivesCount1B!: Phaser.GameObjects.BitmapText;
  private logoLivesCount2!: Phaser.GameObjects.Image;
  private textLivesCount2A!: Phaser.GameObjects.BitmapText;
  private textLivesCount2B!: Phaser.GameObjects.BitmapText;

  private frameLayer!: Phaser.Tilemaps.TilemapLayer;
  private gameLayer!: Phaser.Tilemaps.TilemapLayer;
  private bulletsEnemies!: Phaser.Physics.Arcade.Group;
  private bulletsPlayer1!: Phaser.Physics.Arcade.Group;
  private bulletsPlayer2!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private fortress!: Phaser.Physics.Arcade.Sprite;
  private player1!: Phaser.Physics.Arcade.Sprite;
  //private player2: Phaser.Physics.Arcade.Sprite;

  private gameProgress!: GameProgress;

  private filesBaseKey!: string;
  private filesBaseUrl!: string;
  private gameOver!: boolean;
  private stageCompleted!: boolean;
  private sceneEnding!: boolean;

  constructor() {
    super({ key: "StageScene" });
  }

  public init(params: GameProgress): void {
    this.gameProgress = params;
    this.gameProgress.resetStageStats();

    this.filesBaseKey = "game-stage" + this.gameProgress.getStageName();
    this.filesBaseUrl =
      "images/battle-city/stages/stage" + this.gameProgress.getStageName();

    this.gameOver = false;
    this.stageCompleted = false;
    this.sceneEnding = false;
  }

  public preload(): void {
    this.load.image(
      "game-background",
      "images/battle-city/images/backgrounds/game-background.png",
    );

    this.load.tilemapTiledJSON(
      this.filesBaseKey + "-tilemap",
      this.filesBaseUrl + "-tilemap.json",
    );
    this.load.json(
      this.filesBaseKey + "-script",
      this.filesBaseUrl + "-script.json",
    );
    this.load.image(
      "game-tileset",
      "images/battle-city/images/tiles/game-tileset.png",
    );

    this.load.spritesheet(
      "game-bullet",
      "images/battle-city/images/sprites/bullet.png",
      { frameWidth: 12, frameHeight: 12 },
    );
    this.load.spritesheet(
      "game-bullet-explosion",
      "images/battle-city/images/sprites/bullet-explosion.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-enemy-regular",
      "images/battle-city/images/sprites/enemy-regular.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-enemy-speedy",
      "images/battle-city/images/sprites/enemy-speedy.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-enemy-shooter",
      "images/battle-city/images/sprites/enemy-shooter.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-enemy-heavy",
      "images/battle-city/images/sprites/enemy-heavy.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-fortress",
      "images/battle-city/images/sprites/fortress.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-player-one",
      "images/battle-city/images/sprites/player-one.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-player-two",
      "images/battle-city/images/sprites/player-two.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-points",
      "images/battle-city/images/sprites/game-points.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-spawn-blink",
      "images/battle-city/images/sprites/spawn-blink.png",
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet(
      "game-tank-explosion",
      "images/battle-city/images/sprites/tank-explosion.png",
      { frameWidth: 96, frameHeight: 96 },
    );

    this.load.image(
      "game-enemies-count",
      "images/battle-city/images/sprites/logo-enemies.png",
    );
    this.load.image(
      "game-game-over",
      "images/battle-city/images/sprites/logo-game-over.png",
    );
    this.load.image(
      "game-level-count",
      "images/battle-city/images/sprites/logo-flag.png",
    );
    this.load.image(
      "game-lives-count",
      "images/battle-city/images/sprites/logo-lives.png",
    );
    this.load.image(
      "game-spawn-point",
      "images/battle-city/images/sprites/spawn-point.png",
    );
  }

  public create(): void {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.resetCursorKeys();
    } else {
      throw new Error("Keyboard input is not available.");
    }

    this.background = this.add.image(0, 0, "game-background");
    this.background.setOrigin(0, 0);

    const map = this.make.tilemap({ key: this.filesBaseKey + "-tilemap" });
    const tileSet = map.addTilesetImage("game-tileset", "game-tileset");

    if (!tileSet) {
      throw new Error("Tileset not found in cache: game-tileset");
    }

    this.frameLayer = map.createLayer(
      "frame-layer",
      tileSet,
      0,
      0,
    ) as Phaser.Tilemaps.TilemapLayer;
    this.gameLayer = map.createLayer(
      "game-layer",
      tileSet,
      0,
      0,
    ) as Phaser.Tilemaps.TilemapLayer;
    const aboveLayer = map
      .createLayer("above-layer", tileSet, 0, 0)!
      .setDepth(2);

    this.frameLayer.setCollisionBetween(1, 9999, true, true);
    this.gameLayer.setCollisionBetween(1, 9999, true, true);

    this.bulletsEnemies = this.physics.add.group();
    this.bulletsPlayer1 = this.physics.add.group();
    this.bulletsPlayer2 = this.physics.add.group();

    this.enemies = this.physics.add.group();

    this.fortress = this.physics.add.sprite(360, 648, "game-fortress");
    this.fortress.refreshBody();
    this.fortress.setBounce(0, 0);
    this.fortress.setCollideWorldBounds(true);
    this.fortress.setImmovable(true);

    this.player1 = this.physics.add.sprite(264, 648, "game-player-one");
    this.player1.setData("name", "player-one");
    this.player1.setBounce(0, 0);
    this.player1.setCollideWorldBounds(true);
    this.player1.setImmovable(false);
    this.player1.setPushable(false);

    // this.player2 = this.physics.add.sprite(456, 648, 'game-player-two');
    // this.player2.setData('name', 'player-two');
    // this.player2.setBounce(0, 0);
    // this.player2.setCollideWorldBounds(true);
    // this.player2.setImmovable(false);
    // this.player2.setPushable(false);

    this.logoGameOver = this.add.image(360, 744, "game-game-over").setDepth(3);
    this.logoLevelCount = this.add.image(720, 576, "game-level-count");
    this.textLevelCount = this.add.bitmapText(
      720,
      600,
      "console-font",
      this.gameProgress.stageNumber.toString(),
      24,
    );
    this.textLevelCount.setTint(0x111111);
    this.logoLivesCount1 = this.add.image(708, 444, "game-lives-count");
    this.textLivesCount1A = this.add.bitmapText(
      696,
      408,
      "console-font",
      "IP",
      24,
    );
    this.textLivesCount1A.setTint(0x111111);
    this.textLivesCount1B = this.add.bitmapText(
      724,
      432,
      "console-font",
      this.gameProgress.playerOneLives.toString(),
      24,
    );
    this.textLivesCount1B.setTint(0x111111);
    this.logoLivesCount2 = this.add.image(708, 516, "game-lives-count");
    this.textLivesCount2A = this.add.bitmapText(
      696,
      480,
      "console-font",
      "#P",
      24,
    );
    this.textLivesCount2A.setTint(0x111111);
    this.textLivesCount2B = this.add.bitmapText(
      724,
      504,
      "console-font",
      this.gameProgress.playerTwoLives.toString(),
      24,
    );
    this.textLivesCount2B.setTint(0x111111);
    this.logoEnemiesCount = this.add.group();

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 2; j++) {
        this.logoEnemiesCount.create(
          708 + j * 24,
          84 + i * 24,
          "game-enemies-count",
        );
      }
    }

    this.setupAnimations();
    this.setupCollitions();

    const dataJSON = this.cache.json.get(this.filesBaseKey + "-script");
    ScriptManager.parse(
      this,
      this.enemies,
      dataJSON,
      this.enemyCreated,
      this.logoEnemiesCount,
    );
  }

  public override update(time: any): void {
    if (this.player1.body === undefined) {
      return;
    }

    StateControlPlayer.processMovement(this.player1, this.cursors);

    if (this.cursors.space.isDown) {
      this.cursors.space.reset();
      this.createBulletForPlayerOne();
    }

    // this.enemies.getChildren().forEach((element: Phaser.Physics.Arcade.Sprite) => {

    //   const enemyName = element.getData("name").toString();
    //   const enemyMovement = StateMachine.getMovement(enemyName);
    //   const enemyShooting = StateMachine.getShooting(enemyName);

    //   StateControlEnemies.processMovement(element, enemyMovement);
    //   if (enemyShooting) { this.createBulletForEnemy(element); }
    // });

    this.enemies.getChildren().forEach((element) => {
      const sprite = element as Phaser.Physics.Arcade.Sprite;

      const enemyName = sprite.getData("name").toString();
      const enemyMovement = StateMachine.getMovement(enemyName);
      const enemyShooting = StateMachine.getShooting(enemyName);

      StateControlEnemies.processMovement(sprite, enemyMovement);
      if (enemyShooting) {
        this.createBulletForEnemy(sprite);
      }
    });

    if (this.gameOver && !this.sceneEnding) {
      this.stageFailed();
    }
    if (this.stageCompleted && !this.sceneEnding) {
      this.stageSucceeded();
    }

    if (
      this.cursors.shift.isDown &&
      this.gameProgress.stageNumber < this.gameProgress.MAX_STAGE
    ) {
      this.cursors.shift.reset();
      this.stageSucceeded();
    }
    if (
      this.cursors.shift.isDown &&
      this.gameProgress.stageNumber === this.gameProgress.MAX_STAGE
    ) {
      this.cursors.shift.reset();
      this.stageFailed();
    }
  }

  private setupAnimations(): void {
    BulletAnimations.create(this);
    EnemiesHeavyAnimations.create(this);
    EnemiesRegularAnimations.create(this);
    EnemiesShooterAnimations.create(this);
    EnemiesSpeedyAnimations.create(this);
    FortressAnimations.create(this);
    PlayerOneAnimations.create(this);
    PlayerTwoAnimations.create(this);
    SpawnPointAnimations.create(this);
  }

  private setupCollitions(): void {
    //this.physics.add.collider(this.player1, this.player2);

    this.physics.add.collider(this.player1, this.frameLayer);
    this.physics.add.collider(this.player1, this.gameLayer);
    this.physics.add.collider(this.player1, this.fortress);
    this.physics.add.collider(this.player1, this.enemies);

    //this.physics.add.collider(this.player2, this.frameLayer);
    // this.physics.add.collider(this.player2, this.gameLayer);
    // this.physics.add.collider(this.player2, this.fortress);
    // this.physics.add.collider(this.player2, this.enemies);

    this.physics.add.collider(this.enemies, this.frameLayer);
    this.physics.add.collider(this.enemies, this.gameLayer);
    this.physics.add.collider(this.enemies, this.fortress);

    // this.physics.add.collider(
    //   this.bulletsPlayer1,
    //   this.player2,
    //   this.collitionDestroyBullet,
    //   undefined,
    //   this,
    // );

    this.physics.add.collider(
      this.bulletsPlayer1,
      this.frameLayer,
      this.collitionDestroyBullet,
      undefined,
      this,
    );
    this.physics.add.collider(
      this.bulletsPlayer1,
      this.gameLayer,
      this.collitionDestroyGameLayer,
      undefined,
      this,
    );
    this.physics.add.collider(
      this.bulletsPlayer1,
      this.fortress,
      this.collitionDestroyFortress,
      undefined,
      this,
    );
    this.physics.add.collider(
      this.bulletsPlayer1,
      this.enemies,
      this.collitionDestroyEnemy,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.bulletsPlayer1,
      this.bulletsEnemies,
      this.collitionDestroyBullets,
      undefined,
      this,
    );
    //   this.physics.add.collider(this.bulletsEnemies, this.player1, this.collitionDestroyPlayer, null, this);

    //   this.physics.add.collider(this.bulletsPlayer2, this.player1, this.collitionDestroyBullet, null, this);
    //   this.physics.add.collider(this.bulletsPlayer2, this.frameLayer, this.collitionDestroyBullet, null, this);
    //   this.physics.add.collider(this.bulletsPlayer2, this.gameLayer, this.collitionDestroyGameLayer, null, this);
    //   this.physics.add.collider(this.bulletsPlayer2, this.fortress, this.collitionDestroyFortress, null, this);
    //   this.physics.add.collider(this.bulletsPlayer2, this.enemies, this.collitionDestroyEnemy, null, this);
    //   this.physics.add.collider(this.bulletsPlayer2, this.bulletsEnemies, this.collitionDestroyBullets, null, this);
    //   this.physics.add.collider(this.bulletsEnemies, this.player2, this.collitionDestroyBullet, null, this); // to modifiy

    this.physics.add.collider(
      this.bulletsEnemies,
      this.frameLayer,
      this.collitionDestroyBullet,
      undefined,
      this,
    );
    this.physics.add.collider(
      this.bulletsEnemies,
      this.gameLayer,
      this.collitionDestroyGameLayer,
      undefined,
      this,
    );
    // this.physics.add.collider(this.bulletsEnemies, this.fortress, this.collitionDestroyFortress, undefined, this);
  }

  private createBulletForPlayerOne() {
    if (this.bulletsPlayer1.getLength() > 0) {
      return;
    }

    const BULLET_SPEED = 360;
    const BULLET_DELTA = 24 - 1; // -1 for tiles coordinates

    let anim: string = "";
    let posX: number = 0;
    let posY: number = 0;
    let velX: number = 0;
    let velY: number = 0;

    const direction = StateControlPlayer.getDirection();

    if (direction == Phaser.UP) {
      anim = "game-anim-bullet-up";
      posX = this.player1.x;
      posY = this.player1.y - BULLET_DELTA;
      velX = 0;
      velY = -BULLET_SPEED;
    } else if (direction == Phaser.RIGHT) {
      anim = "game-anim-bullet-right";
      posX = this.player1.x + BULLET_DELTA;
      posY = this.player1.y;
      velX = BULLET_SPEED;
      velY = 0;
    } else if (direction == Phaser.DOWN) {
      anim = "game-anim-bullet-down";
      posX = this.player1.x;
      posY = this.player1.y + BULLET_DELTA;
      velX = 0;
      velY = BULLET_SPEED;
    } else if (direction == Phaser.LEFT) {
      anim = "game-anim-bullet-left";
      posX = this.player1.x - BULLET_DELTA;
      posY = this.player1.y;
      velX = -BULLET_SPEED;
      velY = 0;
    }

    const bullet: Phaser.Physics.Arcade.Sprite = this.bulletsPlayer1.create(
      posX,
      posY,
      "game-bullet",
    );
    bullet.setData("name", "player-one-bullet");
    bullet.setData("key", Phaser.Math.RND.integer());
    bullet.setBounce(0, 0);
    bullet.setCollideWorldBounds(true);
    bullet.setVelocity(velX, velY);
    bullet.anims.play(anim, true);

    const bulletDirection = StateControlPlayer.getDirection();
    StateControlBullets.register(
      bullet.getData("name"),
      bullet.getData("key"),
      bulletDirection,
    );
  }

  private createBulletForEnemy(enemy: Phaser.Physics.Arcade.Sprite) {
    // if (this.bulletsEnemies.getLength() > 0) { return; }
    // ToDo: Limitar a 1 disparo a la vez por enemigo

    const BULLET_SPEED = 360;
    const BULLET_DELTA = 24 - 1; // -1 for tiles coordinates

    let anim: string = "";
    let posX: number = 0;
    let posY: number = 0;
    let velX: number = 0;
    let velY: number = 0;

    const direction = StateControlEnemies.getDirection(enemy);

    if (direction == Phaser.UP) {
      anim = "game-anim-bullet-up";
      posX = enemy.x;
      posY = enemy.y - BULLET_DELTA;
      velX = 0;
      velY = -BULLET_SPEED;
    } else if (direction == Phaser.RIGHT) {
      anim = "game-anim-bullet-right";
      posX = enemy.x + BULLET_DELTA;
      posY = enemy.y;
      velX = BULLET_SPEED;
      velY = 0;
    } else if (direction == Phaser.DOWN) {
      anim = "game-anim-bullet-down";
      posX = enemy.x;
      posY = enemy.y + BULLET_DELTA;
      velX = 0;
      velY = BULLET_SPEED;
    } else if (direction == Phaser.LEFT) {
      anim = "game-anim-bullet-left";
      posX = enemy.x - BULLET_DELTA;
      posY = enemy.y;
      velX = -BULLET_SPEED;
      velY = 0;
    }

    const bullet: Phaser.Physics.Arcade.Sprite = this.bulletsEnemies.create(
      posX,
      posY,
      "game-bullet",
    );
    bullet.setBounce(0, 0);
    bullet.setCollideWorldBounds(true);
    bullet.setData("name", "enemy-bullet");
    bullet.setData("key", Phaser.Math.RND.integer());
    bullet.setVelocity(velX, velY);
    bullet.anims.play(anim, true);

    const bulletDirection = StateControlEnemies.getDirection(enemy);
    StateControlBullets.register(
      bullet.getData("name"),
      bullet.getData("key"),
      bulletDirection,
    );
  }

  private collitionDestroyBullet(src: any, dst: any): void {
    if (
      src instanceof Phaser.Physics.Arcade.Sprite &&
      src.getData !== undefined
    ) {
      src.anims.play("game-anim-bullet-explosion", true);
      // StateControlBullets.unregister(src.getData("name"), src.getData("key"));

      if (src.getData("name") === "player-one-bullet") {
        this.time.delayedCall(150, () => {
          this.bulletsPlayer1.remove(src, true, true);
        });
      }
      if (src.getData("name") === "enemy-bullet") {
        this.time.delayedCall(150, () => {
          this.bulletsEnemies.remove(src, true, true);
        });
      }
    }

    if (
      dst instanceof Phaser.Physics.Arcade.Sprite &&
      dst.getData !== undefined
    ) {
      dst.anims.play("game-anim-bullet-explosion", true);
      // StateControlBullets.unregister(dst.getData("name"), dst.getData("key"));

      if (dst.getData("name") === "player-one-bullet") {
        this.time.delayedCall(150, () => {
          this.bulletsPlayer1.remove(dst, true, true);
        });
      }
      if (dst.getData("name") === "enemy-bullet") {
        this.time.delayedCall(150, () => {
          this.bulletsEnemies.remove(dst, true, true);
        });
      }
    }
  }

  private collitionDestroyBullets(src: any, dst: any): void {
    this.bulletsPlayer1.remove(src, true, true);
    this.bulletsEnemies.remove(dst, true, true);
  }

  private collitionDestroyEnemy(src: any, dst: any): void {
    src.anims.play("game-anim-bullet-explosion", true);
    this.time.delayedCall(150, () => {
      this.bulletsPlayer1.remove(src, true, true);
    });

    const type = dst.getData("type");
    const anim = "game-anim-" + type + "-explosion";

    if (type === "regular") {
      this.gameProgress.playerOneRegularsCount += 1;
    } else if (type === "speedy") {
      this.gameProgress.playerOneSpeediesCount += 1;
    } else if (type === "shooter") {
      this.gameProgress.playerOneShootersCount += 1;
    } else if (type === "heavy") {
      this.gameProgress.playerOneHeaviesCount += 1;
    }

    if (dst.body) {
      dst.body.enable = false;
    }
    dst.setData("stop", true);
    dst.anims.play(anim, true);

    this.time.delayedCall(1000, () => {
      this.enemies.remove(dst, true, true);
      this.checkStageCompleted();
    });
  }

  private collitionDestroyFortress(src: any, dst: any): void {
    this.fortress.anims.play("game-anim-fortress-destroyed");

    this.bulletsPlayer1.remove(dst, true, true);
    this.bulletsEnemies.remove(dst, true, true);

    this.gameOver = true;
  }

  private collitionDestroyGameLayer(src: any, dst: any): void {
    src.anims.play("game-anim-bullet-explosion", true);

    const name: string = src.getData("name");

    if (name === "player-one-bullet") {
      this.time.delayedCall(150, () => {
        this.bulletsPlayer1.remove(src, true, true);
      });
    } else if (name === "enemy-bullet") {
      this.time.delayedCall(150, () => {
        this.bulletsEnemies.remove(src, true, true);
      });
    }

    const direction = StateControlBullets.getDirection(src);

    const tileXY: Phaser.Math.Vector2 = this.gameLayer.worldToTileXY(
      src.x,
      src.y,
    );

    if (dst.index === 3 || dst.index === 4) {
      if (direction == Phaser.UP) {
        const delta = this.gameLayer.hasTileAt(tileXY.x, tileXY.y - 1) ? 1 : 2;
        this.gameLayer.removeTileAt(tileXY.x + 1, tileXY.y - delta);
        this.gameLayer.removeTileAt(tileXY.x + 0, tileXY.y - delta);
        this.gameLayer.removeTileAt(tileXY.x - 1, tileXY.y - delta);
        this.gameLayer.removeTileAt(tileXY.x - 2, tileXY.y - delta);
      } else if (direction == Phaser.RIGHT) {
        const delta = this.gameLayer.hasTileAt(tileXY.x + 1, tileXY.y) ? 1 : 2;
        this.gameLayer.removeTileAt(tileXY.x + delta, tileXY.y - 2);
        this.gameLayer.removeTileAt(tileXY.x + delta, tileXY.y - 1);
        this.gameLayer.removeTileAt(tileXY.x + delta, tileXY.y + 0);
        this.gameLayer.removeTileAt(tileXY.x + delta, tileXY.y + 1);
      } else if (direction == Phaser.DOWN) {
        const delta = this.gameLayer.hasTileAt(tileXY.x, tileXY.y + 1) ? 1 : 2;
        this.gameLayer.removeTileAt(tileXY.x + 1, tileXY.y + delta);
        this.gameLayer.removeTileAt(tileXY.x + 0, tileXY.y + delta);
        this.gameLayer.removeTileAt(tileXY.x - 1, tileXY.y + delta);
        this.gameLayer.removeTileAt(tileXY.x - 2, tileXY.y + delta);
      } else if (direction == Phaser.LEFT) {
        const delta = this.gameLayer.hasTileAt(tileXY.x - 1, tileXY.y) ? 1 : 2;
        this.gameLayer.removeTileAt(tileXY.x - delta, tileXY.y - 2);
        this.gameLayer.removeTileAt(tileXY.x - delta, tileXY.y - 1);
        this.gameLayer.removeTileAt(tileXY.x - delta, tileXY.y + 0);
        this.gameLayer.removeTileAt(tileXY.x - delta, tileXY.y + 1);
      }
    }
  }

  private collitionDestroyPlayer(
    src: Phaser.Physics.Arcade.Sprite,
    dst: Phaser.Physics.Arcade.Sprite,
  ): void {
    dst.anims.play("game-anim-bullet-explosion", true);

    if (dst.body) {
      dst.body.enable = false;
    }

    this.bulletsEnemies.remove(dst, true, true);

    this.gameProgress.playerOneLives -= 1;

    if (this.gameProgress.playerOneLives >= 0) {
      this.textLivesCount1B.setText(
        this.gameProgress.playerOneLives.toString(),
      );
      this.player1.setPosition(264, 648);
    } else {
      this.gameOver = true;
    }
  }

  private enemyCreated(logoEnemiesCount: Phaser.GameObjects.Group) {
    logoEnemiesCount.remove(logoEnemiesCount.getLast(true), true, true);
  }

  private resetCursorKeys(): void {
    this.cursors.down.reset();
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.shift.reset();
    this.cursors.space.reset();
    this.cursors.up.reset();
  }

  private checkStageCompleted(): void {
    if (
      this.logoEnemiesCount.getLength() === 0 &&
      this.enemies.getLength() === 0
    ) {
      this.stageCompleted = true;
    }
  }

  private stageFailed() {
    if (this.sceneEnding) {
      return;
    }
    this.sceneEnding = true;

    this.tweens.add({
      duration: 2000,
      ease: "Back",
      repeat: 0,
      targets: this.logoGameOver,
      y: "342",
      yoyo: false,
    });
    this.time.delayedCall(3000, () => {
      this.scene.start("GameOverScene");
    });
  }

  private stageSucceeded() {
    if (this.sceneEnding) {
      return;
    }
    this.sceneEnding = true;

    this.time.delayedCall(2000, () => {
      this.resetCursorKeys();
      this.scene.start("ScoresScene", this.gameProgress);
    });
  }
}

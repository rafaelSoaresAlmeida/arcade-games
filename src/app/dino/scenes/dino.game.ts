import * as Phaser from 'phaser';

import { Dino } from '../actors/dino';
import { EnemyBird } from '../actors/enemy-bird';
import { EnemyCactuses } from '../actors/enemy-cactuses';

export class DinoGame extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.BitmapText;
  private ground!: Phaser.GameObjects.TileSprite;
  private obsticles!: Phaser.GameObjects.Group;
  private dino!: Dino;
  private startEvent: any;

  private width: number = 1000;
  private gameSpeed: number = 5;
  private respawnTime: number = 0;
  private height: number = 340;

  /*  private loginService: LoginService = ServiceLocator.injector.get(
    LoginService
  );
  private rankService: RankService = ServiceLocator.injector.get(RankService);
  private notificationService: NotificationService = ServiceLocator.injector.get(
    NotificationService
  ); */

  constructor() {
    super('DinoGame');
  }

  init(): void {
    this.registry.set('score', -1);
  }

  preload(): void {
    this.load.pack('dinoPack', 'images/dino/pack.json', 'dinoPack');
  }

  create(): void {
    this.obsticles = this.add.group();
    this.ground = this.add
      .tileSprite(0, this.height, 88, 26, 'ground')
      .setOrigin(0, 1);

    this.dino = new Dino({
      scene: this,
      x: 75,
      y: this.height,
      key: 'dino-idle',
    });

    this.scoreText = this.add
      .bitmapText(
        this.sys.canvas.width / 2 - 14,
        30,
        'font',
        this.registry.values['score']
      )
      .setDepth(2);
  }

  override update(time: any, delta: number): void {
    this.startGame();
    this.enemiesManagement(delta);
  }

  private startGame(): void {
    this.startEvent = this.time.addEvent({
      delay: 1000 / 60,
      loop: true,
      callbackScope: this,
      callback: () => {
        this.dino.update();

        if (this.ground.width < this.width) {
          this.ground.width += 17 * 2;
        }
      },
    });
  }

  private enemiesManagement(delta: number): void {
    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1500) {
      this.createEnemy();
      this.respawnTime = 0;
    }

    this.obsticles.getChildren().forEach((obsticle) => {
      if (obsticle.body && obsticle.body.position.x == 0) {
        this.obsticles.killAndHide(obsticle);
      }
    });

    this.physics.overlap(
      this.dino,
      this.obsticles,
      () => {
        //   this.persistScore();
        this.scene.start('DinoGameOver', {
          score: this.registry.values['score'],
        });
      },
      undefined,
      this
    );
  }

  private handleScore(): void {
    this.registry.values['score'] += 1;
    this.scoreText.setText(this.registry.values['score']);
    this.gameSpeed += 0.1;
  }

  private createEnemy(): void {
    const obsticleNum = Math.floor(Math.random() * 7) + 1;
    this.handleScore();

    if (obsticleNum > 6) {
      const enemyHeight = [30, 100];

      this.obsticles.add(
        new EnemyBird({
          scene: this,
          x: this.width - 130,
          y: this.height - enemyHeight[Math.floor(Math.random() * 2)],
          key: 'enemy-bird',
        })
      );
    } else {
      this.obsticles.add(
        new EnemyCactuses({
          scene: this,
          x: this.width - 130,
          y: this.height - 15,
          key: `obsticle-${obsticleNum}`,
        })
      );
    }
  }

  /*   private persistScore(): void {
    if (this.registry.values.score > 0 && this.loginService.user) {
      var scoreObj = buildScoreObject(
        this.loginService.user.name,
        this.loginService.user.email,
        this.registry.values.score.toString(),
        Games.DINO
      );

      this.rankService.persistScore(scoreObj).subscribe((response) => {
        this.notificationService.notifyRanking(response);
      });
    }
  } */
}

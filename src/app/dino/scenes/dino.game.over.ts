import { Dino } from '../actors/dino';

export class DinoGameOver extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.BitmapText;
  private ground!: Phaser.GameObjects.TileSprite;
  private dino!: Dino;
  // private gameOverText: Phaser.GameObjects.Image;
   private restartIcon!: Phaser.GameObjects.Image;

  private height: number = 340;
  private width: number = 1000;

  constructor() {
    super('DinoGameOver');
  }

  preload(): void {
    this.load.pack('dinoPack', 'images/dino/pack.json', 'dinoPack');
  }

  create(data: { score: number }): void {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.ground = this.add
      .tileSprite(0, this.height, 88, 26, 'ground')
      .setOrigin(0, 1);

    this.ground.width = this.width;

    this.dino = new Dino({
      scene: this,
      x: 75,
      y: this.height,
      key: 'dino-hurt',
    });

    this.dino.body.offset.y = 18;

    // this.gameOverText = this.add.image(
    //   screenCenterX,
    //   screenCenterY,
    //   'game-over'
    // );
     this.restartIcon = this.add
      .image(screenCenterX, screenCenterY + 60, 'restart')
      .setInteractive()
      .on('pointerdown', () => this.restartGame());

    // this.scoreText = this.add
    //   .bitmapText(
    //     this.sys.canvas.width / 2 - 14,
    //     30,
    //     'font',
    //     data.score.toString()jmn 
    //   )
    //   .setDepth(2);
  }

  restartGame(): void {
    this.scene.stop('DinoGameOver');
    this.scene.start('DinoGame');
  }
}

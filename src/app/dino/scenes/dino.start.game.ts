import { Dino } from '../actors/dino';

export class DinoStartGame extends Phaser.Scene {
  private clickButton: any;

  private ground!: Phaser.GameObjects.TileSprite;
  private dino!: Dino;

  private height: number = 340;
  private width: number = 1000;

  constructor() {
    super('DinoStartGame');
  }

  preload(): void {
    this.load.pack('dinoPack', 'images/dino/pack.json', 'dinoPack');
  }

  create(): void {
    this.ground = this.add
      .tileSprite(0, this.height, 88, 26, 'ground')
      .setOrigin(0, 1);

    this.ground.width = this.width;

    this.dino = new Dino({
      scene: this,
      x: 75,
      y: this.height,
      key: 'dino-idle',
    });

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.clickButton = this.add
      .text(screenCenterX, screenCenterY, 'CLICK HERE TO START!', {
        fontSize: '48px',
        color: '#0f0',
      })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState());
  }

  startGame(): void {
    this.scene.stop('DinoStartGame');
    this.scene.start('DinoGame');
  }

  enterButtonHoverState(): void {
    this.clickButton.setStyle({ fill: '#ff0' });
  }

  enterButtonRestState(): void {
    this.clickButton.setStyle({ fill: '#0f0' });
  }
}

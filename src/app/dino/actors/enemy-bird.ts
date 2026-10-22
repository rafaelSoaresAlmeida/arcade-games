export class EnemyBird extends Phaser.GameObjects.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(params: any) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.setDepth(1);

    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(44, 92);
    this.body.setVelocityX(-300);

    this.scene.add.existing(this);

    this.setOrigin(0, 1);
    this.body.setImmovable();
    this.initAnims();
    this.play('enemy-dino-fly', true);
  }

  updateGame(): void {}

  initAnims() {
    this.anims.create({
      key: 'enemy-dino-fly',
      frames: this.anims.generateFrameNumbers('enemy-bird', {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }
}

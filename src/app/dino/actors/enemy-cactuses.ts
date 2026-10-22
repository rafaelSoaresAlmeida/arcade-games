export class EnemyCactuses extends Phaser.GameObjects.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(params: any) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.offset.y = +10;
    this.body.setImmovable();
    this.body.setCollideWorldBounds(true);
    this.body.setSize(44, 92);
    this.body.setVelocityX(-300);

    this.setOrigin(0, 1);
    this.setDepth(1);
  }
}

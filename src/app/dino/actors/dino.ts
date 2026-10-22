export class Dino extends Phaser.GameObjects.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  private jumpKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private started: boolean = false;

  constructor(params: any) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.setOrigin(0, 1);

    this.setOrigin(0, 0);
    this.setDepth(1);

    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.setGravityY(5000);
    this.body.setSize(44, 92);

    if (this.scene) {
      if (!this.scene.input.keyboard) {
        throw new Error('Keyboard input is not available');
      }

      this.jumpKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );

      this.downKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.DOWN
      );
    }

    this.scene.add.existing(this);

    this.initAnims();
  }

  override update(): void {
    if (!this.started) {
      this.jump();
      this.started = true;
    }

    this.body.offset.y = 34;

    if (this.jumpKey.isDown) {
      this.jump();
    }

    if (this.downKey.isDown) {
      this.getDown();
    }

    if (this.downKey.isUp) {
      if (!this.body.onFloor()) {
        return;
      }

      this.height = 92;
      this.body.offset.y = 0;

      this.anims.play('dino-run', true);
    }
  }

  initAnims() {
    this.anims.create({
      key: 'dino-run',
      frames: this.anims.generateFrameNumbers('dino', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'dino-down-run',
      frames: this.anims.generateFrameNumbers('dino-down', {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private jump(): void {
    if (!this.body.onFloor()) {
      return;
    }

    this.height = 92;
    this.setTexture('dino', 0);
    this.body.setVelocityY(-1600);
    this.body.offset.y = 0;

    this.anims.play('dino-run', true);
  }

  private getDown(): void {
    if (!this.body.onFloor()) {
      return;
    }

    this.height = 58;
    this.anims.play('dino-down-run', true);
  }
}

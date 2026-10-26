export class BulletAnimations {

  public static create(scene: Phaser.Scene): void {

    const BULLET_UP: string = "game-anim-bullet-up";
    const BULLET_RIGHT: string = "game-anim-bullet-right";
    const BULLET_DOWN: string = "game-anim-bullet-down";
    const BULLET_LEFT: string = "game-anim-bullet-left";
    const BULLET_EXPLOSION: string = "game-anim-bullet-explosion";

    const KEY_BULLET: string = "game-bullet";
    const KEY_BULLET_EXPLOSION: string = "game-bullet-explosion";

    if (scene.anims.get(BULLET_UP) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_BULLET, { start: 0, end: 0 }),
        key: BULLET_UP,
        repeat: 0,
      });
    }

    if (scene.anims.get(BULLET_RIGHT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_BULLET, { start: 1, end: 1 }),
        key: BULLET_RIGHT,
        repeat: 0,
      });
    }

    if (scene.anims.get(BULLET_DOWN) === undefined) {
        scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_BULLET, { start: 2, end: 2 }),
        key: BULLET_DOWN,
        repeat: 0,
      });
    }

    if (scene.anims.get(BULLET_LEFT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_BULLET, { start: 3, end: 3 }),
        key: BULLET_LEFT,
        repeat: 0,
      });
    }

    if (scene.anims.get(BULLET_EXPLOSION) === undefined) {
      scene.anims.create({
        frameRate: 20,
        frames: scene.anims.generateFrameNumbers(KEY_BULLET_EXPLOSION, { start: 0, end: 3 }),
        key: BULLET_EXPLOSION,
        repeat: 0,
      });
    }
  }
}

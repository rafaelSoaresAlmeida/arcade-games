export class EnemiesRegularAnimations {

  public static create(scene: Phaser.Scene): void {

    const REGULAR_ENEMY_UP: string = "game-anim-regular-enemy-up";
    const REGULAR_ENEMY_RIGHT: string = "game-anim-regular-enemy-right";
    const REGULAR_ENEMY_DOWN: string = "game-anim-regular-enemy-down";
    const REGULAR_ENEMY_LEFT: string = "game-anim-regular-enemy-left";
    const REGULAR_ENEMY_EXPLOSION: string = "game-anim-regular-explosion";

    const KEY_ENEMY_REGULAR: string = "game-enemy-regular";
    const KEY_TANK_EXPLOSION: string = "game-tank-explosion";

    if (scene.anims.get(REGULAR_ENEMY_UP) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_REGULAR, { start: 0, end: 1 }),
        key: REGULAR_ENEMY_UP,
        repeat: 0,
      });
    }

    if (scene.anims.get(REGULAR_ENEMY_RIGHT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_REGULAR, { start: 2, end: 3 }),
        key: REGULAR_ENEMY_RIGHT,
        repeat: 0,
      });
    }

    if (scene.anims.get(REGULAR_ENEMY_DOWN) === undefined) {
        scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_REGULAR, { start: 4, end: 5 }),
        key: REGULAR_ENEMY_DOWN,
        repeat: 0,
      });
    }

    if (scene.anims.get(REGULAR_ENEMY_LEFT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_REGULAR, { start: 6, end: 7 }),
        key: REGULAR_ENEMY_LEFT,
        repeat: 0,
      });
    }

    if (scene.anims.get(REGULAR_ENEMY_EXPLOSION) === undefined) {
      const anim: false | Phaser.Animations.Animation = scene.anims.create({
        frameRate: 9,
        frames: scene.anims.generateFrameNumbers(KEY_TANK_EXPLOSION, { start: 0, end: 5 }),
        key: REGULAR_ENEMY_EXPLOSION,
        repeat: 0,
      });
      if (anim) {
        const animFrame = scene.anims.generateFrameNumbers("game-points", { start: 0, end: 0 });
        (anim as Phaser.Animations.Animation).addFrame(animFrame);
      }
    }
  }
}

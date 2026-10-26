export class EnemiesSpeedyAnimations {

  public static create(scene: Phaser.Scene): void {

    const SPEEDY_ENEMY_UP: string = "game-anim-speedy-enemy-up";
    const SPEEDY_ENEMY_RIGHT: string = "game-anim-speedy-enemy-right";
    const SPEEDY_ENEMY_DOWN: string = "game-anim-speedy-enemy-down";
    const SPEEDY_ENEMY_LEFT: string = "game-anim-speedy-enemy-left";
    const SPEEDY_ENEMY_EXPLOSION: string = "game-anim-speedy-explosion";

    const KEY_ENEMY_SPEEDY: string = "game-enemy-speedy";
    const KEY_TANK_EXPLOSION: string = "game-tank-explosion";

    if (scene.anims.get(SPEEDY_ENEMY_UP) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_SPEEDY, { start: 0, end: 1 }),
        key: SPEEDY_ENEMY_UP,
        repeat: 0,
      });
    }

    if (scene.anims.get(SPEEDY_ENEMY_RIGHT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_SPEEDY, { start: 2, end: 3 }),
        key: SPEEDY_ENEMY_RIGHT,
        repeat: 0,
      });
    }

    if (scene.anims.get(SPEEDY_ENEMY_DOWN) === undefined) {
        scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_SPEEDY, { start: 4, end: 5 }),
        key: SPEEDY_ENEMY_DOWN,
        repeat: 0,
      });
    }

    if (scene.anims.get(SPEEDY_ENEMY_LEFT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_SPEEDY, { start: 6, end: 7 }),
        key: SPEEDY_ENEMY_LEFT,
        repeat: 0,
      });
    }

    if (scene.anims.get(SPEEDY_ENEMY_EXPLOSION) === undefined) {
      const anim: false | Phaser.Animations.Animation = scene.anims.create({
        frameRate: 9,
        frames: scene.anims.generateFrameNumbers(KEY_TANK_EXPLOSION, { start: 0, end: 5 }),
        key: SPEEDY_ENEMY_EXPLOSION,
        repeat: 0,
      });
      if (anim) {
        const animFrame = scene.anims.generateFrameNumbers("game-points", { start: 1, end: 1 });
        (anim as Phaser.Animations.Animation).addFrame(animFrame);
      }
    }
  }
}

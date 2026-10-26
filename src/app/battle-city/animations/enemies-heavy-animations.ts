export class EnemiesHeavyAnimations {

  public static create(scene: Phaser.Scene): void {

    const HEAVY_ENEMY_UP: string = "game-anim-heavy-enemy-up";
    const HEAVY_ENEMY_RIGHT: string = "game-anim-heavy-enemy-right";
    const HEAVY_ENEMY_DOWN: string = "game-anim-heavy-enemy-down";
    const HEAVY_ENEMY_LEFT: string = "game-anim-heavy-enemy-left";
    const HEAVY_ENEMY_EXPLOSION: string = "game-anim-heavy-explosion";

    const KEY_ENEMY_HEAVY: string = "game-enemy-heavy";
    const KEY_TANK_EXPLOSION: string = "game-tank-explosion";

    if (scene.anims.get(HEAVY_ENEMY_UP) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_HEAVY, { start: 0, end: 1 }),
        key: HEAVY_ENEMY_UP,
        repeat: 0,
      });
    }

    if (scene.anims.get(HEAVY_ENEMY_RIGHT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_HEAVY, { start: 2, end: 3 }),
        key: HEAVY_ENEMY_RIGHT,
        repeat: 0,
      });
    }

    if (scene.anims.get(HEAVY_ENEMY_DOWN) === undefined) {
        scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_HEAVY, { start: 4, end: 5 }),
        key: HEAVY_ENEMY_DOWN,
        repeat: 0,
      });
    }

    if (scene.anims.get(HEAVY_ENEMY_LEFT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_HEAVY, { start: 6, end: 7 }),
        key: HEAVY_ENEMY_LEFT,
        repeat: 0,
      });
    }

    if (scene.anims.get(HEAVY_ENEMY_EXPLOSION) === undefined) {
      const anim: false | Phaser.Animations.Animation = scene.anims.create({
        frameRate: 9,
        frames: scene.anims.generateFrameNumbers(KEY_TANK_EXPLOSION, { start: 0, end: 5 }),
        key: HEAVY_ENEMY_EXPLOSION,
        repeat: 0,
      });
      if (anim) {
        const animFrame = scene.anims.generateFrameNumbers("game-points", { start: 3, end: 3 });
        (anim as Phaser.Animations.Animation).addFrame(animFrame);
      }
    }
  }
}

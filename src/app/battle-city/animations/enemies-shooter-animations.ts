export class EnemiesShooterAnimations {

  public static create(scene: Phaser.Scene): void {

    const SHOOTER_ENEMY_UP: string = "game-anim-shooter-enemy-up";
    const SHOOTER_ENEMY_RIGHT: string = "game-anim-shooter-enemy-right";
    const SHOOTER_ENEMY_DOWN: string = "game-anim-shooter-enemy-down";
    const SHOOTER_ENEMY_LEFT: string = "game-anim-shooter-enemy-left";
    const SHOOTER_ENEMY_EXPLOSION: string = "game-anim-shooter-explosion";

    const KEY_ENEMY_SHOOTER: string = "game-enemy-shooter";
    const KEY_TANK_EXPLOSION: string = "game-tank-explosion";

    if (scene.anims.get(SHOOTER_ENEMY_UP) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_SHOOTER, { start: 0, end: 1 }),
        key: SHOOTER_ENEMY_UP,
        repeat: 0,
      });
    }

    if (scene.anims.get(SHOOTER_ENEMY_RIGHT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_SHOOTER, { start: 2, end: 3 }),
        key: SHOOTER_ENEMY_RIGHT,
        repeat: 0,
      });
    }

    if (scene.anims.get(SHOOTER_ENEMY_DOWN) === undefined) {
        scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_SHOOTER, { start: 4, end: 5 }),
        key: SHOOTER_ENEMY_DOWN,
        repeat: 0,
      });
    }

    if (scene.anims.get(SHOOTER_ENEMY_LEFT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_ENEMY_SHOOTER, { start: 6, end: 7 }),
        key: SHOOTER_ENEMY_LEFT,
        repeat: 0,
      });
    }

    if (scene.anims.get(SHOOTER_ENEMY_EXPLOSION) === undefined) {
      const anim: false | Phaser.Animations.Animation = scene.anims.create({
        frameRate: 9,
        frames: scene.anims.generateFrameNumbers(KEY_TANK_EXPLOSION, { start: 0, end: 5 }),
        key: SHOOTER_ENEMY_EXPLOSION,
        repeat: 0,
      });
      if (anim) {
        const animFrame = scene.anims.generateFrameNumbers("game-points", { start: 2, end: 2 });
        (anim as Phaser.Animations.Animation).addFrame(animFrame);
      }
    }
  }
}

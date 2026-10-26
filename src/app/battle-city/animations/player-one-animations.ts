export class PlayerOneAnimations {

  public static create(scene: Phaser.Scene): void {

    const PLAYER_ONE_UP: string = "game-anim-player01-up";
    const PLAYER_ONE_RIGHT: string = "game-anim-player01-right";
    const PLAYER_ONE_DOWN: string = "game-anim-player01-down";
    const PLAYER_ONE_LEFT: string = "game-anim-player01-left";
    const PLAYER_ONE_EXPLOSION: string = "game-anim-player01-explosion";

    const KEY_PLAYER_ONE: string = "game-player-one";
    const KEY_TANK_EXPLOSION: string = "game-tank-explosion";

    if (scene.anims.get(PLAYER_ONE_UP) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_PLAYER_ONE, { start: 0, end: 1 }),
        key: PLAYER_ONE_UP,
        repeat: 0,
      });
    }

    if (scene.anims.get(PLAYER_ONE_RIGHT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_PLAYER_ONE, { start: 2, end: 3 }),
        key: PLAYER_ONE_RIGHT,
        repeat: 0,
      });
    }

    if (scene.anims.get(PLAYER_ONE_DOWN) === undefined) {
        scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_PLAYER_ONE, { start: 4, end: 5 }),
        key: PLAYER_ONE_DOWN,
        repeat: 0,
      });
    }

    if (scene.anims.get(PLAYER_ONE_LEFT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_PLAYER_ONE, { start: 6, end: 7 }),
        key: PLAYER_ONE_LEFT,
        repeat: 0,
      });
    }

    if (scene.anims.get(PLAYER_ONE_EXPLOSION) === undefined) {
      scene.anims.create({
        frameRate: 9,
        frames: scene.anims.generateFrameNumbers(KEY_TANK_EXPLOSION, { start: 0, end: 5 }),
        key: PLAYER_ONE_EXPLOSION,
        repeat: 0,
      });
    }
  }
}

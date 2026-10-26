export class PlayerTwoAnimations {

  public static create(scene: Phaser.Scene): void {

    const PLAYER_TWO_UP: string = "game-anim-player02-up";
    const PLAYER_TWO_RIGHT: string = "game-anim-player02-right";
    const PLAYER_TWO_DOWN: string = "game-anim-player02-down";
    const PLAYER_TWO_LEFT: string = "game-anim-player02-left";
    const PLAYER_TWO_EXPLOSION: string = "game-anim-player02-explosion";

    const KEY_PLAYER_TWO: string = "game-player-two";
    const KEY_TANK_EXPLOSION: string = "game-tank-explosion";

    if (scene.anims.get(PLAYER_TWO_UP) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_PLAYER_TWO, { start: 0, end: 1 }),
        key: PLAYER_TWO_UP,
        repeat: 0,
      });
    }

    if (scene.anims.get(PLAYER_TWO_RIGHT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_PLAYER_TWO, { start: 2, end: 3 }),
        key: PLAYER_TWO_RIGHT,
        repeat: 0,
      });
    }

    if (scene.anims.get(PLAYER_TWO_DOWN) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_PLAYER_TWO, { start: 4, end: 5 }),
        key: PLAYER_TWO_DOWN,
        repeat: 0,
      });
    }

    if (scene.anims.get(PLAYER_TWO_LEFT) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_PLAYER_TWO, { start: 6, end: 7 }),
        key: PLAYER_TWO_LEFT,
        repeat: 0,
      });
    }

    if (scene.anims.get(PLAYER_TWO_EXPLOSION) === undefined) {
      scene.anims.create({
        frameRate: 9,
        frames: scene.anims.generateFrameNumbers(KEY_TANK_EXPLOSION, { start: 0, end: 5 }),
        key: PLAYER_TWO_EXPLOSION,
        repeat: 0,
      });
    }
  }
}

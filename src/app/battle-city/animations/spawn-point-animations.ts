export class SpawnPointAnimations {

  public static create(scene: Phaser.Scene): void {

    const SPAWN_POINT_BLINK: string = "game-anim-spawn-point-blink";
    const KEY_SPAWN_POINT: string = "game-spawn-blink";

    if (scene.anims.get(SPAWN_POINT_BLINK) === undefined) {
      scene.anims.create({
        frameRate: 16,
        frames: scene.anims.generateFrameNumbers(KEY_SPAWN_POINT, { start: 0, end: 3 }),
        hideOnComplete: true,
        key: SPAWN_POINT_BLINK,
        repeat: 1,
        yoyo: true,
      });
    }
  }
}

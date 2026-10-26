export class FortressAnimations {

  public static create(scene: Phaser.Scene): void {

    const FORTRESS_DESTROYED: string = "game-anim-fortress-destroyed";
    const KEY_FORTRESS: string = "game-fortress";

    if (scene.anims.get(FORTRESS_DESTROYED) === undefined) {
      scene.anims.create({
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers(KEY_FORTRESS, { start: 1, end: 1 }),
        key: FORTRESS_DESTROYED,
        repeat: 0,
      });
    }
  }
}

import * as Phaser from "phaser";
import { GameProgress } from "../entities/game-progress";

export class GameOverScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "GameOverScene" });
  }

  public init(params: GameProgress): void {
    // .
  }

  public preload(): void {
    this.load.image(
      "gameover-background",
      "assets/images/backgrounds/gameover-background.png",
    );
  }

  public create(): void {
    this.background = this.add
      .image(0, 0, "gameover-background")
      .setOrigin(0, 0);

    this.cameras.main.setScroll(0, -720);
    this.cameras.main.pan(384, 360, 2000, "Linear", false);

    this.time.delayedCall(3000, () => {
      this.scene.start("WelcomeScene");
    });
  }

  public override update(time: any): void {
    // .
  }
}

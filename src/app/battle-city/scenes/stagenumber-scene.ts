import { GameProgress } from "../entities/game-progress";
import * as Phaser from 'phaser';

export class StageNumberScene extends Phaser.Scene {

  private background!: Phaser.GameObjects.Image;
  private textStageNumber!: Phaser.GameObjects.BitmapText;

  private gameProgress!: GameProgress;

  constructor() {
    super({ key: "StageNumberScene" });
  }

  public init(params: GameProgress): void {
    this.gameProgress = params;
  }

  public preload(): void {
    this.load.image("load-background", "images/battle-city/images/backgrounds/load-background.png");
  }

  public create(): void {
    this.background = this.add.image(0, 0, "load-background").setOrigin(0, 0);

    this.textStageNumber = this.add.bitmapText(292, 340, "console-font", "STAGE  " + this.gameProgress.stageNumber, 24);
    this.textStageNumber.setTint(0x111111);

    this.cameras.main.setScroll(0, -720);
    this.cameras.main.pan(384, 360, 500, "Linear", false);

    this.time.delayedCall(2000, () => {
      this.scene.start("StageScene", this.gameProgress);
    });
  }

  public override update(time: any): void {
    // .
  }
}

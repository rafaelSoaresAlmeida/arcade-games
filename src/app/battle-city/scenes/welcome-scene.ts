import * as Phaser from "phaser";
import { GameProgress } from "../entities/game-progress";
export class WelcomeScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private textStart!: Phaser.GameObjects.BitmapText;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private blink!: boolean;
  private gameProgress: GameProgress;

  constructor() {
    super({ key: "WelcomeScene" });
    this.gameProgress = new GameProgress();
  }

  public init(params: any): void {
    this.blink = false;
    this.gameProgress.resetGameProgress();
  }

  public preload() {
    this.load.image(
      "welcome-background",
      "images/battle-city/images/backgrounds/welcome-background.png",
    );
    this.load.bitmapFont(
      "console-font",
      "images/battle-city/fonts/press-start-2p.png",
      "images/battle-city/fonts/press-start-2p.fnt",
    );
  }

  public create() {
    this.background = this.add
      .image(0, 0, "welcome-background")
      .setOrigin(0, 0);
    this.cursors = this.input.keyboard?.createCursorKeys()!;

    this.textStart = this.add.bitmapText(
      172,
      432,
      "console-font",
      "PLEASE INSERT COIN",
      24,
    );
    this.textStart.setTint(0xeeeeee);

    this.cameras.main.setScroll(0, -720);
    this.cameras.main.pan(384, 360, 2000, "Linear", false);

    this.time.addEvent({
      callback: this.blinkBackground,
      callbackScope: this,
      delay: 500,
      loop: true,
    });
  }

  public override update(time: number): void {
    if (this.cursors.space.isDown) {
      this.cursors.space.reset();
      this.gameProgress.nextStage();

      // carga de la siguiente escena
      this.scene.start("StageNumberScene", this.gameProgress);
    }
  }

  private blinkBackground() {
    this.textStart.setVisible(this.blink);
    this.blink = !this.blink;
  }
}

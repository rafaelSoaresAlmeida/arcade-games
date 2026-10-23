//import * as Phaser from "phaser";

export default class FlappyTilapiaGameOver extends Phaser.Scene {
  private clickButton: any;
  private background!: Phaser.GameObjects.TileSprite;

  constructor() {
    super("flappy-tilapia-game-over");
  }

  create(data: { score: number; scene: any }): void {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.background = this.add
      .tileSprite(0, 0, 390, 600, "gameOverBackground")
      .setOrigin(0, 0);

    this.add
      .text(screenCenterX, screenCenterY - 150, "GAME OVER", {
        fontSize: "48px",
        /*             color: '#fff',
            backgroundColor: '#D82727' */
      })
      .setOrigin(0.5);

    this.add
      .text(screenCenterX, screenCenterY - 80, "SCORE: " + data.score, {
        fontSize: "48px",
      })
      .setOrigin(0.5);

    this.clickButton = this.add
      .text(screenCenterX, screenCenterY, "TRY AGAIN!", {
        fontSize: "48px",
        color: "#0f0",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.restartGame())
      .on("pointerover", () => this.enterButtonHoverState())
      .on("pointerout", () => this.enterButtonRestState());
  }

  restartGame(): void {
    this.scene.stop("flappy-tilapia-game-over");
    this.scene.start("FlappyTilapiaGame");
  }

  enterButtonHoverState(): void {
    this.clickButton.setStyle({ fill: "#ff0" });
  }

  enterButtonRestState(): void {
    this.clickButton.setStyle({ fill: "#0f0" });
  }
}

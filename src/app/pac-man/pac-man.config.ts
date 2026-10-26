import { MainScene } from './scenes/main';

export class PacManConfig extends Phaser.Scene {
  public static readonly sceneConfig: Phaser.Types.Core.GameConfig = {
    title: 'Pac-man',
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 464,
    height: 560,
    parent: 'pac-game',
    scene: MainScene,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
  };
}

import { MainScene } from './scenes/main';

export class SpaceInvadersConfig extends Phaser.Scene {
  public static readonly sceneConfig: Phaser.Types.Core.GameConfig = {
    title: 'Space Invaders',
    type: Phaser.AUTO,
    backgroundColor: 'rgb(47, 52, 55)',
    width: 800,
    height: 600,
    scene: MainScene,
    physics: {
      default: 'arcade',
    },
    parent: 'space-game',
  };
}

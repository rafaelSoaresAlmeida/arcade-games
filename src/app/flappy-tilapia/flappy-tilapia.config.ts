import * as Phaser from 'phaser';
import FlappyTilapiaGameOver from './scenes/flappy-tilapia.game-over';
import { FlappyTilapiaGame } from './scenes/flappy-tilapia.game';
import FlappyTilapiaStartGame from './scenes/flappy-tilapia.start-game';

export class FlappyTilapiaConfig extends Phaser.Scene {
  public static readonly sceneConfig: Phaser.Types.Core.GameConfig = {
    width: 400,
    height: 600,
    parent: 'flappy-game',
    input: {
      keyboard: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 300 },
      },
    },
    render: { pixelArt: true },
    scene: [FlappyTilapiaStartGame, FlappyTilapiaGame, FlappyTilapiaGameOver],
  };
}

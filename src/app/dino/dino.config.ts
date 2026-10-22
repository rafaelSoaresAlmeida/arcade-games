import * as Phaser from 'phaser';
import { DinoGame } from './scenes/dino.game';
import { DinoGameOver } from './scenes/dino.game.over';
import { DinoStartGame } from './scenes/dino.start.game';

export class DinoConfig extends Phaser.Scene {
  public static readonly sceneConfig: Phaser.Types.Core.GameConfig = {
    width: 1000,
    height: 340,
    parent: 'dino-game',
    input: {
      keyboard: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [DinoStartGame, DinoGame, DinoGameOver],
  };
}

import * as Phaser from 'phaser';
import { WelcomeScene } from './scenes/welcome-scene';
import { StageNumberScene } from './scenes/stagenumber-scene';
import { StageScene } from './scenes/stage-scene';
import { GameOverScene } from './scenes/gameover-scene';
import { ScoresScene } from './scenes/scores-scene';

// import { DinoGame } from './scenes/dino.game';
// import { DinoGameOver } from './scenes/dino.game.over';
// import { DinoStartGame } from './scenes/dino.start.game';

export class BattleCityConfig extends Phaser.Scene {
  public static readonly sceneConfig: Phaser.Types.Core.GameConfig = {
    backgroundColor: '000000',
    width: 1000,
    height: 720,
    parent: 'battlecity-game',
    physics: {
      arcade: {
        debug: false,
        gravity: { x: 0, y: 0 },
      },
      default: 'arcade',
    },
    render: { pixelArt: true, antialias: false },
    scene: [
      WelcomeScene,
      GameOverScene,
      ScoresScene,
      StageScene,
      StageNumberScene,
    ],
    //scene: [WelcomeScene, StageNumberScene, StageScene],
    title: 'Mini Battle City',
    type: Phaser.AUTO,
  };
}

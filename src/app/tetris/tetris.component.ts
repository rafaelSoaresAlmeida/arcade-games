import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import Phaser from 'phaser';
import { tetrisGameConfig, TetrisScene } from './tetris.scene';

@Component({
  selector: 'app-tetris',
  template: `
    <div class="arcade-page">
      <h1 class="glow" style="font-size: 20px; color: var(--neon-cyan); text-align:center; margin-bottom: 8px;">
        TETRIS
      </h1>
      <p style="font-size: 8px; color: var(--neon-yellow); text-align:center; margin-bottom: 20px;">
        CLASSIC BLOCK PUZZLE
      </p>

      <div class="game-wrapper">
        <div class="hud">
          <div><span class="label">ARROWS:</span> MOVE/ROTATE</div>
          <div><span class="label">R:</span> RESTART</div>
        </div>
        <div #gameContainer id="tetris-game" class="game-container"></div>
        <button class="arcade-btn cyan" (click)="restart()">RESTART GAME</button>
      </div>

      <div class="crt-panel" style="margin-top: 30px;">
        <h2>HOW TO PLAY</h2>
        <div style="font-size: 8px; color: var(--neon-cyan); line-height: 2;">
          <p>&#x25B6; LEFT/RIGHT: MOVE PIECE HORIZONTALLY.</p>
          <p>&#x25B6; UP: ROTATE PIECE.</p>
          <p>&#x25B6; DOWN: ACCELERATE DROP.</p>
          <p>&#x25B6; FILL A FULL ROW TO CLEAR IT.</p>
          <p>&#x25B6; CLEAR MULTIPLE ROWS FOR BONUS POINTS.</p>
          <p>&#x25B6; DON'T LET THE STACK REACH THE TOP!</p>
        </div>
      </div>
    </div>
  `,
})
export class TetrisComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameContainer') gameContainer!: ElementRef;
  private game!: Phaser.Game;

  ngAfterViewInit() {
    this.game = new Phaser.Game(tetrisGameConfig);
  }

  ngOnDestroy() {
    if (this.game) this.game.destroy(true);
  }

  restart() {
    if (this.game) {
      const scene = this.game.scene.getScene('TetrisScene') as TetrisScene;
      scene.scene.restart();
    }
  }
}

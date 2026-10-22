import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import Phaser from 'phaser';
import { flappyGameConfig, FlappyScene } from './flappy-bird.scene';

@Component({
  selector: 'app-flappy-bird',
  template: `
    <div class="arcade-page">
      <h1 class="glow" style="font-size: 20px; color: var(--neon-yellow); text-align:center; margin-bottom: 8px;">
        FLAPPY BIRD
      </h1>
      <p style="font-size: 8px; color: var(--neon-pink); text-align:center; margin-bottom: 20px;">
        TAP TO FLAP
      </p>

      <div class="game-wrapper">
        <div class="hud">
          <div><span class="label">SPACE:</span> FLAP</div>
          <div><span class="label">R:</span> RESTART</div>
        </div>
        <div #gameContainer id="flappy-game" class="game-container"></div>
        <button class="arcade-btn pink" (click)="restart()">RESTART GAME</button>
      </div>

      <div class="crt-panel" style="margin-top: 30px;">
        <h2>HOW TO PLAY</h2>
        <div style="font-size: 8px; color: var(--neon-cyan); line-height: 2;">
          <p>&#x25B6; PRESS SPACE TO FLAP YOUR WINGS.</p>
          <p>&#x25B6; FLY THROUGH THE GAPS BETWEEN PIPES.</p>
          <p>&#x25B6; GRAVITY PULLS YOU DOWN CONSTANTLY.</p>
          <p>&#x25B6; DON'T HIT THE PIPES OR THE GROUND.</p>
          <p>&#x25B6; EACH PIPE PASSED = 1 POINT.</p>
          <p>&#x25B6; PRESS R TO RESTART AFTER GAME OVER.</p>
        </div>
      </div>
    </div>
  `,
})
export class FlappyBirdComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameContainer') gameContainer!: ElementRef;
  private game!: Phaser.Game;

  ngAfterViewInit() {
    this.game = new Phaser.Game(flappyGameConfig);
  }

  ngOnDestroy() {
    if (this.game) this.game.destroy(true);
  }

  restart() {
    if (this.game) {
      const scene = this.game.scene.getScene('FlappyScene') as FlappyScene;
      scene.scene.restart();
    }
  }
}

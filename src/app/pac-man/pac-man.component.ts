import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import Phaser from 'phaser';
import { PacManScene, pacManGameConfig } from './pac-man.scene';
import { PacManConfig } from './pac-man.config';

@Component({
  selector: "app-pac-man",
  template: `
    <div class="arcade-page">
      <h1
        class="glow"
        style="font-size: 20px; color: var(--neon-yellow); text-align:center; margin-bottom: 8px;"
      >
        PAC-MAN
      </h1>
      <p
        style="font-size: 8px; color: var(--neon-pink); text-align:center; margin-bottom: 20px;"
      >
        NAMCO 1980 TRIBUTE
      </p>

      <div class="game-wrapper">
        <div class="hud">
          <div><span class="label">ARROWS:</span> MOVE</div>
          <div><span class="label">R:</span> RESTART</div>
        </div>
        <!-- <div #gameContainer id="pac-man-game" class="game-container"></div> -->
        <div align="center" id="pac-game"></div>
        <button class="arcade-btn" (click)="restart()">RESTART GAME</button>
      </div>

      <div class="crt-panel" style="margin-top: 30px;">
        <h2>HOW TO PLAY</h2>
        <div style="font-size: 8px; color: var(--neon-cyan); line-height: 2;">
          <p>&#x25B6; USE ARROW KEYS TO NAVIGATE THE MAZE.</p>
          <p>&#x25B6; EAT ALL DOTS AND POWER PELLETS TO WIN.</p>
          <p>&#x25B6; AVOID THE GHOSTS: RED, PINK, CYAN, AND ORANGE.</p>
          <p>&#x25B6; GRAB A POWER PELLET TO SCARE THE GHOSTS!</p>
          <p>&#x25B6; EAT SCARED GHOSTS (BLUE) FOR BONUS POINTS.</p>
          <p>&#x25B6; YOU HAVE 3 LIVES. PRESS R TO RESTART.</p>
        </div>
      </div>

      <div class="crt-panel">
        <h2>SCORING</h2>
        <div style="font-size: 8px; color: var(--neon-cyan); line-height: 2;">
          <p>&#x25B6; DOT: 10 POINTS</p>
          <p>&#x25B6; POWER PELLET: 50 POINTS</p>
          <p>&#x25B6; SCARED GHOST: 200 POINTS</p>
        </div>
      </div>
    </div>
  `,
})
export class PacManComponent implements AfterViewInit, OnDestroy {
  @ViewChild("gameContainer") gameContainer!: ElementRef;
  private game!: Phaser.Game;

  ngAfterViewInit() {
    this.game = new Phaser.Game(PacManConfig.sceneConfig);
  }

  ngOnDestroy() {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  restart() {
    if (this.game) {
      const scene = this.game.scene.getScene("PacManScene") as PacManScene;
      scene.scene.restart();
    }
  }
}

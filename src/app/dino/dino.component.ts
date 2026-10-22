import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { DinoConfig } from './dino.config';
import * as Phaser from "phaser"; 


@Component({
  selector: "app-dino",
  template: `
    <div class="arcade-page">
      <h1
        class="glow"
        style="font-size: 20px; color: var(--neon-green); text-align:center; margin-bottom: 8px;"
      >
        DINO RUN
      </h1>
      <p
        style="font-size: 8px; color: var(--neon-yellow); text-align:center; margin-bottom: 20px;"
      >
        ENDLESS DESERT RUNNER
      </p>

      <div class="game-wrapper">
        <div class="hud">
          <div><span class="label">SPACE:</span> JUMP</div>
          <div><span class="label">DOWN:</span> CROUCH</div>
        </div>
        <div #gameContainer id="dino-game" class="game-container"></div>
      </div>

      <div class="crt-panel" style="margin-top: 30px;">
        <h2>HOW TO PLAY</h2>
        <div style="font-size: 8px; color: var(--neon-cyan); line-height: 2;">
          <p>&#x25B6; PRESS SPACE TO JUMP OVER CACTUS.</p>
          <p>&#x25B6; PRESS DOWN TO CROUCH UNDER BIRDS.</p>
          <p>&#x25B6; THE GAME SPEEDS UP AS YOU PROGRESS.</p>
          <p>&#x25B6; SURVIVE AS LONG AS POSSIBLE!</p>
        </div>
      </div>
    </div>
  `,
})
export class DinoComponent implements AfterViewInit, OnDestroy {
  @ViewChild("gameContainer") gameContainer!: ElementRef;
  private game!: Phaser.Game;

  ngAfterViewInit() {
    this.game = new Phaser.Game(DinoConfig.sceneConfig);
  }

  ngOnDestroy() {
    if (this.game) this.game.destroy(true);
  }

}

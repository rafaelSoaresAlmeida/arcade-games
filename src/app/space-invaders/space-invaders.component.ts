import { Component } from '@angular/core';
import { SpaceInvadersConfig } from './space-invaders.config';

@Component({
  selector: "app-space-invaders",
  template: `
    <div class="arcade-page">
      <h1
        class="glow"
        style="font-size: 20px; color: var(--neon-yellow); text-align:center; margin-bottom: 8px;"
      >
        SPACE INVADERS
      </h1>
      <p
        style="font-size: 8px; color: var(--neon-pink); text-align:center; margin-bottom: 20px;"
      >
        TAP TO FIRE AND MOVE
      </p>
      <div class="grid">
        <div align="center" id="space-game"></div>
      </div>

      <div class="crt-panel" style="margin-top: 30px;">
        <h2>HOW TO PLAY</h2>
        <div style="font-size: 8px; color: var(--neon-cyan); line-height: 2;">
          <p>&#x25B6; USE ARROW KEYS TO MOVE YOUR SHIP.</p>
          <p>&#x25B6; PRESS SPACE TO SHOOT AND DESTROY ENEMIES .</p>
          <p>&#x25B6; PROTECT YOUR BASE (GREEN SQUARE) AT ALL COSTS.</p>
          <p>&#x25B6; DESTROY ALL ENEMIES TO WIN!</p>
          <p>&#x25B6; YOU HAVE 3 LIVES.</p>
        </div>
      </div>
    </div>
  `,
})
export class SpaceInvadersComponent {
  private phaserGame: any;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.phaserGame.destroy();
  }

  ngAfterViewInit(): void {
    this.phaserGame = new Phaser.Game(SpaceInvadersConfig.sceneConfig);
  }
}

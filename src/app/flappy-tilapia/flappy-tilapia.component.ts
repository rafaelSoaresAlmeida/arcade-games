import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FlappyTilapiaConfig } from './flappy-tilapia.config';

@Component({
  selector: "app-flappy-bird",
  template: `
    <div class="arcade-page">
      <h1
        class="glow"
        style="font-size: 20px; color: var(--neon-yellow); text-align:center; margin-bottom: 8px;"
      >
        FLAPPY BIRD
      </h1>
      <p
        style="font-size: 8px; color: var(--neon-pink); text-align:center; margin-bottom: 20px;"
      >
        TAP TO FLAP
      </p>
      <div
        class="grid"
        style="background-image: url(images/flappy/tilapia-back.jpg); background-size: 100%;"
      >
        <div align="center" id="flappy-game"></div>
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
export class FlappyTilapiaComponent implements AfterViewInit {
  private phaserGame: any;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.phaserGame.destroy();
  }

  ngAfterViewInit(): void {
    this.phaserGame = new Phaser.Game(FlappyTilapiaConfig.sceneConfig);
  }
}


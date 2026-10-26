import {
  Component,
  AfterViewInit,
} from '@angular/core';
import Phaser from 'phaser';
import { BattleCityConfig } from './battlecity.config';

@Component({
  selector: "app-battle-city",
  template: `
    <div class="arcade-page">
      <h1
        class="glow"
        style="font-size: 20px; color: var(--neon-pink); text-align:center; margin-bottom: 8px;"
      >
        BATTLE CITY
      </h1>
      <p
        style="font-size: 8px; color: var(--neon-yellow); text-align:center; margin-bottom: 20px;"
      >
        NINTENDO 1985 TRIBUTE
      </p>

      <div class="game-wrapper">
        <div class="hud">
          <div><span class="label">ARROWS:</span> MOVE</div>
          <div><span class="label">SPACE:</span> FIRE</div>
          <div><span class="label">R:</span> RESTART</div>
        </div>
        <div align="center" id="battlecity-game"></div>
      </div>

      <div class="crt-panel" style="margin-top: 30px;">
        <h2>HOW TO PLAY</h2>
        <div style="font-size: 8px; color: var(--neon-cyan); line-height: 2;">
          <p>&#x25B6; USE ARROW KEYS TO MOVE YOUR YELLOW TANK.</p>
          <p>&#x25B6; PRESS SPACE TO SHOOT AND DESTROY ENEMY TANKS.</p>
          <p>&#x25B6; PROTECT YOUR BASE (GREEN SQUARE) AT ALL COSTS.</p>
          <p>&#x25B6; BRICK WALLS CAN BE DESTROYED. STEEL WALLS CANNOT.</p>
          <p>&#x25B6; DESTROY ALL 8 ENEMY TANKS TO WIN!</p>
          <p>&#x25B6; YOU HAVE 3 LIVES. PRESS R TO RESTART.</p>
        </div>
      </div>
    </div>
  `,
})
export class BattleCityComponent implements AfterViewInit {

  private phaserGame: any;

  ngAfterViewInit() {
    this.phaserGame = new Phaser.Game(BattleCityConfig.sceneConfig);
  }

  ngOnDestroy() {
  this.phaserGame.destroy();
  }

}
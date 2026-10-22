import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="arcade-page">
      <h1 class="glow" style="font-size: 20px; color: var(--neon-pink); text-align:center; margin-bottom: 30px;">
        ABOUT ARCADE ZONE
      </h1>

      <div class="crt-panel">
        <h2>THE PROJECT</h2>
        <p style="font-size: 9px; color: var(--neon-cyan); line-height: 2;">
          ARCADE ZONE IS A SINGLE-PAGE APPLICATION BUILT WITH ANGULAR
          THAT CELEBRATES THE GOLDEN AGE OF VIDEOGAME ARCADES.
          EVERY PAGE IS DESIGNED TO RECREATE THE FEEL OF STANDING
          IN FRONT OF A GLOWING CRT MONITOR IN A SMOKEY ARCADE HALL,
          QUARTERS STACKED ON THE CABINET, READY FOR "ONE MORE CREDIT".
        </p>
      </div>

      <div class="crt-panel">
        <h2>THE GAMES</h2>
        <p style="font-size: 9px; color: var(--neon-cyan); line-height: 2; margin-bottom: 16px;">
          <span style="color: var(--neon-pink);">BATTLE CITY</span> &mdash; A TRIBUTE TO THE 1985
          NINTENDO CLASSIC. CONTROL A TANK, DEFEND YOUR HEADQUARTERS,
          AND BLAST THROUGH BRICK WALLS WHILE ENEMY TANKS HUNT YOU DOWN.
        </p>
        <p style="font-size: 9px; color: var(--neon-cyan); line-height: 2;">
          <span style="color: var(--neon-yellow);">PAC-MAN</span> &mdash; THE ICONIC MAZE CHASE.
          NAVOTIATE THE CORRIDORS, GOBBLE EVERY DOT, AND OUTRUN
          FOUR COLORFUL GHOSTS. GRAB A POWER PELLET AND TURN THE TABLES!
        </p>
      </div>

      <div class="crt-panel">
        <h2>THE TECH</h2>
        <div style="font-size: 9px; color: var(--neon-cyan); line-height: 2.2;">
          <div>&#x25B6; FRAMEWORK: ANGULAR 21</div>
          <div>&#x25B6; GAME ENGINE: PHASER 3</div>
          <div>&#x25B6; LANGUAGE: TYPESCRIPT</div>
          <div>&#x25B6; STYLING: CUSTOM ARCADE CSS</div>
          <div>&#x25B6; FONT: PRESS START 2P</div>
        </div>
      </div>

      <div class="crt-panel" style="text-align:center;">
        <h2 style="color: var(--neon-yellow);">CREDITS</h2>
        <p style="font-size: 8px; color: var(--neon-cyan); line-height: 2.2;">
          BATTLE CITY ORIGINALLY BY NAMCO (1985)<br>
          PAC-MAN ORIGINALLY BY NAMCO (1980)<br>
          <br>
          THIS PROJECT IS A FAN TRIBUTE FOR EDUCATIONAL PURPOSES.<br>
          ALL TRADEMARKS BELONG TO THEIR RESPECTIVE OWNERS.
        </p>
      </div>

      <div class="insert-coin blink">THANK YOU FOR PLAYING!</div>
    </div>
  `,
})
export class AboutComponent {}

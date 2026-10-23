import { Component } from '@angular/core';
import { SpaceInvadersConfig } from './space-invaders.config';

@Component({
  selector: "app-space-invaders",
  imports: [],
  templateUrl: "./space-invaders.html",
  styleUrl: "./space-invaders.css",
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

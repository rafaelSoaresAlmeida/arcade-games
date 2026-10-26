import * as Phaser from "phaser";
import { StateMachineEnemy } from "../entities/state-machine-enemy";

export class StateMachine {
  public static MOV_THRESHOLD_MAX = 4 * 60; // 60 fps
  public static MOV_THRESHOLD_MIN = 0;
  public static SHOOT_THRESHOLD_MAX = 4 * 60; // 60 fps
  public static SHOOT_THRESHOLD_MIN = 0;

  public static stateMachineEnemies: any[];

  public static register(key: string): void {
    if (this.stateMachineEnemies === undefined) {
      this.stateMachineEnemies = new Array(0);
    }

    const enemy = new StateMachineEnemy(key);
    enemy.movementCounter = 0;
    enemy.movementThreshold = this.nextFpsThreshold(
      this.MOV_THRESHOLD_MIN,
      this.MOV_THRESHOLD_MAX,
    );
    enemy.movementValue = Phaser.DOWN; // this.nextMovementValue();
    enemy.shootingCounter = 0;
    enemy.shootingThreshold = this.nextFpsThreshold(
      this.SHOOT_THRESHOLD_MIN,
      this.SHOOT_THRESHOLD_MAX,
    );

    this.stateMachineEnemies.push(enemy);
  }

  public static getMovement(key: string): any {
    const stateMachineEnemy = this.stateMachineEnemies.filter(
      (a) => a.key === key,
    )[0];
    if (stateMachineEnemy === undefined) {
      return null;
    }

    stateMachineEnemy.movementCounter += 1;
    if (
      stateMachineEnemy.movementCounter === stateMachineEnemy.movementThreshold
    ) {
      stateMachineEnemy.movementCounter = 0;
      stateMachineEnemy.movementThreshold = this.nextFpsThreshold(
        this.MOV_THRESHOLD_MIN,
        this.MOV_THRESHOLD_MAX,
      );
      stateMachineEnemy.movementValue = this.nextMovementValue();
    }

    return stateMachineEnemy.movementValue;
  }

  public static getShooting(key: string): any {
    const stateMachineEnemy = this.stateMachineEnemies.filter(
      (a) => a.key === key,
    )[0];
    if (stateMachineEnemy === undefined) {
      return null;
    }

    stateMachineEnemy.shootingCounter += 1;
    if (
      stateMachineEnemy.shootingCounter === stateMachineEnemy.shootingThreshold
    ) {
      stateMachineEnemy.shootingCounter = 0;
      stateMachineEnemy.shootingThreshold = this.nextFpsThreshold(
        this.SHOOT_THRESHOLD_MIN,
        this.SHOOT_THRESHOLD_MAX,
      );
      return true;
    }

    return false;
  }

  private static nextMovementValue(): number {
    return Phaser.Math.RND.integerInRange(5, 8);
  }

  private static nextFpsThreshold(
    thresholdMin: number,
    thresholdMax: number,
  ): number {
    return Phaser.Math.RND.integerInRange(thresholdMin, thresholdMax);
  }
}

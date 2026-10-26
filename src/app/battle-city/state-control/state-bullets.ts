import { StateControlBullet } from "../entities/state-control-bullet";

export class StateControlBullets {

  public static stateControlBullets: any[];

  public static register(name: string, key: number, direction: number): void {

    if (this.stateControlBullets === undefined) { this.stateControlBullets = new Array(0); }

    const bullet = new StateControlBullet(name, key, direction);
    this.stateControlBullets.push(bullet);
  }

  public static unregister(name: string, key: number): void {
    // TODO: desregistrar disparos !!!
    // this.stateControlBullets.
  }

  public static getDirection(bullet: Phaser.Physics.Arcade.Sprite): any {
    const stateControlBullet: StateControlBullet = this.getStateControlBullet(bullet);
    if (stateControlBullet === undefined) { return null; }

    return stateControlBullet.currentDirection;
  }

  public static isDirectionDown(bullet: Phaser.Physics.Arcade.Sprite): any {
    const stateControlBullet: StateControlBullet = this.getStateControlBullet(bullet);
    if (stateControlBullet === undefined) { return null; }

    return (stateControlBullet.currentDirection === Phaser.DOWN);
  }

  public static isDirectionLeft(bullet: Phaser.Physics.Arcade.Sprite): any {
    const stateControlBullet: StateControlBullet = this.getStateControlBullet(bullet);
    if (stateControlBullet === undefined) { return null; }

    return (stateControlBullet.currentDirection === Phaser.LEFT);
  }

  public static isDirectionRight(bullet: Phaser.Physics.Arcade.Sprite): any {
    const stateControlBullet: StateControlBullet = this.getStateControlBullet(bullet);
    if (stateControlBullet === undefined) { return null; }

    return (stateControlBullet.currentDirection === Phaser.RIGHT);
  }

  public static isDirectionUp(bullet: Phaser.Physics.Arcade.Sprite): any {
    const stateControlBullet: StateControlBullet = this.getStateControlBullet(bullet);
    if (stateControlBullet === undefined) { return null; }

    return (stateControlBullet.currentDirection === Phaser.UP);
  }

  private static getStateControlBullet(bullet: Phaser.Physics.Arcade.Sprite): StateControlBullet {
    const name: string = bullet.getData("name");
    const key: number = bullet.getData("key");
    return this.stateControlBullets.filter((a) => a.name === name && a.key === key)[0];
  }
}

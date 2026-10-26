export class StateControlEnemy {

  public key: string;

  public currentDirection!: number;
  public previousDirection!: number;

  constructor(key: string) {
    this.key = key;
  }

  public setNewDirection(direction: number) {
    this.previousDirection = this.currentDirection;
    this.currentDirection = direction;
  }
}

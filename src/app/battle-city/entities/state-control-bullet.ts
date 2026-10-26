export class StateControlBullet {

  public name: string;
  public key: number;
  public currentDirection: number;

  constructor(name: string, key: number, direction: number) {
    this.name = name;
    this.key = key;
    this.currentDirection = direction;
  }
}

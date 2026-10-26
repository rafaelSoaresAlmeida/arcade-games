export class StateMachineEnemy {

  public key: string;

  public movementCounter!: number;
  public movementThreshold!: number;
  public movementValue!: number;

  public shootingCounter!: number;
  public shootingThreshold!: number;

  constructor(key: string) {
    this.key = key;
  }
}

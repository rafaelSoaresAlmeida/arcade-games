export class GameProgress {

    public POINTS_REGULAR_ENEMY: number = 100;
    public POINTS_SPEEDY_ENEMY: number = 200;
    public POINTS_SHOOTER_ENEMY: number = 300;
    public POINTS_HEAVY_ENEMY: number = 400;
    public MAX_STAGE: number = 3;

    public stageNumber!: number;

    public playerOneLives!: number;
    public playerOneTotalPoints!: number;
    public playerOneStageCount!: number;
    public playerOneStagePoints!: number;
    public playerOneRegularsCount!: number;
    public playerOneRegularsPoints!: number;
    public playerOneSpeediesCount!: number;
    public playerOneSpeediesPoints!: number;
    public playerOneShootersCount!: number;
    public playerOneShootersPoints!: number;
    public playerOneHeaviesCount!: number;
    public playerOneHeaviesPoints!: number;

    public playerTwoLives!: number;
    public playerTwoTotalPoints!: number;
    public playerTwoStageCount!: number;
    public playerTwoStagePoints!: number;
    public playerTwoRegularsCount!: number;
    public playerTwoRegularsPoints!: number;
    public playerTwoSpeediesCount!: number;
    public playerTwoSpeediesPoints!: number;
    public playerTwoShootersCount!: number;
    public playerTwoShootersPoints!: number;
    public playerTwoHeaviesCount!: number;
    public playerTwoHeaviesPoints!: number;

    public resetGameProgress(): void {
        this.resetPlayerOne();
        this.resetPlayerTwo();
        this.resetStageProgress();
        this.resetStageStats();
    }

    public resetPlayerOne(): void {
        this.playerOneLives = 2;
        this.playerOneTotalPoints = 0;
    }

    public resetPlayerTwo(): void {
        this.playerTwoLives = 2;
        this.playerOneTotalPoints = 0;
    }

    public resetStageProgress(): void {
        this.stageNumber = 0;
    }

    public resetStageStats(): void {
        this.playerOneRegularsCount = 0;
        this.playerOneRegularsPoints = 0;
        this.playerOneSpeediesCount = 0;
        this.playerOneSpeediesPoints = 0;
        this.playerOneShootersCount = 0;
        this.playerOneShootersPoints = 0;
        this.playerOneHeaviesCount = 0;
        this.playerOneHeaviesPoints = 0;
        this.playerOneStageCount = 0;
        this.playerOneStagePoints = 0;

        this.playerTwoRegularsCount = 0;
        this.playerTwoRegularsPoints = 0;
        this.playerTwoSpeediesCount = 0;
        this.playerTwoSpeediesPoints = 0;
        this.playerTwoShootersCount = 0;
        this.playerTwoShootersPoints = 0;
        this.playerTwoHeaviesCount = 0;
        this.playerTwoHeaviesPoints = 0;
        this.playerTwoStageCount = 0;
        this.playerTwoStagePoints = 0;
    }

    public buildStageName(stageNumber: number): string {
        return (stageNumber < 10) ? "0" + stageNumber.toString() : stageNumber.toString();
    }

    public getStageName(): string {
        return this.buildStageName(this.stageNumber);
    }

    public nextStage(): void {
        this.stageNumber += 1;
    }

    public calculateStageStats(): void {

        this.playerOneRegularsPoints = this.playerOneRegularsCount * this.POINTS_REGULAR_ENEMY;
        this.playerOneSpeediesPoints = this.playerOneSpeediesCount * this.POINTS_SPEEDY_ENEMY;
        this.playerOneShootersPoints = this.playerOneShootersCount * this.POINTS_SHOOTER_ENEMY;
        this.playerOneHeaviesPoints = this.playerOneHeaviesCount * this.POINTS_HEAVY_ENEMY;

        this.playerOneStageCount = this.playerOneRegularsCount + this.playerOneSpeediesCount + this.playerOneShootersCount + this.playerOneHeaviesCount;
        this.playerOneStagePoints = this.playerOneRegularsPoints + this.playerOneSpeediesPoints + this.playerOneShootersPoints + this.playerOneHeaviesPoints;
        this.playerOneTotalPoints += this.playerOneStagePoints;

        this.playerTwoRegularsPoints = this.playerTwoRegularsCount * this.POINTS_REGULAR_ENEMY;
        this.playerTwoSpeediesPoints = this.playerTwoSpeediesCount * this.POINTS_SPEEDY_ENEMY;
        this.playerTwoShootersPoints = this.playerTwoShootersCount * this.POINTS_SHOOTER_ENEMY;
        this.playerTwoHeaviesPoints = this.playerTwoHeaviesCount * this.POINTS_HEAVY_ENEMY;

        this.playerTwoStageCount = this.playerTwoRegularsCount + this.playerTwoSpeediesCount + this.playerTwoShootersCount + this.playerTwoHeaviesCount;
        this.playerTwoStagePoints = this.playerTwoRegularsPoints + this.playerTwoSpeediesPoints + this.playerTwoShootersPoints + this.playerTwoHeaviesPoints;
        this.playerTwoTotalPoints += this.playerTwoStagePoints;
    }

}

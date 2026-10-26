import { StateControlEnemies } from "../state-control/state-enemies";
import { StateMachine } from "./state-machine";

export class ScriptManager {

  public static parse(scene: Phaser.Scene, enemies: Phaser.Physics.Arcade.Group, dataJSON: any, callback?: (args: any) => void, callbackContext?: any) {

    const JSON_KEY_ENEMIES: string = "enemies";
    const JSON_KEY_NAME: string = "name";
    const JSON_KEY_TYPE: string = "type";
    const JSON_KEY_SPAWN: string = "spawn";
    const JSON_KEY_DELAY: string = "delay";
    const SPAWN_Y = 72;

    let posX: number = 0;
    let posY: number = 0;
    let spriteKey: string = "";

    this.spawnPointLeft = scene.add.sprite(this.getPosX("left"), SPAWN_Y, "game-spawn-point");
    this.spawnPointCenter = scene.add.sprite(this.getPosX("center"), SPAWN_Y, "game-spawn-point");
    this.spawnPointRight = scene.add.sprite(this.getPosX("right"), SPAWN_Y, "game-spawn-point");

    console.log("ScriptManager.parse: " + JSON.stringify(dataJSON));


    const enemiesJSON = dataJSON[JSON_KEY_ENEMIES];

    enemiesJSON.forEach((element: any) => {
      scene.time.delayedCall(element[JSON_KEY_DELAY], () => {

        const spawnPoint = this.selectSpawnPoint(element[JSON_KEY_SPAWN]);
        spawnPoint.setAlpha(0.8);
        spawnPoint.setVisible(true);
        spawnPoint.setDepth(1);
        spawnPoint.anims.play("game-anim-spawn-point-blink", true);

        scene.time.delayedCall(900, () => {

          posX = this.getPosX(element[JSON_KEY_SPAWN]);
          posY = SPAWN_Y;
          spriteKey = this.getSpriteKey(element[JSON_KEY_TYPE]);

          const enemy: Phaser.Physics.Arcade.Sprite = enemies.create(posX, posY, spriteKey, 4);
          enemy.setData("name", element[JSON_KEY_NAME]);
          enemy.setData("stop", false);
          enemy.setData("type", element[JSON_KEY_TYPE]);
          enemy.setBounce(0, 0);
          enemy.setCollideWorldBounds(true);
          enemy.setImmovable(false);
          enemy.setPushable(false);
          enemy.setBodySize(48, 48);

          StateMachine.register(element[JSON_KEY_NAME]);
          StateControlEnemies.register(element[JSON_KEY_NAME]);

          if (callback !== undefined) { callback(callbackContext); }
        });
      });
    });
  }

  private static spawnPointLeft: Phaser.GameObjects.Sprite;
  private static spawnPointCenter: Phaser.GameObjects.Sprite;
  private static spawnPointRight: Phaser.GameObjects.Sprite;

  private static selectSpawnPoint(spawn: string): any {

    spawn = spawn.toLowerCase();
    if (spawn === "left") { return this.spawnPointLeft; }
    if (spawn === "center") { return this.spawnPointCenter; }

    if (spawn === "right") { return this.spawnPointRight; }
  }

  private static getPosX(spawn: string): any {

    const SPAWN_X_LEFT = 72;
    const SPAWN_X_CENTER = 360;
    const SPAWN_X_RIGHT = 648;

    spawn = spawn.toLowerCase();
    if (spawn === "left") { return SPAWN_X_LEFT; }
    if (spawn === "center") { return SPAWN_X_CENTER; }
    if (spawn === "right") { return SPAWN_X_RIGHT; }
  }

  private static getSpriteKey(type: string): any {

    const SPRITE_KEY_REGULAR: string = "game-enemy-regular";
    const SPRITE_KEY_SPEEDY: string = "game-enemy-speedy";
    const SPRITE_KEY_SHOOTER: string = "game-enemy-shooter";
    const SPRITE_KEY_HEAVY: string = "game-enemy-heavy";

    type = type.toLowerCase();
    if (type === "regular") { return SPRITE_KEY_REGULAR; }
    if (type === "speedy") { return SPRITE_KEY_SPEEDY; }
    if (type === "shooter") { return SPRITE_KEY_SHOOTER; }
    if (type === "heavy") { return SPRITE_KEY_HEAVY; }
  }
}

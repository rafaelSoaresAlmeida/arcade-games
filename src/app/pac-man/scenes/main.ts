import * as Phaser from "phaser";
import { inject } from "@angular/core";
import { MapService } from "../map/map.service";

export class MainScene extends Phaser.Scene {
  // this.Pacman =null;
  direction: string | null = null;
  previousDirection: string | null = "left";
  blockSize = 16;
  board: number[][] = [];
  speed = 140;
  intersections: { x: number; y: number; openPaths: any }[] = [];
  nextIntersection: { x: number; y: number; openPaths: any } | null = null;
  pacman: Phaser.Physics.Arcade.Sprite | null = null;
  tileset: Phaser.Tilemaps.Tileset | null = null;
  dots: Phaser.Physics.Arcade.Group | null = null;
  map: Phaser.Tilemaps.Tilemap | null = null;
  layer: Phaser.Tilemaps.TilemapLayer | null = null;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  constructor(private mapService: MapService) {
    super();
    this.mapService = new MapService();
  }

  preload() {
    this.load.setBaseURL("  images/pac-man/");
    this.load.image("pacman tileset", "tileset_2.png");
    this.load.tilemapTiledJSON("map", "pacman-map_2.json");

    this.loadPacmanSprite("pacman", "characters/pac_man/pac_man_0.png");
    this.loadPacmanSprite("pacman1", "characters/pac_man/pac_man_1.png");
    this.loadPacmanSprite("pacman2", "characters/pac_man/pac_man_2.png");
    this.loadPacmanSprite("pacman3", "characters/pac_man/pac_man_3.png");
    this.loadPacmanSprite("pacman4", "characters/pac_man/pac_man_4.png");

    this.load.image("dot", "dot.png");
  }

  create() {
    this.map = this.mapService.createMap(this.make);
    this.tileset = this.map!.addTilesetImage("pacman tileset");
    this.layer = this.mapService.createLayer(this.map, this.tileset);
    this.pacman = this.createPacman();
    this.physics.add.collider(this.pacman, this.layer!);

    this.dots = this.physics.add.group();

    this.physics.add.overlap(
      this.pacman,
      this.dots,
      this.eatDot,
      undefined,
      this,
    );

    this.mapService.populateBoardAndTrackEmptyTiles(
      this.layer!,
      this.board,
      this.map,
      this.dots,
    );

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.detectIntersections();
  }

  override update(time: number, delta: number): void {
    this.handleDirectionInput();
    this.handlePacmanMovement();
    this.teleportPacmanAcrossWorldBounds();
  }

  private loadPacmanSprite(sprite: string, path: string) {
    this.load.spritesheet(sprite, path, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  private handleDirectionInput() {
    const arrowKeys: (keyof Phaser.Types.Input.Keyboard.CursorKeys)[] = [
      "left",
      "right",
      "up",
      "down",
    ];

    for (const key of arrowKeys) {
      if (this.cursors![key].isDown && this.direction !== key) {
        this.previousDirection = this.direction;
        this.direction = key;
        this.nextIntersection =
          this.mapService.getNextIntersectionInNextDirection(
            this.intersections,
            this.pacman!.x,
            this.pacman!.y,
            this.previousDirection,
            key,
          );
        break;
      }
    }
  }

  private createPacman() {
    let pac = this.physics.add.sprite(230, 432, "pacman");

    this.anims.create({
      key: "pacmanAnim",
      frames: [
        { key: "pacman" },
        { key: "pacman1" },
        { key: "pacman2" },
        { key: "pacman3" },
        { key: "pacman4" },
      ],
      frameRate: 10,
      repeat: -1,
    });
    pac.play("pacmanAnim");

    return pac;
  }

  private eatDot(pacman: any, dot: any) {
    dot.disableBody(true, true);
  }

  ////////////////// part 2
  public detectIntersections() {
    const directions = [
      { x: -this.blockSize, y: 0, name: "left" },
      { x: this.blockSize, y: 0, name: "right" },
      { x: 0, y: -this.blockSize, name: "up" },
      { x: 0, y: this.blockSize, name: "down" },
    ];
    const blockSize = this.blockSize;
    for (let y = 0; y < this.map!.heightInPixels; y += blockSize) {
      for (let x = 0; x < this.map!.widthInPixels; x += blockSize) {
        if (x % blockSize !== 0 || y % blockSize !== 0) continue;
        if (!this.mapService.isPointClear(this.board, this.blockSize, x, y))
          continue;
        let openPaths: string[] = [];
        directions.forEach((dir) => {
          if (
            this.mapService.isPathOpenAroundPoint(
              this.board,
              this.blockSize,
              x + dir.x,
              y + dir.y,
            )
          ) {
            openPaths.push(dir.name);
          }
        });
        if (openPaths.length > 2 && y > 64 && y < 530) {
          this.intersections.push({ x: x, y: y, openPaths: openPaths });
        } else if (openPaths.length === 2 && y > 64 && y < 530) {
          const [dir1, dir2] = openPaths;
          if (
            ((dir1 === "left" || dir1 === "right") &&
              (dir2 === "up" || dir2 === "down")) ||
            ((dir1 === "up" || dir1 === "down") &&
              (dir2 === "left" || dir2 === "right"))
          ) {
            this.intersections.push({ x: x, y: y, openPaths: openPaths });
          }
        }
      }
    }
  }

  public handlePacmanMovement() {
    let nextIntersectionx = null;
    let nextIntersectiony = null;
    if (this.nextIntersection) {
      nextIntersectionx = this.nextIntersection.x;
      nextIntersectiony = this.nextIntersection.y;
    }

    switch (this.direction) {
      case "left":
        this.mapService.handleMovementInDirection(
          this.pacman,
          this.blockSize,
          this.nextIntersection,
          this.previousDirection,
          "left",
          "right",
          this.pacman!.y,
          nextIntersectiony,
          this.pacman!.x,
          true,
          false,
          0,
          -this.speed,
          0,
          this.pacman!.body!.velocity.y,
        );
        break;
      case "right":
        this.mapService.handleMovementInDirection(
          this.pacman,
          this.blockSize,
          this.nextIntersection,
          this.previousDirection,
          "right",
          "left",
          this.pacman!.y,
          nextIntersectiony,
          this.pacman!.x,
          true,
          false,
          180,
          this.speed,
          0,
          this.pacman!.body!.velocity.y,
        );
        break;
      case "up":
        this.mapService.handleMovementInDirection(
          this.pacman,
          this.blockSize,
          this.nextIntersection,
          this.previousDirection,
          "up",
          "down",
          this.pacman!.x,
          nextIntersectionx,
          this.pacman!.y,
          false,
          true,
          -90,
          0,
          -this.speed,
          this.pacman!.body!.velocity.x,
        );
        break;
      case "down":
        this.mapService.handleMovementInDirection(
          this.pacman,
          this.blockSize,
          this.nextIntersection,
          this.previousDirection,
          "down",
          "up",
          this.pacman!.x,
          nextIntersectionx,
          this.pacman!.y,
          false,
          true,
          90,
          0,
          this.speed,
          this.pacman!.body!.velocity.x,
        );
        break;
    }
  }

  public teleportPacmanAcrossWorldBounds(): void {
    const worldBounds = this.physics.world.bounds;
    if (this.pacman!.x <= worldBounds.x) {
      this.pacman!.body!.reset(
        worldBounds.right - this.blockSize,
        this.pacman!.y,
      );
      this.nextIntersection =
        this.mapService.getNextIntersectionInNextDirection(
          this.intersections,
          this.pacman!.x,
          this.pacman!.y,
          "left",
          this.direction,
        );
      this.pacman!.setVelocityX(-1 * this.speed);
    }
    if (this.pacman!.x >= worldBounds.right) {
      this.pacman!.body!.reset(worldBounds.x + this.blockSize, this.pacman!.y);
      this.nextIntersection =
        this.mapService.getNextIntersectionInNextDirection(
          this.intersections,
          this.pacman!.x,
          this.pacman!.y,
          "right",
          this.direction,
        );
      this.pacman!.setVelocityX(this.speed);
    }
  }

  /*********************** */
}

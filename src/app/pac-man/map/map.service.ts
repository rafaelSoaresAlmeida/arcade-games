import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {}

  public createMap(make: any) {
    return make.tilemap({ key: 'map' });
  }

  public createLayer(map: any, tileset: any) {
    if (!tileset || !map) {
      throw new Error('Error create layer');
    }

    let layer;
    if (tileset) {
      layer = map.createLayer('Tile Layer 1', [tileset]);
    }
    if (layer) {
      layer.setCollisionByExclusion([-1], true);
    }

    return layer;
  }

  public populateBoardAndTrackEmptyTiles(
    layer: Phaser.Tilemaps.TilemapLayer,
    board: any,
    map: any,
    dots: any
  ) {
    if (!layer || !board || !map || !dots) {
      throw new Error('Error populate board');
    }

    layer.forEachTile((tile) => {
      if (!board[tile.y]) {
        board[tile.y] = [];
      }
      board[tile.y][tile.x] = tile.index;
      if (
        tile.y < 4 ||
        (tile.y > 11 && tile.y < 23 && tile.x > 6 && tile.x < 21) ||
        (tile.y === 17 && tile.x !== 6 && tile.x !== 21)
      )
        return;
      if (map) {
        let rightTile = map.getTileAt(tile.x + 1, tile.y, true, 'Tile Layer 1');
        let bottomTile = map.getTileAt(
          tile.x,
          tile.y + 1,
          true,
          'Tile Layer 1'
        );
        let rightBottomTile = map.getTileAt(
          tile.x + 1,
          tile.y + 1,
          true,
          'Tile Layer 1'
        );
        if (
          tile.index === -1 &&
          rightTile &&
          rightTile.index === -1 &&
          bottomTile &&
          bottomTile.index === -1 &&
          rightBottomTile &&
          rightBottomTile.index === -1
        ) {
          const x = tile.x * tile.width;
          const y = tile.y * tile.height;
          if (dots) {
            dots.create(x + tile.width, y + tile.height, 'dot');
          }
        }
      }
    });
  }

  public isPathOpenAroundPoint(
    board: any,
    blockSize: any,
    pixelX: any,
    pixelY: any
  ): boolean {
    const corners = [
      { x: pixelX - 1, y: pixelY - 1 },
      { x: pixelX + 1, y: pixelY - 1 },
      { x: pixelX - 1, y: pixelY + 1 },
      { x: pixelX + 1, y: pixelY + 1 },
    ];
    return corners.every((corner) => {
      const tileX = Math.floor(corner.x / blockSize);
      const tileY = Math.floor(corner.y / blockSize);
      if (!board[tileY] || board[tileY][tileX] !== -1) {
        return false;
      }
      return true;
    });
  }

  public isPointClear(board: any, blockSize: any, x: any, y: any): boolean {
    const corners = [
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];
    return corners.every((corner) => {
      const tileX = Math.floor(corner.x / blockSize);
      const tileY = Math.floor(corner.y / blockSize);

      return !board[tileY] || board[tileY][tileX] === -1;
    });
  }

  public getNextIntersectionInNextDirection(
    intersections: any[],
    currentX: any,
    currentY: any,
    currentDirection: any,
    nextDirection: any
  ): any {
    let filteredIntersections;
    const isUp = currentDirection === 'up';
    const isDown = currentDirection === 'down';
    const isLeft = currentDirection === 'left';
    const isRight = currentDirection === 'right';
    filteredIntersections = intersections
      .filter((intersection) => {
        return (
          ((isUp &&
            intersection.x === currentX &&
            intersection.y <= currentY) ||
            (isDown &&
              intersection.x === currentX &&
              intersection.y >= currentY) ||
            (isLeft &&
              intersection.y === currentY &&
              intersection.x <= currentX) ||
            (isRight &&
              intersection.y === currentY &&
              intersection.x >= currentX)) &&
          this.isIntersectionInDirection(intersection, nextDirection)
        );
      })
      .sort((a, b) => {
        if (isUp || isDown) {
          return isUp ? b.y - a.y : a.y - b.y;
        } else {
          return isLeft ? b.x - a.x : a.x - b.x;
        }
      });
    return filteredIntersections ? filteredIntersections[0] : null;
  }

  public isIntersectionInDirection(intersection: any, direction: any): boolean {
    console.log('openPaths ' + intersection.openPaths);
    switch (direction) {
      case 'up':
        return intersection.openPaths.includes('up');
      case 'down':
        return intersection.openPaths.includes('down');
      case 'left':
        return intersection.openPaths.includes('left');
      case 'right':
        return intersection.openPaths.includes('right');
      default:
        return false;
    }
  }

  public handleMovementInDirection(
    pacman: any,
    blockSize: any,
    nextIntersection: any,
    previousDirection: any,
    currentDirection: any,
    oppositeDirection: any,
    pacmanPosition: any,
    intersectionPosition: any,
    movingCoordinate: any,
    flipX: any,
    flipY: any,
    angle: any,
    velocityX: any,
    velocityY: any,
    currentVelocity: any
  ): void {
    let perpendicularDirection =
      currentDirection === 'left' || currentDirection === 'right'
        ? ['up', 'down']
        : ['left', 'right'];
    let condition = false;
    if (nextIntersection)
      condition =
        (previousDirection == perpendicularDirection[0] &&
          pacmanPosition <= intersectionPosition) ||
        (previousDirection == perpendicularDirection[1] &&
          pacmanPosition >= intersectionPosition) ||
        previousDirection === oppositeDirection;
    if (condition) {
      let newPosition = intersectionPosition;
      if (
        previousDirection != oppositeDirection &&
        newPosition !== pacmanPosition
      ) {
        if (currentDirection === 'left' || currentDirection === 'right')
          pacman!.body!.reset(movingCoordinate, newPosition);
        else pacman!.body!.reset(newPosition, movingCoordinate);
      }
      this.changeDirection(pacman, flipX, flipY, angle, velocityX, velocityY);
      this.adjustPacmanPosition(pacman, blockSize, velocityX, velocityY);
    } else if (currentVelocity === 0) {
      this.changeDirection(pacman, flipX, flipY, angle, velocityX, velocityY);
      this.adjustPacmanPosition(pacman, blockSize, velocityX, velocityY);
    }
  }

  public adjustPacmanPosition(
    pacman: any,
    blockSize: any,
    velocityX: any,
    velocityY: any
  ): void {
    if (pacman!.x % blockSize !== 0 && velocityY > 0) {
      let nearestMultiple = Math.round(pacman!.x / blockSize) * blockSize;
      pacman!.body!.reset(nearestMultiple, pacman!.y);
    }
    if (pacman!.y % blockSize !== 0 && velocityX > 0) {
      let nearestMultiple = Math.round(pacman!.y / blockSize) * blockSize;
      pacman!.body!.reset(pacman!.x, nearestMultiple);
    }
  }

  public changeDirection(
    pacman: any,
    flipX: any,
    flipY: any,
    angle: any,
    velocityX: any,
    velocityY: any
  ): void {
    pacman!.setFlipX(flipX);
    pacman!.setFlipY(flipY);
    pacman!.setAngle(angle);
    pacman!.setVelocityY(velocityY);
    pacman!.setVelocityX(velocityX);
  }
}

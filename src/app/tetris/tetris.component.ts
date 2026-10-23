import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import Phaser from 'phaser';
import { IPiece, Piece } from './piece.component';
import { BLOCK_SIZE, COLORS, COLUMNS, KEY, LEVEL, LINES_PER_LEVEL, POINTS, ROWS } from './constants';
import { isPlatformBrowser } from '@angular/common';
import { TetrisService } from './tetris.service';
import { Score } from '../model/score.model';

@Component({
  selector: "app-tetris",
  template: `
    <div class="arcade-page">
      <h1
        class="glow"
        style="font-size: 20px; color: var(--neon-cyan); text-align:center; margin-bottom: 8px;"
      >
        TETRIS
      </h1>
      <p
        style="font-size: 8px; color: var(--neon-yellow); text-align:center; margin-bottom: 20px;"
      >
        CLASSIC BLOCK PUZZLE
      </p>

      <div class="grid" style="background-size: 100%">
        <canvas #tetrisBoard class="game-board"></canvas>
        <div class="right-column">
          <div>
            <h1 style="color: red">TETRIS</h1>
            <p style="color: red">Score: {{ points }}</p>
            <p style="color: red">Lines: {{ lines }}</p>
            <p style="color: red">Level: {{ level }}</p>
            <p style="color: red">High Score:</p>
            <!-- <p>{{ highScore }}</p> -->
            <p style="color: red">Next Block:</p>
            <canvas #next class="next"></canvas>
          </div>
          <button (click)="play()" class="play-button">Play</button>
        </div>
      </div>

      <div class="crt-panel" style="margin-top: 30px;">
        <h2>HOW TO PLAY</h2>
        <div style="font-size: 8px; color: var(--neon-cyan); line-height: 2;">
          <p>&#x25B6; LEFT/RIGHT: MOVE PIECE HORIZONTALLY.</p>
          <p>&#x25B6; UP: ROTATE PIECE.</p>
          <p>&#x25B6; DOWN: ACCELERATE DROP.</p>
          <p>&#x25B6; FILL A FULL ROW TO CLEAR IT.</p>
          <p>&#x25B6; CLEAR MULTIPLE ROWS FOR BONUS POINTS.</p>
          <p>&#x25B6; DON'T LET THE STACK REACH THE TOP!</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      * {
        font-family: "Press Start 2P", cursive;
      }

      .grid {
        display: grid;
        grid-template-columns: 320px 200px;
        justify-content: center;
        align-items: center;
        color: red;
      }

      .right-column {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .game-board {
        border: solid 2px;
      }

      .play-button {
        background-color: #4caf50;
        font-size: 16px;
        padding: 15px 30px;
        cursor: pointer;
      }
    `,
  ],
})
export class TetrisComponent implements OnInit {
  @ViewChild("gameContainer") gameContainer!: ElementRef;
  private game!: Phaser.Game;

  @ViewChild("tetrisBoard", { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("next", { static: true })
  canvasNext!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  ctxNext!: CanvasRenderingContext2D;
  board!: number[][];
  piece!: Piece;
  next!: Piece;
  requestId!: number;
  time!: { start: number; elapsed: number; level: number };
  points!: number;
  lines!: number;
  level!: number;
  score!: Score;

  moves: { [key: number]: (p: IPiece) => IPiece } = {
    [KEY.LEFT]: (p: IPiece): IPiece => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p: IPiece): IPiece => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p: IPiece): IPiece => this.service.rotate(p),
  };
  isBrowser: any;

  @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY.ESC) {
      this.gameOver();
    } else if (this.moves[event.keyCode]) {
      event.preventDefault();
      // Get new state
      let p = this.moves[event.keyCode](this.piece);
      if (event.keyCode === KEY.SPACE) {
        // Hard drop
        while (this.service.valid(p, this.board)) {
          this.points += POINTS.HARD_DROP;
          this.piece.move(p);
          p = this.moves[KEY.DOWN](this.piece);
        }
      } else if (this.service.valid(p, this.board)) {
        this.piece.move(p);
        if (event.keyCode === KEY.DOWN) {
          //   this.points += POINTS.SOFT_DROP;
        }
      }
    }
  }

  constructor(
    private service: TetrisService,
    @Inject(PLATFORM_ID) private platformId: Object, // private rankService: RankService, // private loginService: LoginService, // private notificationService: NotificationService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.initBoard();
    this.initNext();
    this.resetGame();
  }

  initBoard() {
    if (this.isBrowser) {
      const ctx = this.canvas.nativeElement.getContext("2d");

      if (ctx) {
        this.ctx = ctx;
      } else {
        throw new Error("Failed to get 2D context");
      }

      // Calculate size of canvas from constants.
      this.ctx.canvas.width = COLUMNS * BLOCK_SIZE;
      this.ctx.canvas.height = ROWS * BLOCK_SIZE;

      // Scale so we don't need to give size on every draw.
      this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  initNext() {
    if (this.isBrowser) {
      const ctxNext = this.canvasNext.nativeElement.getContext("2d");
      if (ctxNext) {
        this.ctxNext = ctxNext;
      } else {
        throw new Error("Failed to get 2D context");
      }

      // Calculate size of canvas from constants.
      this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
      this.ctxNext.canvas.height = 4 * BLOCK_SIZE;

      this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  play() {
    this.resetGame();
    this.next = new Piece(this.ctx);
    this.piece = new Piece(this.ctx);
    this.next.drawNext(this.ctxNext);
    this.time.start = performance.now();

    // If we have an old game running a game then cancel the old
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

    this.animate();
  }

  resetGame() {
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.board = this.getEmptyBoard();
    this.time = { start: 0, elapsed: 0, level: LEVEL[this.level] };
  }

  animate(now = 0) {
    this.time.elapsed = now - this.time.start;
    if (this.time.elapsed > this.time.level) {
      this.time.start = now;
      if (!this.drop()) {
        this.gameOver();
        return;
      }
    }
    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.piece.draw();
    this.drawBoard();
  }

  drop(): boolean {
    let p = this.moves[KEY.DOWN](this.piece);
    if (this.service.valid(p, this.board)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      this.piece = this.next;
      this.next = new Piece(this.ctx);
      this.next.drawNext(this.ctxNext);
    }
    return true;
  }

  clearLines() {
    let lines = 0;
    this.board.forEach((row, y) => {
      if (row.every((value) => value !== 0)) {
        lines++;
        this.board.splice(y, 1);
        this.board.unshift(Array(COLUMNS).fill(0));
      }
    });
    if (lines > 0) {
      this.points += this.service.getLinesClearedPoints(lines, this.level);
      this.lines += lines;
      if (this.lines >= LINES_PER_LEVEL) {
        this.level++;
        this.lines -= LINES_PER_LEVEL;
        this.time.level = LEVEL[this.level];
      }
    }
  }

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.board[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  drawBoard() {
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  gameOver() {
    cancelAnimationFrame(this.requestId);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = "1px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.fillText("GAME OVER", 1.8, 4);
    /*     this.score = buildScoreObject(
      this.loginService.user.name,
      this.loginService.user.email,
      this.lines.toString(),
      Games.TETRIS
    ); */
    /*   this.rankService
      .persistScore(this.score)
      .subscribe((response) =>
        this.notificationService.notifyRanking(response)
      ); */
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
  }
}

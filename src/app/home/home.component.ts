import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { supabase, HighScore } from '../supabase.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="arcade-page">
      <div style="text-align:center; padding: 40px 0;">
        <h1 class="glow" style="font-size: 28px; color: var(--neon-pink); margin-bottom: 8px;">
          ARCADE ZONE
        </h1>
        <h2 class="blink" style="font-size: 14px; color: var(--neon-yellow); margin-bottom: 30px;">
          90s RETRO GAMING
        </h2>
        <p style="font-size: 10px; color: var(--neon-cyan); line-height: 2; max-width: 600px; margin: 0 auto 30px;">
          WELCOME TO THE ULTIMATE RETRO ARCADE EXPERIENCE.
          STEP INTO THE WORLD OF 16-BIT GRAPHICS,
          CHIPTUNE MUSIC, AND PIXEL-PERFECT GAMEPLAY.
          SELECT YOUR GAME AND PRESS START!
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin: 30px 0;">
        <a routerLink="/battle-city" class="crt-panel game-card" style="display:block; text-align:center;">
          <div style="font-size: 32px; margin-bottom: 8px;">&#x1F3D7;</div>
          <h2 style="color: var(--neon-pink); font-size: 12px;">BATTLE CITY</h2>
          <p style="font-size: 7px; color: var(--neon-cyan); margin-top: 8px; line-height: 1.6;">
            DEFEND YOUR BASE
          </p>
        </a>
        <a routerLink="/pac-man" class="crt-panel game-card" style="display:block; text-align:center;">
          <div style="font-size: 32px; margin-bottom: 8px;">&#x1F47B;</div>
          <h2 style="color: var(--neon-yellow); font-size: 12px;">PAC-MAN</h2>
          <p style="font-size: 7px; color: var(--neon-cyan); margin-top: 8px; line-height: 1.6;">
            EAT ALL THE DOTS
          </p>
        </a>
        <a routerLink="/tetris" class="crt-panel game-card" style="display:block; text-align:center;">
          <div style="font-size: 32px; margin-bottom: 8px;">&#x1F9E9;</div>
          <h2 style="color: var(--neon-cyan); font-size: 12px;">TETRIS</h2>
          <p style="font-size: 7px; color: var(--neon-cyan); margin-top: 8px; line-height: 1.6;">
            CLEAR THE LINES
          </p>
        </a>
        <a routerLink="/dino" class="crt-panel game-card" style="display:block; text-align:center;">
          <div style="font-size: 32px; margin-bottom: 8px;">&#x1F996;</div>
          <h2 style="color: var(--neon-green); font-size: 12px;">DINO RUN</h2>
          <p style="font-size: 7px; color: var(--neon-cyan); margin-top: 8px; line-height: 1.6;">
            JUMP AND SURVIVE
          </p>
        </a>
        <a routerLink="/flappy-bird" class="crt-panel game-card" style="display:block; text-align:center;">
          <div style="font-size: 32px; margin-bottom: 8px;">&#x1F426;</div>
          <h2 style="color: var(--neon-yellow); font-size: 12px;">FLAPPY BIRD</h2>
          <p style="font-size: 7px; color: var(--neon-cyan); margin-top: 8px; line-height: 1.6;">
            TAP TO FLAP
          </p>
        </a>
        <a routerLink="/about" class="crt-panel game-card" style="display:block; text-align:center;">
          <div style="font-size: 32px; margin-bottom: 8px;">&#x1F4BB;</div>
          <h2 style="color: var(--neon-green); font-size: 12px;">ABOUT</h2>
          <p style="font-size: 7px; color: var(--neon-cyan); margin-top: 8px; line-height: 1.6;">
            LEARN MORE
          </p>
        </a>
      </div>

      <div class="crt-panel">
        <h2 style="color: var(--neon-green); text-align:center;">&#x1F3C6; TOP PLAYERS</h2>

        @if (loading()) {
          <div style="text-align:center; font-size:10px; color: var(--neon-yellow); padding: 20px;">
            LOADING SCORES...
          </div>
        } @else if (scores().length === 0) {
          <div style="text-align:center; font-size:10px; color: var(--neon-cyan); padding: 20px;">
            NO SCORES YET. BE THE FIRST!
          </div>
        } @else {
          <table class="scores-table">
            <thead>
              <tr>
                <th>#</th>
                <th>PLAYER</th>
                <th>GAME</th>
                <th>SCORE</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              @for (s of scores(); track s.id) {
                <tr>
                  <td class="rank">{{ $index + 1 }}</td>
                  <td>{{ s.player_name }}</td>
                  <td class="game-cell">{{ s.game }}</td>
                  <td class="score-cell">{{ s.score.toLocaleString() }}</td>
                  <td class="date-cell">{{ formatDate(s.created_at) }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      <div class="insert-coin blink">PRESS A GAME TO START</div>
    </div>
  `,
  styles: [`
    .game-card:hover {
      transform: scale(1.05);
      border-color: var(--neon-yellow);
    }
    .scores-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 9px;
    }
    .scores-table th {
      color: var(--neon-pink);
      padding: 10px 6px;
      border-bottom: 2px solid var(--neon-pink);
      text-align: left;
      font-size: 8px;
    }
    .scores-table td {
      color: var(--neon-cyan);
      padding: 10px 6px;
      border-bottom: 1px solid var(--arcade-border);
    }
    .scores-table tr:hover td {
      color: var(--neon-yellow);
    }
    .rank { color: var(--neon-pink); text-align: center; }
    .game-cell { color: var(--neon-green); font-size: 7px; }
    .score-cell { color: var(--neon-yellow); }
    .date-cell { color: #888; font-size: 7px; }
  `],
})
export class HomeComponent implements OnInit {
  scores = signal<HighScore[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadScores();
  }

  private async loadScores() {
    this.loading.set(true);
    const { data, error } = await supabase
      .from('high_scores')
      .select('id, player_name, score, game, created_at')
      .order('score', { ascending: false })
      .limit(10);

    if (!error && data) {
      this.scores.set(data as HighScore[]);
    }
    this.loading.set(false);
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR');
  }
}

import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-modal',
  template: `
    @if (show()) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2 class="glow" style="font-size: 16px; color: var(--neon-pink); text-align:center; margin-bottom: 20px;">
            PLAYER LOGIN
          </h2>

          @if (error()) {
            <div class="modal-error blink">{{ error() }}</div>
          }

          <div class="modal-field">
            <label>EMAIL</label>
            <input
              type="email"
              [value]="email()"
              (input)="email.set($any($event.target).value)"
              placeholder="player@arcade.com"
            />
          </div>

          <div class="modal-field">
            <label>PASSWORD</label>
            <input
              type="password"
              [value]="password()"
              (input)="password.set($any($event.target).value)"
              placeholder="********"
              (keyup.enter)="submit()"
            />
          </div>

          <div class="modal-buttons">
            <button class="arcade-btn pink" (click)="submit()" [disabled]="auth.loading()">
              {{ auth.loading() ? 'LOADING...' : 'LOGIN' }}
            </button>
            <button class="arcade-btn cyan" (click)="register()" [disabled]="auth.loading()">
              SIGN UP
            </button>
            <button class="arcade-btn" (click)="close()">CANCEL</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    .modal-content {
      background: var(--arcade-dark, #0d0221);
      border: 3px solid var(--neon-pink, #ff2a6d);
      border-radius: 8px;
      padding: 32px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 0 30px rgba(255,42,109,0.4);
    }
    .modal-field {
      margin-bottom: 16px;
    }
    .modal-field label {
      display: block;
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      color: var(--neon-cyan, #05d9e8);
      margin-bottom: 6px;
    }
    .modal-field input {
      width: 100%;
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      background: #1a1a2e;
      border: 2px solid var(--arcade-border, #2a2a4a);
      border-radius: 4px;
      padding: 12px;
      color: var(--neon-yellow, #fee440);
      outline: none;
    }
    .modal-field input:focus {
      border-color: var(--neon-cyan, #05d9e8);
    }
    .modal-error {
      font-size: 8px;
      color: var(--neon-pink, #ff2a6d);
      text-align: center;
      margin-bottom: 16px;
      padding: 10px;
      border: 1px solid var(--neon-pink, #ff2a6d);
      border-radius: 4px;
    }
    .modal-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }
    .modal-buttons button {
      font-size: 10px;
      padding: 10px 16px;
    }
  `],
})
export class LoginModalComponent {
  auth = inject(AuthService);
  show = signal(false);
  email = signal('');
  password = signal('');
  error = signal('');

  open() {
    this.error.set('');
    this.email.set('');
    this.password.set('');
    this.show.set(true);
  }

  close() {
    this.show.set(false);
  }

  async submit() {
    this.error.set('');
    const { error } = await this.auth.signIn(this.email(), this.password());
    if (error) {
      this.error.set(error);
    } else {
      this.close();
    }
  }

  async register() {
    this.error.set('');
    const { error } = await this.auth.signUp(this.email(), this.password());
    if (error) {
      this.error.set(error);
    } else {
      this.error.set('ACCOUNT CREATED! LOGGING IN...');
      await this.submit();
    }
  }
}

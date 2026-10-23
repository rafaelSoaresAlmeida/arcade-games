import { Component, ViewChild, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

import { HomeComponent } from './app/home/home.component';
import { AboutComponent } from './app/about/about.component';
import { BattleCityComponent } from './app/battle-city/battle-city.component';
import { PacManComponent } from './app/pac-man/pac-man.component';
import { TetrisComponent } from './app/tetris/tetris.component';
import { DinoComponent } from './app/dino/dino.component';
import { FlappyBirdComponent } from './app/flappy-bird/flappy-bird.component';
import { PanicComponent } from './app/panic/panic.component';
import { LoginModalComponent } from './app/login-modal/login-modal.component';
import { AuthService } from './app/auth.service';
import { SpaceInvadersComponent } from './app/space-invaders/space-invaders.component';
import { FlappyTilapiaComponent } from './app/flappy-tilapia/flappy-tilapia.component';

@Component({
  selector: "app-root",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginModalComponent],
  template: `
    <div class="scan-line"></div>
    <nav class="arcade-nav">
      <span class="logo float">&#x1F579; ARCADE&#x2122;</span>
      <div class="nav-links">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-item"
          >HOME</a
        >
        <a routerLink="/about" routerLinkActive="active" class="nav-item"
          >ABOUT</a
        >
        <a routerLink="/battle-city" routerLinkActive="active" class="nav-item"
          >BATTLE CITY</a
        >
        <a routerLink="/pac-man" routerLinkActive="active" class="nav-item"
          >PAC-MAN</a
        >
        <a routerLink="/tetris" routerLinkActive="active" class="nav-item"
          >TETRIS</a
        >
        <a routerLink="/dino" routerLinkActive="active" class="nav-item"
          >DINO</a
        >
        <a routerLink="/flappy-tilapia" routerLinkActive="active" class="nav-item"
          >FLAPPY TILAPIA</a
        >
        <a routerLink="/space-invaders" routerLinkActive="active" class="nav-item"
          >SPACE INVADERS</a
        >
        <a class="nav-item panic-btn" (click)="panic()">PANIC!</a>
        @if (auth.isLoggedIn) {
          <span
            class="nav-item user-display"
            style="color: var(--neon-green); cursor: default;"
          >
            {{ auth.user()?.email }}
          </span>
          <a class="nav-item logout-btn" (click)="logout()">LOGOUT</a>
        } @else {
          <a class="nav-item login-btn" (click)="openLogin()">LOGIN</a>
        }
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
    <footer class="arcade-footer">
      <p>
        &copy; 1990s ARCADE ZONE &mdash; <span class="cyan">CREDIT 99</span>
      </p>
      <p class="blink pink">INSERT COIN TO CONTINUE</p>
    </footer>
    <app-login-modal />
  `,
})
export class App {
  auth = inject(AuthService);
  private router = inject(Router);
  @ViewChild(LoginModalComponent) loginModal!: LoginModalComponent;

  openLogin() {
    this.loginModal?.open();
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(["/"]);
  }

  panic() {
    this.router.navigate(["/panic"]);
  }
}

const routes = [
  { path: "", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "battle-city", component: BattleCityComponent },
  { path: "pac-man", component: PacManComponent },
  { path: "tetris", component: TetrisComponent },
  { path: "dino", component: DinoComponent },
  { path: "flappy-tilapia", component: FlappyTilapiaComponent },
  { path: "space-invaders", component: SpaceInvadersComponent },
  { path: "panic", component: PanicComponent },

  { path: "**", redirectTo: "" },
];

bootstrapApplication(App, {
  providers: [provideRouter(routes)],
});

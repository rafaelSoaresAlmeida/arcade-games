import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<{ email: string } | null>(null);
  readonly loading = signal(false);

  constructor() {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        this.user.set({ email: data.session.user.email ?? '' });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.user.set({ email: session.user.email ?? '' });
      } else {
        this.user.set(null);
      }
    });
  }

  async signIn(email: string, password: string): Promise<{ error: string | null }> {
    this.loading.set(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    this.loading.set(false);
    if (error) return { error: error.message };
    return { error: null };
  }

  async signUp(email: string, password: string): Promise<{ error: string | null }> {
    this.loading.set(true);
    const { error } = await supabase.auth.signUp({ email, password });
    this.loading.set(false);
    if (error) return { error: error.message };
    return { error: null };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.user.set(null);
  }

  get isLoggedIn(): boolean {
    return this.user() !== null;
  }
}

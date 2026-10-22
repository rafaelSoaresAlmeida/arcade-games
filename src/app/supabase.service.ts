import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export const supabase: SupabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey
);

export interface HighScore {
  id: string;
  player_name: string;
  score: number;
  game: string;
  created_at: string;
}

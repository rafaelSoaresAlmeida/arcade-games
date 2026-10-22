/*
# Create high_scores table for arcade games

1. New Tables
- `high_scores`
  - `id` (uuid, primary key)
  - `player_name` (text, not null) - the player's display name
  - `score` (integer, not null) - points achieved
  - `game` (text, not null) - which game the score is from
  - `created_at` (timestamptz, default now()) - when the score was recorded

2. Security
- Enable RLS on `high_scores`.
- Allow anon + authenticated to read all scores (public leaderboard).
- Allow anon + authenticated to insert scores (anyone can submit).
- No update or delete policies needed.

3. Notes
- This is a public leaderboard - all scores are visible to everyone.
- No user_id column needed since scores can be submitted without login.
*/

CREATE TABLE IF NOT EXISTS high_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL,
  game text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE high_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scores" ON high_scores;
CREATE POLICY "anon_select_scores" ON high_scores FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scores" ON high_scores;
CREATE POLICY "anon_insert_scores" ON high_scores FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_high_scores_score ON high_scores (score DESC);
CREATE INDEX IF NOT EXISTS idx_high_scores_created ON high_scores (created_at DESC);

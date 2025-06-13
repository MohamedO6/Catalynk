/*
  # Create tables for Pitch or Ditch game

  1. New Tables
    - `game_ideas`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `funding_goal` (numeric)
      - `difficulty` (text)
      - `market_size` (text)
      - `image_url` (text)
      - `pitch_votes` (integer, default 0)
      - `ditch_votes` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

    - `game_votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `idea_id` (uuid, foreign key to game_ideas)
      - `vote_type` (text, 'pitch' or 'ditch')
      - `created_at` (timestamp)

    - `game_scores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `total_score` (integer, default 0)
      - `total_votes` (integer, default 0)
      - `accuracy` (numeric, default 0)
      - `best_streak` (integer, default 0)
      - `current_streak` (integer, default 0)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Game Ideas Table
CREATE TABLE IF NOT EXISTS game_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  funding_goal NUMERIC DEFAULT 0,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'impossible')),
  market_size TEXT DEFAULT 'medium' CHECK (market_size IN ('niche', 'small', 'medium', 'large', 'huge', 'infinite')),
  image_url TEXT,
  pitch_votes INTEGER DEFAULT 0,
  ditch_votes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game Votes Table
CREATE TABLE IF NOT EXISTS game_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES game_ideas(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('pitch', 'ditch')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, idea_id)
);

-- Game Scores Table
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_score INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  accuracy NUMERIC DEFAULT 0 CHECK (accuracy >= 0 AND accuracy <= 100),
  best_streak INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE game_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Policies for game_ideas
CREATE POLICY "Anyone can view active game ideas" ON game_ideas
  FOR SELECT USING (is_active = true);

-- Policies for game_votes
CREATE POLICY "Users can view all votes" ON game_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can create own votes" ON game_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON game_votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for game_scores
CREATE POLICY "Users can view all scores" ON game_scores
  FOR SELECT USING (true);

CREATE POLICY "Users can update own scores" ON game_scores
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS game_ideas_is_active_idx ON game_ideas(is_active);
CREATE INDEX IF NOT EXISTS game_ideas_created_at_idx ON game_ideas(created_at DESC);

CREATE INDEX IF NOT EXISTS game_votes_user_id_idx ON game_votes(user_id);
CREATE INDEX IF NOT EXISTS game_votes_idea_id_idx ON game_votes(idea_id);

CREATE INDEX IF NOT EXISTS game_scores_user_id_idx ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS game_scores_total_score_idx ON game_scores(total_score DESC);

-- Function to update vote counts on game ideas
CREATE OR REPLACE FUNCTION update_game_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'pitch' THEN
      UPDATE game_ideas SET pitch_votes = pitch_votes + 1 WHERE id = NEW.idea_id;
    ELSE
      UPDATE game_ideas SET ditch_votes = ditch_votes + 1 WHERE id = NEW.idea_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'pitch' THEN
      UPDATE game_ideas SET pitch_votes = pitch_votes - 1 WHERE id = OLD.idea_id;
    ELSE
      UPDATE game_ideas SET ditch_votes = ditch_votes - 1 WHERE id = OLD.idea_id;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'pitch' THEN
      UPDATE game_ideas SET pitch_votes = pitch_votes - 1 WHERE id = OLD.idea_id;
    ELSE
      UPDATE game_ideas SET ditch_votes = ditch_votes - 1 WHERE id = OLD.idea_id;
    END IF;
    IF NEW.vote_type = 'pitch' THEN
      UPDATE game_ideas SET pitch_votes = pitch_votes + 1 WHERE id = NEW.idea_id;
    ELSE
      UPDATE game_ideas SET ditch_votes = ditch_votes + 1 WHERE id = NEW.idea_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for game vote counting
CREATE TRIGGER game_votes_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON game_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_game_vote_counts();

-- Function to update or create game scores
CREATE OR REPLACE FUNCTION upsert_game_score(
  p_user_id UUID,
  p_points INTEGER,
  p_is_correct BOOLEAN,
  p_streak INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO game_scores (user_id, total_score, total_votes, accuracy, best_streak, current_streak, updated_at)
  VALUES (p_user_id, p_points, 1, CASE WHEN p_is_correct THEN 100 ELSE 0 END, p_streak, p_streak, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_score = game_scores.total_score + p_points,
    total_votes = game_scores.total_votes + 1,
    accuracy = CASE 
      WHEN p_is_correct THEN LEAST(100, game_scores.accuracy + 1)
      ELSE GREATEST(0, game_scores.accuracy - 1)
    END,
    best_streak = GREATEST(game_scores.best_streak, p_streak),
    current_streak = p_streak,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Insert some sample game ideas
INSERT INTO game_ideas (title, description, category, funding_goal, difficulty, market_size, image_url) VALUES
('AI-Powered Sock Matcher', 'Never lose a sock again! Our AI analyzes your laundry patterns and predicts which socks will go missing, automatically ordering replacements.', 'AI/Lifestyle', 50000, 'easy', 'small', 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'),
('Blockchain-Based Pet Translator', 'Decode what your pets are really thinking with our revolutionary blockchain-secured neural network that translates barks, meows, and chirps into human language.', 'Blockchain/Pets', 500000, 'impossible', 'huge', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'),
('Subscription Box for Air', 'Premium air from exotic locations delivered monthly. Each bottle contains authentic atmosphere from places like Mount Everest, Amazon Rainforest, or Paris cafés.', 'Subscription/Wellness', 100000, 'medium', 'medium', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'),
('Dating App for Plants', 'Help your houseplants find love! Our app uses advanced botany algorithms to match compatible plants for optimal growth and happiness.', 'Dating/Plants', 25000, 'easy', 'niche', 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'),
('Time Travel Insurance', 'Protect yourself from temporal paradoxes and timeline disruptions. Our comprehensive coverage includes butterfly effect protection and grandfather clause coverage.', 'Insurance/Sci-Fi', 1000000, 'impossible', 'infinite', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'),
('Smart Toilet Paper', 'IoT-enabled toilet paper that tracks your bathroom habits and automatically reorders when running low. Includes health monitoring and dietary recommendations.', 'IoT/Health', 75000, 'medium', 'large', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'),
('Uber for Ghosts', 'On-demand paranormal transportation service. Summon friendly spirits to help with moving, haunting your enemies, or just for companionship.', 'Transportation/Supernatural', 200000, 'impossible', 'niche', 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'),
('Edible Phone Cases', 'Sustainable phone protection you can eat! Made from organic, biodegradable materials in flavors like chocolate, strawberry, and pizza.', 'Sustainability/Food', 30000, 'easy', 'medium', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop');

-- Update vote counts for sample ideas (simulate some voting)
UPDATE game_ideas SET pitch_votes = 234, ditch_votes = 156 WHERE title = 'AI-Powered Sock Matcher';
UPDATE game_ideas SET pitch_votes = 89, ditch_votes = 445 WHERE title = 'Blockchain-Based Pet Translator';
UPDATE game_ideas SET pitch_votes = 167, ditch_votes = 298 WHERE title = 'Subscription Box for Air';
UPDATE game_ideas SET pitch_votes = 312, ditch_votes = 123 WHERE title = 'Dating App for Plants';
UPDATE game_ideas SET pitch_votes = 78, ditch_votes = 567 WHERE title = 'Time Travel Insurance';
UPDATE game_ideas SET pitch_votes = 203, ditch_votes = 187 WHERE title = 'Smart Toilet Paper';
UPDATE game_ideas SET pitch_votes = 45, ditch_votes = 389 WHERE title = 'Uber for Ghosts';
UPDATE game_ideas SET pitch_votes = 278, ditch_votes = 134 WHERE title = 'Edible Phone Cases';
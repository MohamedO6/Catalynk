/*
  # Create community tables for forums and discussions

  1. New Tables
    - `community_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author_id` (uuid, foreign key to profiles)
      - `category` (text)
      - `tags` (text array)
      - `upvotes` (integer, default 0)
      - `downvotes` (integer, default 0)
      - `comment_count` (integer, default 0)
      - `is_pinned` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `community_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to community_posts)
      - `author_id` (uuid, foreign key to profiles)
      - `content` (text)
      - `parent_id` (uuid, foreign key to community_comments, nullable)
      - `upvotes` (integer, default 0)
      - `downvotes` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `community_votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `post_id` (uuid, foreign key to community_posts, nullable)
      - `comment_id` (uuid, foreign key to community_comments, nullable)
      - `vote_type` (text, 'up' or 'down')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Votes Table
CREATE TABLE IF NOT EXISTS community_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_votes ENABLE ROW LEVEL SECURITY;

-- Policies for community_posts
CREATE POLICY "Anyone can view posts" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts" ON community_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Policies for community_comments
CREATE POLICY "Anyone can view comments" ON community_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own comments" ON community_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments" ON community_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Policies for community_votes
CREATE POLICY "Users can view all votes" ON community_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can create own votes" ON community_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON community_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON community_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS community_posts_author_id_idx ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS community_posts_category_idx ON community_posts(category);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS community_comments_post_id_idx ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS community_comments_author_id_idx ON community_comments(author_id);
CREATE INDEX IF NOT EXISTS community_comments_parent_id_idx ON community_comments(parent_id);

CREATE INDEX IF NOT EXISTS community_votes_user_id_idx ON community_votes(user_id);
CREATE INDEX IF NOT EXISTS community_votes_post_id_idx ON community_votes(post_id);
CREATE INDEX IF NOT EXISTS community_votes_comment_id_idx ON community_votes(comment_id);

-- Create triggers for updated_at
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      IF NEW.vote_type = 'up' THEN
        UPDATE community_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
      ELSE
        UPDATE community_posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
      END IF;
    ELSIF NEW.comment_id IS NOT NULL THEN
      IF NEW.vote_type = 'up' THEN
        UPDATE community_comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
      ELSE
        UPDATE community_comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      IF OLD.vote_type = 'up' THEN
        UPDATE community_posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
      ELSE
        UPDATE community_posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
      END IF;
    ELSIF OLD.comment_id IS NOT NULL THEN
      IF OLD.vote_type = 'up' THEN
        UPDATE community_comments SET upvotes = upvotes - 1 WHERE id = OLD.comment_id;
      ELSE
        UPDATE community_comments SET downvotes = downvotes - 1 WHERE id = OLD.comment_id;
      END IF;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle vote type changes
    IF OLD.post_id IS NOT NULL THEN
      IF OLD.vote_type = 'up' THEN
        UPDATE community_posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
      ELSE
        UPDATE community_posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
      END IF;
      IF NEW.vote_type = 'up' THEN
        UPDATE community_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
      ELSE
        UPDATE community_posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
      END IF;
    ELSIF OLD.comment_id IS NOT NULL THEN
      IF OLD.vote_type = 'up' THEN
        UPDATE community_comments SET upvotes = upvotes - 1 WHERE id = OLD.comment_id;
      ELSE
        UPDATE community_comments SET downvotes = downvotes - 1 WHERE id = OLD.comment_id;
      END IF;
      IF NEW.vote_type = 'up' THEN
        UPDATE community_comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
      ELSE
        UPDATE community_comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for vote counting
CREATE TRIGGER community_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON community_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_counts();

-- Function to update comment counts
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comment counting
CREATE TRIGGER community_comments_count_trigger
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_count();
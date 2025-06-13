/*
  # Create projects table and related functionality

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `founder_id` (uuid, foreign key to profiles)
      - `funding_goal` (numeric)
      - `current_funding` (numeric, default 0)
      - `funding_stage` (text)
      - `team_size` (integer)
      - `location` (text)
      - `website` (text)
      - `tags` (text array)
      - `image_url` (text)
      - `has_audio` (boolean, default false)
      - `has_video` (boolean, default false)
      - `problem` (text)
      - `solution` (text)
      - `market` (text)
      - `competition` (text)
      - `business_model` (text)
      - `traction` (text)
      - `pitch` (text)
      - `status` (text, default 'active')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `projects` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  founder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  funding_goal NUMERIC DEFAULT 0,
  current_funding NUMERIC DEFAULT 0,
  funding_stage TEXT DEFAULT 'pre-seed',
  team_size INTEGER DEFAULT 1,
  location TEXT,
  website TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  has_audio BOOLEAN DEFAULT FALSE,
  has_video BOOLEAN DEFAULT FALSE,
  problem TEXT,
  solution TEXT,
  market TEXT,
  competition TEXT,
  business_model TEXT,
  traction TEXT,
  pitch TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active projects" ON projects
  FOR SELECT USING (status = 'active');

CREATE POLICY "Founders can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = founder_id);

CREATE POLICY "Founders can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = founder_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS projects_founder_id_idx ON projects(founder_id);
CREATE INDEX IF NOT EXISTS projects_category_idx ON projects(category);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
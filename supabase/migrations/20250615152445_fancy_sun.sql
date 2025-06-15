/*
  # Create messaging and notifications tables - Part 1: Basic Tables

  1. New Tables
    - `conversations` - Direct messaging between users
    - `messages` - Individual messages in conversations  
    - `notifications` - System notifications for users

  2. Security
    - Enable RLS on all tables
    - Add basic policies for user access
*/

-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (participant_1 != participant_2)
);

-- Messages Table  
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('message', 'like', 'investment', 'project_update', 'comment', 'follow')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
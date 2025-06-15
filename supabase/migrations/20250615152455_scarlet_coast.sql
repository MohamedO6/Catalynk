/*
  # Add indexes for messaging tables

  1. Indexes for conversations
    - participant_1, participant_2 for lookups
    - last_message_at for ordering
    - unique constraint for participant pairs

  2. Indexes for messages
    - conversation_id for message retrieval
    - sender_id for user messages
    - created_at for ordering

  3. Indexes for notifications
    - user_id for user notifications
    - is_read for filtering
    - created_at for ordering
*/

-- Add unique constraint for conversations
ALTER TABLE conversations ADD CONSTRAINT conversations_participants_unique 
  UNIQUE(participant_1, participant_2);

-- Create indexes for conversations
CREATE INDEX IF NOT EXISTS conversations_participant_1_idx ON conversations(participant_1);
CREATE INDEX IF NOT EXISTS conversations_participant_2_idx ON conversations(participant_2);
CREATE INDEX IF NOT EXISTS conversations_last_message_at_idx ON conversations(last_message_at DESC);

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
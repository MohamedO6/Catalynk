/*
  # Add RLS policies for messaging tables

  1. Policies for conversations
    - Users can view their own conversations
    - Users can create conversations they participate in
    - Users can update their own conversations

  2. Policies for messages
    - Users can view messages in their conversations
    - Users can send messages in their conversations
    - Users can update their own messages

  3. Policies for notifications
    - Users can view their own notifications
    - System can create notifications
    - Users can update their own notifications
*/

-- Policies for conversations
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
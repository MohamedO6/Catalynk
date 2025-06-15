/*
  # Add functions and triggers for messaging

  1. Functions
    - update_conversation_last_message() - Updates conversation timestamp
    - create_message_notification() - Creates notifications for new messages

  2. Triggers
    - Update conversation timestamp when message is sent
    - Create notification when message is sent
*/

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification for new messages
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
  sender_name TEXT;
BEGIN
  -- Get the recipient (the other participant in the conversation)
  SELECT CASE 
    WHEN participant_1 = NEW.sender_id THEN participant_2 
    ELSE participant_1 
  END INTO recipient_id
  FROM conversations 
  WHERE id = NEW.conversation_id;

  -- Get sender name
  SELECT full_name INTO sender_name
  FROM profiles 
  WHERE id = NEW.sender_id;

  -- Create notification
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    sender_id,
    related_id
  ) VALUES (
    recipient_id,
    'message',
    'New Message',
    sender_name || ' sent you a message',
    NEW.sender_id,
    NEW.conversation_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
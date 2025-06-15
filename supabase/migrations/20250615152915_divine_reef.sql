-- Simple trigger creation with error handling
-- This migration creates the triggers for messaging functionality

-- First, ensure the functions exist before creating triggers
DO $$
BEGIN
  -- Check if update_conversation_last_message function exists
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_conversation_last_message') THEN
    -- Create trigger for updating conversation timestamp
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'messages_update_conversation_trigger') THEN
      CREATE TRIGGER messages_update_conversation_trigger
        AFTER INSERT ON messages
        FOR EACH ROW
        EXECUTE FUNCTION update_conversation_last_message();
    END IF;
  END IF;

  -- Check if create_message_notification function exists
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_message_notification') THEN
    -- Create trigger for message notifications
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'messages_notification_trigger') THEN
      CREATE TRIGGER messages_notification_trigger
        AFTER INSERT ON messages
        FOR EACH ROW
        EXECUTE FUNCTION create_message_notification();
    END IF;
  END IF;
END $$;
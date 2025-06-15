/*
  # Add triggers for messaging functionality

  1. Triggers
    - messages_update_conversation_trigger - Updates conversation timestamp
    - messages_notification_trigger - Creates notifications for new messages
*/

-- Trigger to update conversation timestamp
CREATE TRIGGER messages_update_conversation_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Trigger to create message notifications
CREATE TRIGGER messages_notification_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION create_message_notification();
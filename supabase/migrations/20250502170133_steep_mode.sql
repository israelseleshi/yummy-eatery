/*
  # Update chat system schema

  1. Updates
    - Add notifications table for chat messages
    - Add read_at timestamp to chat_messages
    - Add indexes for better performance

  2. Security
    - Enable RLS on notifications table
    - Add policies for authenticated users
*/

-- Add read_at timestamp to chat_messages
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own notifications
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to update their own notifications
CREATE POLICY "Users can update their own notifications"
  FOR UPDATE
  ON notifications
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_read_at_idx ON chat_messages(read_at);
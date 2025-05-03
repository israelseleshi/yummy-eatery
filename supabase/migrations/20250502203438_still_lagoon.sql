/*
  # Add payment verification system

  1. New Tables
    - `payment_verifications`
      - `id` (uuid, primary key)
      - `request_id` (uuid, references restaurant_requests)
      - `verification_code` (text)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
      - `used_at` (timestamptz)

  2. Security
    - Enable RLS on payment_verifications table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS payment_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES restaurant_requests(id) ON DELETE CASCADE,
  verification_code text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz,
  UNIQUE(verification_code)
);

ALTER TABLE payment_verifications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own verification codes
CREATE POLICY "Users can read their own verification codes"
  ON payment_verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurant_requests
      WHERE restaurant_requests.id = payment_verifications.request_id
      AND restaurant_requests.owner_id = auth.uid()
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS payment_verifications_request_id_idx ON payment_verifications(request_id);
CREATE INDEX IF NOT EXISTS payment_verifications_code_idx ON payment_verifications(verification_code);
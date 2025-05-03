/*
  # Create restaurants collection

  1. New Tables
    - `restaurants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `cuisine` (text)
      - `location` (text)
      - `address` (text)
      - `rating` (numeric)
      - `price_range` (text)
      - `image` (text)
      - `featured` (boolean)
      - `description` (text)
      - `reviews_count` (integer)
      - `opening_hours` (text)
      - `coordinates` (point)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `restaurants` table
    - Add policies for authenticated users to read all restaurants
    - Add policies for admin users to manage restaurants
*/

CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cuisine text NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  rating numeric DEFAULT 0,
  price_range text NOT NULL,
  image text NOT NULL,
  featured boolean DEFAULT false,
  description text NOT NULL,
  reviews_count integer DEFAULT 0,
  opening_hours text NOT NULL,
  coordinates point NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Allow all users to read restaurants
CREATE POLICY "Anyone can view restaurants"
  ON restaurants
  FOR SELECT
  TO public
  USING (true);

-- Allow admin users to manage restaurants
CREATE POLICY "Admin users can manage restaurants"
  ON restaurants
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for pagination and filtering
CREATE INDEX IF NOT EXISTS restaurants_created_at_idx ON restaurants (created_at DESC);
CREATE INDEX IF NOT EXISTS restaurants_cuisine_idx ON restaurants (cuisine);
CREATE INDEX IF NOT EXISTS restaurants_location_idx ON restaurants (location);
CREATE INDEX IF NOT EXISTS restaurants_rating_idx ON restaurants (rating DESC);
/*
  # Sales Data Schema

  1. Tables
    - sales_data: Core sales information
      - Daily sales totals
      - Category breakdowns (food, bar, wine)
      - Time-based sales tracking
      - Customer metrics
      - Service metrics
    - payment_methods: Payment method tracking
      - Links to sales_data
      - Method type and amount
    - promotions: Promotion tracking
      - Links to sales_data
      - Promotion details and performance

  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Policies for authenticated users to read and write data
    
  3. Features
    - Automatic timestamp management
    - Cascading deletes for related records
    - Default values for numeric fields
*/

-- Create sales_data table
CREATE TABLE IF NOT EXISTS sales_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  total_sales numeric NOT NULL DEFAULT 0,
  food_sales numeric DEFAULT 0,
  bar_sales numeric DEFAULT 0,
  wine_sales numeric DEFAULT 0,
  happy_hour_sales numeric DEFAULT 0,
  sales_7pm_to_10pm numeric DEFAULT 0,
  after_10pm_sales numeric DEFAULT 0,
  total_pax integer NOT NULL DEFAULT 0,
  reservations integer DEFAULT 0,
  walk_ins integer DEFAULT 0,
  no_shows integer DEFAULT 0,
  cancellations integer DEFAULT 0,
  phone_calls_answered integer DEFAULT 0,
  missed_phone_calls integer DEFAULT 0,
  per_head_spend numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_data_id uuid REFERENCES sales_data(id) ON DELETE CASCADE,
  method text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_data_id uuid REFERENCES sales_data(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  sets integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON sales_data;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON sales_data;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON payment_methods;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON payment_methods;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON promotions;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON promotions;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON sales_data
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON sales_data
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON payment_methods
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON payment_methods
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON promotions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON promotions
  FOR ALL TO authenticated USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_sales_data_updated_at ON sales_data;

-- Create trigger for sales_data
CREATE TRIGGER update_sales_data_updated_at
  BEFORE UPDATE ON sales_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
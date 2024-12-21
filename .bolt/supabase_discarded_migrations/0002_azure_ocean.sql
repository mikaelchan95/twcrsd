/*
  # Enable Row Level Security

  1. Security:
    - Enable RLS on all tables
    - Create policies for authenticated users
    - Full CRUD access for authenticated users
*/

-- Enable RLS
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_data
CREATE POLICY "sales_data_select_policy" ON sales_data
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "sales_data_insert_policy" ON sales_data
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "sales_data_update_policy" ON sales_data
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "sales_data_delete_policy" ON sales_data
  FOR DELETE TO authenticated USING (true);

-- Create policies for payment_methods
CREATE POLICY "payment_methods_select_policy" ON payment_methods
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "payment_methods_insert_policy" ON payment_methods
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "payment_methods_update_policy" ON payment_methods
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "payment_methods_delete_policy" ON payment_methods
  FOR DELETE TO authenticated USING (true);

-- Create policies for promotions
CREATE POLICY "promotions_select_policy" ON promotions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "promotions_insert_policy" ON promotions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "promotions_update_policy" ON promotions
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "promotions_delete_policy" ON promotions
  FOR DELETE TO authenticated USING (true);
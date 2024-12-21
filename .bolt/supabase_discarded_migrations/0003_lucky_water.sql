/*
  # Database Triggers

  1. Features:
    - Automatic updated_at timestamp management
    - Trigger function for timestamp updates
*/

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sales_data
DROP TRIGGER IF EXISTS update_sales_data_updated_at ON sales_data;
CREATE TRIGGER update_sales_data_updated_at
  BEFORE UPDATE ON sales_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
import { salesDataSchema } from '../types/sales';
import type { SalesData } from '../types/sales';

export function validateSalesData(data: unknown): SalesData[] {
  try {
    // Ensure data is an array
    if (!Array.isArray(data)) {
      throw new Error('Input must be an array');
    }

    // Validate each item in the array against the schema
    return data.map((item, index) => {
      try {
        return salesDataSchema.parse(item);
      } catch (error) {
        console.error(`Validation error in item ${index}:`, error);
        throw error;
      }
    });
  } catch (error) {
    console.error('Sales data validation error:', error);
    throw error;
  }
}
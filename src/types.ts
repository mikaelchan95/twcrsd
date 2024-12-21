export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface MonthlyData extends SalesData {
  topSellingItems: { name: string; quantity: number; revenue: number }[];
}

export type ViewType = 'monthly' | 'yearly' | 'comparative';
export type ComparisonType = 'month' | 'quarter';
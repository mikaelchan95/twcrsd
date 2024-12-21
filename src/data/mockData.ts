import { MonthlyData } from '../types';

export const salesData: MonthlyData[] = [
  {
    date: '2024-01',
    revenue: 125000,
    orders: 4200,
    averageOrderValue: 29.76,
    topSellingItems: [
      { name: 'Margherita Pizza', quantity: 850, revenue: 12750 },
      { name: 'Grilled Salmon', quantity: 620, revenue: 15500 },
      { name: 'Caesar Salad', quantity: 780, revenue: 8580 },
    ],
  },
  // Add more months here...
];

export const generateYearlyData = () => {
  const years = [2023, 2024];
  return years.map(year => ({
    year,
    revenue: Math.random() * 1500000 + 1000000,
    orders: Math.floor(Math.random() * 50000 + 30000),
    averageOrderValue: Math.random() * 20 + 25,
  }));
};
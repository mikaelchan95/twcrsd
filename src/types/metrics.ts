import { SalesData } from './sales';
import { CategorySales, TimeBasedSales, CustomerMetrics, ServiceMetrics } from './comparison';

export interface DailyMetrics {
  date: string;
  totalSales: number;
  totalCustomers: number;
  averagePerCustomer: number;
  categorySales: CategorySales;
  timeBasedSales: TimeBasedSales;
  customerMetrics: CustomerMetrics;
  serviceMetrics: ServiceMetrics;
  paymentMethods: Record<string, number>;
}

export interface AggregatedMetrics {
  totalSales: number;
  totalCustomers: number;
  averageDailySales: number;
  bestDaySales: number;
  worstDaySales: number;
  categorySales: CategorySales;
  timeBasedSales: TimeBasedSales;
  customerMetrics: CustomerMetrics;
  serviceMetrics: ServiceMetrics;
  paymentMethods: Record<string, number>;
  daysInPeriod: number;
  completedDays: number;
  isPartialPeriod: boolean;
}

export interface ProjectionConfig {
  projectionType?: 'linear' | 'conservative';
  metric?: string;
}

export interface MetricCalculation {
  current: number;
  previous: number;
  change: number;
  isPositive: boolean;
  isProjected: boolean;
  completionRate?: number;
}
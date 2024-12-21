export type ComparisonPeriodType = 'month' | 'quarter';

export interface CategorySales {
  food: number;
  bar: number;
  wine: number;
}

export interface TimeBasedSales {
  happyHour: number;
  evening: number;
  lateNight: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  reservations: number;
  walkIns: number;
  noShows: number;
  cancellations: number;
  reservationRate: number;
  noShowRate: number;
}

export interface ServiceMetrics {
  phoneCallsAnswered: number;
  missedPhoneCalls: number;
  answerRate: number;
}

export interface ComparisonPeriodData {
  label: string;
  data: SalesData[];
  totalSales: number;
  averageDailySales: number;
  bestDaySales: number;
  worstDaySales: number;
  customerMetrics: CustomerMetrics;
  categorySales: CategorySales;
  timeBasedSales: TimeBasedSales;
  serviceMetrics: ServiceMetrics;
  paymentMethods: Record<string, number>;
  isPartialPeriod: boolean;
  daysInPeriod: number;
  completedDays: number;
}
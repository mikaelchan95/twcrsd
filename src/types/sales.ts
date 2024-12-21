import { z } from 'zod';

export const promotionSchema = z.object({
  name: z.string(),
  amount: z.number(),
  sets: z.number()
});

export const salesDataSchema = z.object({
  date: z.string(),
  totalSales: z.number(),
  happyHourSales: z.number().optional(),
  salesFrom7pmTo10pm: z.number().optional(),
  after10pmSales: z.number().optional(),
  foodSales: z.number().optional(),
  barSales: z.number().optional(),
  wineSales: z.number().optional(),
  paymentMethods: z.record(z.string(), z.number()),
  promotions: z.array(promotionSchema),
  reservations: z.number().optional(),
  cancellations: z.number().optional(),
  noShows: z.number().optional(),
  walkIns: z.number().optional(),
  phoneCallsAnswered: z.number().optional(),
  missedPhoneCalls: z.number().optional(),
  purezza: z.number().optional(),
  totalPax: z.number(),
  perHeadSpend: z.number(),
  mtdSales: z.number().optional(),
  miscellaneous: z.record(z.string(), z.unknown()),
  entertainment: z.record(z.string(), z.unknown())
});

export type SalesData = z.infer<typeof salesDataSchema>;

export interface MonthlyStats {
  totalSales: number;
  bestDay: {
    date: string;
    totalSales: number;
  };
  totalCustomers: number;
  averagePerCustomer: number;
  reservationRate: number;
  noShowRate: number;
  categorySales: {
    food: number;
    bar: number;
    wine: number;
  };
  paymentMethods: Record<string, number>;
}

export interface QuarterlyStats {
  totalSales: number;
  totalCustomers: number;
  averagePerCustomer: number;
  reservationRate: number;
  foodSales: number;
  barSales: number;
  wineSales: number;
  phoneCallsAnswered: number;
  phoneCallsMissed: number;
  phoneCallAnswerRate: number;
}

export interface YearlyStats {
  totalSales: number;
  averageMonthlySales: number;
  totalCustomers: number;
  averagePerCustomer: number;
  reservationRate: number;
  noShowRate: number;
}
import { z } from 'zod';

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  currency: z.enum(['USD', 'EUR', 'GBP', 'SGD']),
  dateFormat: z.enum(['MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd']),
  notifications: z.object({
    email: z.boolean(),
    browser: z.boolean(),
    salesAlerts: z.boolean(),
    dailyReports: z.boolean()
  }),
  targets: z.object({
    monthlySales: z.number(),
    dailyCustomers: z.number(),
    reservationRate: z.number()
  }),
  display: z.object({
    showProjections: z.boolean(),
    compactNumbers: z.boolean(),
    showTrends: z.boolean()
  })
});

export type Settings = z.infer<typeof settingsSchema>;

export const defaultSettings: Settings = {
  theme: 'system',
  currency: 'USD',
  dateFormat: 'MM/dd/yyyy',
  notifications: {
    email: true,
    browser: true,
    salesAlerts: true,
    dailyReports: false
  },
  targets: {
    monthlySales: 280000,
    dailyCustomers: 100,
    reservationRate: 70
  },
  display: {
    showProjections: true,
    compactNumbers: false,
    showTrends: true
  }
};
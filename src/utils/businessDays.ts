import { parseISO, isSunday, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { SalesData } from '../types/sales';

export interface BusinessDayConfig {
  excludeSundays: boolean;
  excludeCustomDates?: string[];
  includeSpecialDates?: string[];
}

export function calculateBusinessDays(
  data: SalesData[],
  config: BusinessDayConfig = { excludeSundays: true }
): {
  totalDays: number;
  workingDays: number;
  actualWorkingDays: number;
  remainingWorkingDays: number;
} {
  if (!data.length) {
    return { 
      totalDays: 0, 
      workingDays: 0, 
      actualWorkingDays: 0, 
      remainingWorkingDays: 0 
    };
  }

  const firstDate = parseISO(data[0].date);
  const monthStart = startOfMonth(firstDate);
  const monthEnd = endOfMonth(firstDate);
  const totalDays = monthEnd.getDate();

  // Get all dates with sales data
  const activeDates = new Set(data.map(d => d.date));

  // Track Sundays with actual sales
  const sundaysWithSales = data.filter(d => isSunday(parseISO(d.date))).length;

  let workingDays = 0;
  let actualWorkingDays = 0;
  let remainingWorkingDays = 0;

  for (let day = 1; day <= totalDays; day++) {
    const currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), day);
    const dateString = currentDate.toISOString().split('T')[0];
    const isSundayDate = isSunday(currentDate);

    // A day is a working day if:
    // 1. It's not a Sunday OR it's a Sunday with sales data
    // 2. It's not a custom excluded date OR it's specially included
    const isWorkingDay = (
      (!isSundayDate || activeDates.has(dateString)) &&
      (!config.excludeCustomDates?.includes(dateString) || config.includeSpecialDates?.includes(dateString))
    );

    if (isWorkingDay) {
      workingDays++;
      
      // Check if this working day has actual sales data
      if (activeDates.has(dateString)) {
        actualWorkingDays++;
      }
      
      // Check if this working day is still upcoming
      if (isWithinInterval(currentDate, { start: new Date(), end: monthEnd })) {
        remainingWorkingDays++;
      }
    }
  }

  // Adjust working days to include Sundays with sales
  if (config.excludeSundays) {
    workingDays += sundaysWithSales;
  }

  return {
    totalDays,
    workingDays,
    actualWorkingDays,
    remainingWorkingDays
  };
}

export function calculateDailyTarget(
  monthlyTarget: number,
  totalWorkingDays: number,
  completedDays: number,
  actualSales: number
): number {
  const remainingDays = totalWorkingDays - completedDays;
  if (remainingDays <= 0) return 0;

  const remainingTarget = monthlyTarget - actualSales;
  return remainingTarget > 0 ? remainingTarget / remainingDays : 0;
}

export function calculateMonthlyProjection(
  data: SalesData[],
  config: BusinessDayConfig = { excludeSundays: true }
): {
  projection: number;
  dailyAverage: number;
  completionRate: number;
  isPartialMonth: boolean;
} {
  const businessDays = calculateBusinessDays(data, config);
  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);
  
  // Calculate daily average based on actual working days
  const dailyAverage = businessDays.actualWorkingDays > 0 
    ? totalSales / businessDays.actualWorkingDays 
    : 0;

  // Project monthly total based on working days (including Sundays with sales)
  const projection = dailyAverage * businessDays.workingDays;
  
  const completionRate = (businessDays.actualWorkingDays / businessDays.workingDays) * 100;
  const isPartialMonth = businessDays.actualWorkingDays < businessDays.workingDays;

  return {
    projection,
    dailyAverage,
    completionRate,
    isPartialMonth
  };
}
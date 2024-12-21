import { TimeBasedSales } from '../../types/comparison';
import { SalesData } from '../../types/sales';

export interface TimeBasedMetricResult {
  currentValue: number;
  previousValue: number;
  percentageOfTotal: number;
  previousPercentageOfTotal: number;
  percentageChange: number;
  percentagePointChange: number;
  dailyAverage: number;
  previousDailyAverage: number;
}

export function calculateTimeBasedMetrics(
  currentPeriodData: SalesData[],
  previousPeriodData: SalesData[],
  isPartialPeriod: boolean
): Record<keyof TimeBasedSales, TimeBasedMetricResult> {
  if (!currentPeriodData.length || !previousPeriodData.length) {
    return {
      happyHour: createEmptyMetric(),
      evening: createEmptyMetric(),
      lateNight: createEmptyMetric()
    };
  }

  // Calculate raw totals with safe defaults
  const currentTotals = currentPeriodData.reduce(
    (acc, day) => ({
      happyHour: acc.happyHour + (day.happyHourSales || 0),
      evening: acc.evening + (day.salesFrom7pmTo10pm || 0),
      lateNight: acc.lateNight + (day.after10pmSales || 0)
    }),
    { happyHour: 0, evening: 0, lateNight: 0 }
  );

  const previousTotals = previousPeriodData.reduce(
    (acc, day) => ({
      happyHour: acc.happyHour + (day.happyHourSales || 0),
      evening: acc.evening + (day.salesFrom7pmTo10pm || 0),
      lateNight: acc.lateNight + (day.after10pmSales || 0)
    }),
    { happyHour: 0, evening: 0, lateNight: 0 }
  );

  // Pro-rate if necessary
  if (isPartialPeriod && currentPeriodData.length > 0) {
    const daysInMonth = new Date(
      new Date(currentPeriodData[0].date).getFullYear(),
      new Date(currentPeriodData[0].date).getMonth() + 1,
      0
    ).getDate();
    const proRateFactor = daysInMonth / currentPeriodData.length;
    
    Object.keys(currentTotals).forEach(key => {
      currentTotals[key as keyof TimeBasedSales] *= proRateFactor;
    });
  }

  // Calculate totals for percentages (ensure non-zero)
  const currentTotal = Math.max(
    Object.values(currentTotals).reduce((sum, val) => sum + val, 0),
    0.01 // Prevent division by zero
  );
  
  const previousTotal = Math.max(
    Object.values(previousTotals).reduce((sum, val) => sum + val, 0),
    0.01 // Prevent division by zero
  );

  // Calculate metrics for each time slot
  const timeSlots: (keyof TimeBasedSales)[] = ['happyHour', 'evening', 'lateNight'];
  const result = {} as Record<keyof TimeBasedSales, TimeBasedMetricResult>;

  timeSlots.forEach(slot => {
    const currentValue = currentTotals[slot];
    const previousValue = previousTotals[slot];
    const percentageOfTotal = (currentValue / currentTotal) * 100;
    const previousPercentageOfTotal = (previousValue / previousTotal) * 100;

    result[slot] = {
      currentValue,
      previousValue,
      percentageOfTotal: Number.isFinite(percentageOfTotal) ? percentageOfTotal : 0,
      previousPercentageOfTotal: Number.isFinite(previousPercentageOfTotal) ? previousPercentageOfTotal : 0,
      percentageChange: calculatePercentageChange(currentValue, previousValue),
      percentagePointChange: calculatePercentagePointChange(percentageOfTotal, previousPercentageOfTotal),
      dailyAverage: currentPeriodData.length ? currentValue / currentPeriodData.length : 0,
      previousDailyAverage: previousPeriodData.length ? previousValue / previousPeriodData.length : 0
    };
  });

  return result;
}

function createEmptyMetric(): TimeBasedMetricResult {
  return {
    currentValue: 0,
    previousValue: 0,
    percentageOfTotal: 0,
    previousPercentageOfTotal: 0,
    percentageChange: 0,
    percentagePointChange: 0,
    dailyAverage: 0,
    previousDailyAverage: 0
  };
}

function calculatePercentageChange(current: number, previous: number): number {
  if (!previous || !current) return 0;
  const change = ((current - previous) / previous) * 100;
  return Number.isFinite(change) ? change : 0;
}

function calculatePercentagePointChange(current: number, previous: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return 0;
  const change = current - previous;
  return Number.isFinite(change) ? change : 0;
}
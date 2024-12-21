import { CategorySales } from '../../types/comparison';
import { SalesData } from '../../types/sales';

export interface CategoryMetricResult {
  currentValue: number;
  previousValue: number;
  percentageOfTotal: number;
  previousPercentageOfTotal: number;
  percentageChange: number;
  percentagePointChange: number;
}

export function calculateCategoryMetrics(
  currentPeriodData: SalesData[],
  previousPeriodData: SalesData[],
  isPartialPeriod: boolean
): Record<keyof CategorySales, CategoryMetricResult> {
  if (!currentPeriodData.length || !previousPeriodData.length) {
    return {
      food: createEmptyMetric(),
      bar: createEmptyMetric(),
      wine: createEmptyMetric()
    };
  }

  // Calculate raw totals with safe defaults
  const currentTotals = currentPeriodData.reduce(
    (acc, day) => ({
      food: acc.food + (day.foodSales || 0),
      bar: acc.bar + (day.barSales || 0),
      wine: acc.wine + (day.wineSales || 0)
    }),
    { food: 0, bar: 0, wine: 0 }
  );

  const previousTotals = previousPeriodData.reduce(
    (acc, day) => ({
      food: acc.food + (day.foodSales || 0),
      bar: acc.bar + (day.barSales || 0),
      wine: acc.wine + (day.wineSales || 0)
    }),
    { food: 0, bar: 0, wine: 0 }
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
      currentTotals[key as keyof CategorySales] *= proRateFactor;
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

  // Calculate metrics for each category
  const categories: (keyof CategorySales)[] = ['food', 'bar', 'wine'];
  const result = {} as Record<keyof CategorySales, CategoryMetricResult>;

  categories.forEach(category => {
    const currentValue = currentTotals[category];
    const previousValue = previousTotals[category];
    const percentageOfTotal = (currentValue / currentTotal) * 100;
    const previousPercentageOfTotal = (previousValue / previousTotal) * 100;

    result[category] = {
      currentValue,
      previousValue,
      percentageOfTotal: Number.isFinite(percentageOfTotal) ? percentageOfTotal : 0,
      previousPercentageOfTotal: Number.isFinite(previousPercentageOfTotal) ? previousPercentageOfTotal : 0,
      percentageChange: calculatePercentageChange(currentValue, previousValue),
      percentagePointChange: calculatePercentagePointChange(percentageOfTotal, previousPercentageOfTotal)
    };
  });

  return result;
}

function createEmptyMetric(): CategoryMetricResult {
  return {
    currentValue: 0,
    previousValue: 0,
    percentageOfTotal: 0,
    previousPercentageOfTotal: 0,
    percentageChange: 0,
    percentagePointChange: 0
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
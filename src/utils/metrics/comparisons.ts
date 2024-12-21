import { AggregatedMetrics, MetricCalculation } from '../../types/metrics';

export function calculateMetricComparison(
  current: number,
  previous: number,
  isProjected: boolean = false,
  completionRate?: number
): MetricCalculation {
  const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
  
  return {
    current,
    previous,
    change,
    isPositive: change > 0,
    isProjected,
    completionRate
  };
}

export function compareAggregatedMetrics(
  current: AggregatedMetrics,
  previous: AggregatedMetrics
): Record<string, MetricCalculation> {
  return {
    totalSales: calculateMetricComparison(
      current.totalSales,
      previous.totalSales,
      current.isPartialPeriod,
      current.completedDays / current.daysInPeriod
    ),
    averageDailySales: calculateMetricComparison(
      current.averageDailySales,
      previous.averageDailySales,
      current.isPartialPeriod
    ),
    totalCustomers: calculateMetricComparison(
      current.totalCustomers,
      previous.totalCustomers,
      current.isPartialPeriod,
      current.completedDays / current.daysInPeriod
    ),
    categorySales: {
      food: calculateMetricComparison(
        current.categorySales.food,
        previous.categorySales.food,
        current.isPartialPeriod
      ),
      bar: calculateMetricComparison(
        current.categorySales.bar,
        previous.categorySales.bar,
        current.isPartialPeriod
      ),
      wine: calculateMetricComparison(
        current.categorySales.wine,
        previous.categorySales.wine,
        current.isPartialPeriod
      )
    },
    timeBasedSales: {
      happyHour: calculateMetricComparison(
        current.timeBasedSales.happyHour,
        previous.timeBasedSales.happyHour,
        current.isPartialPeriod
      ),
      evening: calculateMetricComparison(
        current.timeBasedSales.evening,
        previous.timeBasedSales.evening,
        current.isPartialPeriod
      ),
      lateNight: calculateMetricComparison(
        current.timeBasedSales.lateNight,
        previous.timeBasedSales.lateNight,
        current.isPartialPeriod
      )
    },
    customerMetrics: {
      reservationRate: calculateMetricComparison(
        current.customerMetrics.reservationRate,
        previous.customerMetrics.reservationRate,
        current.isPartialPeriod
      ),
      noShowRate: calculateMetricComparison(
        current.customerMetrics.noShowRate,
        previous.customerMetrics.noShowRate,
        current.isPartialPeriod
      )
    },
    serviceMetrics: {
      answerRate: calculateMetricComparison(
        current.serviceMetrics.answerRate,
        previous.serviceMetrics.answerRate,
        current.isPartialPeriod
      )
    }
  };
}
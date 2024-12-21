import { useMemo } from 'react';
import { SalesData } from '../types/sales';
import { AggregatedMetrics, MetricCalculation } from '../types/metrics';
import { calculateDailyMetrics, aggregateMetrics } from '../utils/metrics/calculations';
import { compareAggregatedMetrics } from '../utils/metrics/comparisons';

export function useMetricsComparison(
  currentPeriodData: SalesData[],
  previousPeriodData: SalesData[]
) {
  const currentDailyMetrics = useMemo(() => 
    currentPeriodData.map(calculateDailyMetrics),
    [currentPeriodData]
  );

  const previousDailyMetrics = useMemo(() => 
    previousPeriodData.map(calculateDailyMetrics),
    [previousPeriodData]
  );

  const currentAggregated = useMemo(() => 
    aggregateMetrics(currentDailyMetrics, true),
    [currentDailyMetrics]
  );

  const previousAggregated = useMemo(() => 
    aggregateMetrics(previousDailyMetrics, false),
    [previousDailyMetrics]
  );

  const comparisons = useMemo(() => 
    compareAggregatedMetrics(currentAggregated, previousAggregated),
    [currentAggregated, previousAggregated]
  );

  return {
    currentMetrics: currentAggregated,
    previousMetrics: previousAggregated,
    comparisons,
    isPartialPeriod: currentAggregated.isPartialPeriod,
    completionRate: currentAggregated.completedDays / currentAggregated.daysInPeriod
  };
}
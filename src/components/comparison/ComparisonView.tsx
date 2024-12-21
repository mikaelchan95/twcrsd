import React, { useState, useMemo } from 'react';
import { SalesData } from '../../types/sales';
import { ComparisonPeriodType } from '../../types/comparison';
import { groupDataByPeriod, calculatePeriodStats } from '../../utils/comparisonUtils';
import PeriodSelector from './PeriodSelector';
import ComparisonMetrics from './ComparisonMetrics';
import ComparisonChart from './ComparisonChart';
import ComparisonDetails from './ComparisonDetails';

interface Props {
  data: SalesData[];
}

export default function ComparisonView({ data }: Props) {
  const [periodType, setPeriodType] = useState<ComparisonPeriodType>('month');
  
  // Group data by period type
  const groupedData = useMemo(() => groupDataByPeriod(data, periodType), [data, periodType]);
  const periods = useMemo(() => Object.keys(groupedData).sort(), [groupedData]);
  
  // Initialize selected periods
  const [period1, setPeriod1] = useState(periods[periods.length - 2] || '');
  const [period2, setPeriod2] = useState(periods[periods.length - 1] || '');

  // Calculate stats for selected periods
  const period1Stats = useMemo(
    () => calculatePeriodStats(groupedData[period1] || []),
    [groupedData, period1]
  );
  
  const period2Stats = useMemo(
    () => calculatePeriodStats(groupedData[period2] || []),
    [groupedData, period2]
  );

  if (periods.length < 2) {
    return (
      <div className="p-6 text-center text-gray-500">
        Not enough data for comparison. Please add more sales data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Comparative Analysis</h2>
          <PeriodSelector
            periodType={periodType}
            setPeriodType={setPeriodType}
            period1={period1}
            period2={period2}
            setPeriod1={setPeriod1}
            setPeriod2={setPeriod2}
            availablePeriods={periods}
          />
        </div>

        <ComparisonMetrics
          period1={period1Stats}
          period2={period2Stats}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComparisonChart
          period1={period1Stats}
          period2={period2Stats}
        />
        <ComparisonDetails
          period1={period1Stats}
          period2={period2Stats}
        />
      </div>
    </div>
  );
}
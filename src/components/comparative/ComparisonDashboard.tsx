import React, { useState, useMemo } from 'react';
import { SalesData } from '../../types/sales';
import { format } from 'date-fns';
import { groupDataByMonth, groupDataByQuarter, getMonthStats } from '../../utils/dataUtils';
import PeriodSelector from './PeriodSelector';
import ComparisonMetrics from './ComparisonMetrics';
import ComparisonChart from './ComparisonChart';
import ComparisonTable from './ComparisonTable';

interface Props {
  data: SalesData[];
}

export default function ComparisonDashboard({ data }: Props) {
  const [comparisonType, setComparisonType] = useState<'month' | 'quarter'>('month');
  
  // Group data by both month and quarter
  const monthlyData = useMemo(() => groupDataByMonth(data), [data]);
  const quarterlyData = useMemo(() => groupDataByQuarter(data), [data]);
  
  // Get available periods based on comparison type
  const availablePeriods = useMemo(() => {
    const periods = Object.keys(comparisonType === 'month' ? monthlyData : quarterlyData).sort();
    return periods;
  }, [monthlyData, quarterlyData, comparisonType]);
  
  const [period1, setPeriod1] = useState(availablePeriods[availablePeriods.length - 2] || '');
  const [period2, setPeriod2] = useState(availablePeriods[availablePeriods.length - 1] || '');

  // Get data for selected periods
  const period1Data = useMemo(() => 
    (comparisonType === 'month' ? monthlyData : quarterlyData)[period1] || [],
    [monthlyData, quarterlyData, period1, comparisonType]
  );

  const period2Data = useMemo(() => 
    (comparisonType === 'month' ? monthlyData : quarterlyData)[period2] || [],
    [monthlyData, quarterlyData, period2, comparisonType]
  );
  
  // Calculate stats for selected periods
  const period1Stats = useMemo(() => 
    getMonthStats(period1Data),
    [period1Data]
  );

  const period2Stats = useMemo(() => 
    getMonthStats(period2Data),
    [period2Data]
  );

  const formatPeriodLabel = (period: string) => {
    if (comparisonType === 'month') {
      const [year, month] = period.split('-');
      return format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM yyyy');
    }
    return period; // For quarters, keep the format as is (e.g., "2024-Q1")
  };

  if (!period1 || !period2) {
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
            comparisonType={comparisonType}
            setComparisonType={setComparisonType}
            period1={period1}
            period2={period2}
            setPeriod1={setPeriod1}
            setPeriod2={setPeriod2}
            availablePeriods={availablePeriods}
            formatPeriodLabel={formatPeriodLabel}
          />
        </div>

        <ComparisonMetrics
          period1={{
            label: formatPeriodLabel(period1),
            stats: period1Stats
          }}
          period2={{
            label: formatPeriodLabel(period2),
            stats: period2Stats
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComparisonChart
          period1Data={period1Data}
          period2Data={period2Data}
          period1Label={formatPeriodLabel(period1)}
          period2Label={formatPeriodLabel(period2)}
        />
        <ComparisonTable
          period1={{
            label: formatPeriodLabel(period1),
            data: period1Data,
            stats: period1Stats
          }}
          period2={{
            label: formatPeriodLabel(period2),
            data: period2Data,
            stats: period2Stats
          }}
        />
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { SalesData } from '../../types/sales';
import { ComparisonPeriodType } from '../../types/comparison';
import { groupDataByPeriod, calculatePeriodStats } from '../../utils/comparisonUtils';
import PeriodSelector from './PeriodSelector';
import ComparisonMetrics from './ComparisonMetrics';
import ComparisonChart from './ComparisonChart';
import CategoryComparison from './metrics/CategoryComparison';
import TimeBasedComparison from './metrics/TimeBasedComparison';
import ServiceMetricsComparison from './metrics/ServiceMetricsComparison';

interface Props {
  data: SalesData[];
}

export default function ComparisonDashboard({ data }: Props) {
  const [periodType, setPeriodType] = useState<ComparisonPeriodType>('month');
  
  const groupedData = useMemo(() => 
    groupDataByPeriod(data, periodType), 
    [data, periodType]
  );
  
  const periods = useMemo(() => 
    Object.keys(groupedData).sort(),
    [groupedData]
  );
  
  const [period1, setPeriod1] = useState(periods[periods.length - 2] || '');
  const [period2, setPeriod2] = useState(periods[periods.length - 1] || '');

  const period1Stats = useMemo(() => 
    calculatePeriodStats(groupedData[period1] || []),
    [groupedData, period1]
  );

  const period2Stats = useMemo(() => 
    calculatePeriodStats(groupedData[period2] || []),
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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Comparative Analysis</h2>
            <div className="flex items-center mt-2 gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-600 mr-1"></div>
                <span className="text-sm font-medium text-gray-900">{period2Stats.label}</span>
                {period2Stats.isPartialPeriod && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({period2Stats.completedDays} of {period2Stats.daysInPeriod} days)
                  </span>
                )}
              </div>
              <span className="text-gray-400">vs</span>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
                <span className="text-sm text-gray-600">{period1Stats.label}</span>
              </div>
            </div>
          </div>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ComparisonChart
          period1Data={period1Stats.data}
          period2Data={period2Stats.data}
          period1Label={period1Stats.label}
          period2Label={period2Stats.label}
          currentPeriodColor="#4F46E5"
          previousPeriodColor="#9CA3AF"
        />
        <CategoryComparison
          period1Label={period1Stats.label}
          period2Label={period2Stats.label}
          period1Sales={period1Stats.categorySales}
          period2Sales={period2Stats.categorySales}
          isPartialPeriod={period2Stats.isPartialPeriod}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TimeBasedComparison
          period1Label={period1Stats.label}
          period2Label={period2Stats.label}
          period1Data={period1Stats.data}
          period2Data={period2Stats.data}
          isPartialPeriod={period2Stats.isPartialPeriod}
        />
        <ServiceMetricsComparison
          period1Label={period1Stats.label}
          period2Label={period2Stats.label}
          period1Metrics={period1Stats.serviceMetrics}
          period2Metrics={period2Stats.serviceMetrics}
        />
      </div>
    </div>
  );
}
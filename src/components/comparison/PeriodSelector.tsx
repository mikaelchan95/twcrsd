import React from 'react';
import { ComparisonPeriodType } from '../../types/comparison';
import { format } from 'date-fns';

interface Props {
  periodType: ComparisonPeriodType;
  setPeriodType: (type: ComparisonPeriodType) => void;
  period1: string;
  period2: string;
  setPeriod1: (period: string) => void;
  setPeriod2: (period: string) => void;
  availablePeriods: string[];
}

export default function PeriodSelector({
  periodType,
  setPeriodType,
  period1,
  period2,
  setPeriod1,
  setPeriod2,
  availablePeriods
}: Props) {
  const formatPeriodLabel = (period: string) => {
    if (periodType === 'month') {
      const [year, month] = period.split('-');
      return format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM yyyy');
    }
    const [year, quarter] = period.split('-Q');
    return `Q${quarter} ${year}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <select
        value={periodType}
        onChange={(e) => setPeriodType(e.target.value as ComparisonPeriodType)}
        className="w-full sm:w-auto rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
      >
        <option value="month">Monthly Comparison</option>
        <option value="quarter">Quarterly Comparison</option>
      </select>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          value={period1}
          onChange={(e) => setPeriod1(e.target.value)}
          className="w-full sm:w-auto rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        >
          {availablePeriods.map(period => (
            <option key={period} value={period}>
              {formatPeriodLabel(period)}
            </option>
          ))}
        </select>
        <span className="text-gray-500">vs</span>
        <select
          value={period2}
          onChange={(e) => setPeriod2(e.target.value)}
          className="w-full sm:w-auto rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        >
          {availablePeriods.map(period => (
            <option key={period} value={period}>
              {formatPeriodLabel(period)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
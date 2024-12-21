import React from 'react';

interface Props {
  comparisonType: 'month' | 'quarter';
  setComparisonType: (type: 'month' | 'quarter') => void;
  period1: string;
  period2: string;
  setPeriod1: (period: string) => void;
  setPeriod2: (period: string) => void;
  availablePeriods: string[];
  formatPeriodLabel: (period: string) => string;
}

export default function PeriodSelector({
  comparisonType,
  setComparisonType,
  period1,
  period2,
  setPeriod1,
  setPeriod2,
  availablePeriods,
  formatPeriodLabel
}: Props) {
  return (
    <div className="flex items-center space-x-4">
      <select
        value={comparisonType}
        onChange={(e) => setComparisonType(e.target.value as 'month' | 'quarter')}
        className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="month">Month</option>
        <option value="quarter">Quarter</option>
      </select>

      <div className="flex items-center space-x-2">
        <select
          value={period1}
          onChange={(e) => setPeriod1(e.target.value)}
          className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
          className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
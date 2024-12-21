import React from 'react';
import { SalesData } from '../../types/sales';
import { groupDataByYear, getYearlyStats } from '../../utils/dataUtils';
import YearlySummary from './YearlySummary';
import YearlyTrends from './YearlyTrends';
import YearlyCategories from './YearlyCategories';
import YearlyQuarters from './YearlyQuarters';
import { Card } from '../ui/card';

interface Props {
  data: SalesData[];
}

export default function YearlyDashboard({ data }: Props) {
  const yearlyData = groupDataByYear(data);
  const years = Object.keys(yearlyData).sort().reverse();
  const currentYear = years[0];
  const previousYear = years[1];

  const currentYearStats = getYearlyStats(yearlyData[currentYear]);
  const previousYearStats = previousYear ? getYearlyStats(yearlyData[previousYear]) : null;

  return (
    <div className="space-y-6">
      <YearlySummary 
        stats={currentYearStats} 
        previousYearStats={previousYearStats}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YearlyTrends data={yearlyData[currentYear]} />
        <YearlyCategories data={yearlyData[currentYear]} />
      </div>

      <YearlyQuarters data={yearlyData[currentYear]} />
    </div>
  );
}
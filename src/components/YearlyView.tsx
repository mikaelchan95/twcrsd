import React from 'react';
import { SalesData } from '../types/sales';
import { groupDataByYear, getYearlyStats } from '../utils/dataUtils';
import YearlyOverview from './yearly/YearlyOverview';
import YearlyTrends from './yearly/YearlyTrends';
import YearlyCategories from './yearly/YearlyCategories';
import YearlyQuarters from './yearly/YearlyQuarters';
import YearlyComparison from './yearly/YearlyComparison';
import YearlyPerformance from './yearly/YearlyPerformance';
import YearlyCustomerMetrics from './yearly/YearlyCustomerMetrics';
import YearlyPaymentAnalysis from './yearly/YearlyPaymentAnalysis';
import YearlyServiceMetrics from './yearly/YearlyServiceMetrics';

interface Props {
  data: SalesData[];
}

export default function YearlyView({ data }: Props) {
  const yearlyData = groupDataByYear(data);
  const years = Object.keys(yearlyData).sort().reverse();
  const currentYear = years[0];
  const previousYear = years[1];

  const currentYearStats = getYearlyStats(yearlyData[currentYear]);
  const previousYearStats = previousYear ? getYearlyStats(yearlyData[previousYear]) : null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <YearlyOverview 
        stats={currentYearStats} 
        previousYearStats={previousYearStats}
        year={currentYear}
      />

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YearlyTrends data={yearlyData[currentYear]} />
        <YearlyPerformance 
          currentYearData={yearlyData[currentYear]}
          previousYearData={yearlyData[previousYear] || []}
        />
      </div>

      {/* Quarterly Analysis */}
      <YearlyQuarters 
        data={yearlyData[currentYear]} 
        previousYearData={yearlyData[previousYear] || []}
      />

      {/* Category and Customer Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YearlyCategories 
          data={yearlyData[currentYear]}
          previousYearData={yearlyData[previousYear] || []}
        />
        <YearlyCustomerMetrics 
          data={yearlyData[currentYear]}
          previousYearData={yearlyData[previousYear] || []}
        />
      </div>

      {/* Payment and Service Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YearlyPaymentAnalysis 
          data={yearlyData[currentYear]}
          previousYearData={yearlyData[previousYear] || []}
        />
        <YearlyServiceMetrics 
          data={yearlyData[currentYear]}
          previousYearData={yearlyData[previousYear] || []}
        />
      </div>

      {/* Year-over-Year Comparison */}
      {years.length > 1 && (
        <YearlyComparison 
          years={years} 
          yearlyData={yearlyData} 
        />
      )}
    </div>
  );
}
import React from 'react';
import { YearlyStats } from '../../types/sales';
import SalesMetrics from '../SalesMetrics';

interface Props {
  stats: YearlyStats;
  previousYearStats: YearlyStats | null;
}

export default function YearlySummary({ stats, previousYearStats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SalesMetrics
        title="Total Revenue"
        value={stats.totalSales}
        previousValue={previousYearStats?.totalSales}
        type="currency"
      />
      <SalesMetrics
        title="Average Monthly Sales"
        value={stats.averageMonthlySales}
        previousValue={previousYearStats?.averageMonthlySales}
        type="currency"
      />
      <SalesMetrics
        title="Total Customers"
        value={stats.totalCustomers}
        previousValue={previousYearStats?.totalCustomers}
        type="number"
        perCustomer={stats.averagePerCustomer}
      />
      <SalesMetrics
        title="Reservation Rate"
        value={stats.reservationRate}
        previousValue={previousYearStats?.reservationRate}
        type="percentage"
        subtitle={`${stats.noShowRate.toFixed(1)}% no-show rate`}
      />
    </div>
  );
}
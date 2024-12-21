import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '../utils/dataUtils';
import { MonthlyStats, QuarterlyStats } from '../types/sales';

interface ComparisonMetricsProps {
  period1: string;
  period2: string;
  period1Stats: MonthlyStats | QuarterlyStats;
  period2Stats: MonthlyStats | QuarterlyStats;
}

export default function ComparisonMetrics({
  period1,
  period2,
  period1Stats,
  period2Stats
}: ComparisonMetricsProps) {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">{period1}</div>
              <div className="text-2xl font-bold">{formatCurrency(period1Stats.totalSales)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{period2}</div>
              <div className="text-2xl font-bold">{formatCurrency(period2Stats.totalSales)}</div>
            </div>
            <div className="text-sm">
              Change: {calculateChange(period2Stats.totalSales, period1Stats.totalSales).toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">{period1}</div>
              <div className="text-2xl font-bold">{period1Stats.totalCustomers}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{period2}</div>
              <div className="text-2xl font-bold">{period2Stats.totalCustomers}</div>
            </div>
            <div className="text-sm">
              Change: {calculateChange(period2Stats.totalCustomers, period1Stats.totalCustomers).toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Per Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">{period1}</div>
              <div className="text-2xl font-bold">{formatCurrency(period1Stats.averagePerCustomer)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{period2}</div>
              <div className="text-2xl font-bold">{formatCurrency(period2Stats.averagePerCustomer)}</div>
            </div>
            <div className="text-sm">
              Change: {calculateChange(period2Stats.averagePerCustomer, period1Stats.averagePerCustomer).toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
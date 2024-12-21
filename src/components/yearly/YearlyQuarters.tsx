import React from 'react';
import { SalesData } from '../../types/sales';
import { getQuarterlyStats } from '../../utils/dataUtils';
import { formatCurrency } from '../../utils/currencyUtils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
  data: SalesData[];
}

export default function YearlyQuarters({ data }: Props) {
  const quarterlyStats = getQuarterlyStats(data);
  const quarters = Object.keys(quarterlyStats).sort();
  const totalSales = Object.values(quarterlyStats)
    .reduce((sum, q) => sum + q.totalSales, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quarterly Performance</CardTitle>
        <CardDescription>Breakdown of sales and metrics by quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quarters.map(quarter => {
            const stats = quarterlyStats[quarter];
            const percentage = (stats.totalSales / totalSales) * 100;
            
            return (
              <div key={quarter} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{quarter}</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalSales)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {percentage.toFixed(1)}% of yearly sales
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <p className="font-medium text-gray-900">
                      {stats.totalCustomers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average per Customer</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(stats.averagePerCustomer)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reservation Rate</p>
                    <p className="font-medium text-gray-900">
                      {stats.reservationRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
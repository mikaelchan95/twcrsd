import React from 'react';
import { SalesData, MonthlyStats } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface PeriodData {
  label: string;
  data: SalesData[];
  stats: MonthlyStats;
}

interface Props {
  period1: PeriodData;
  period2: PeriodData;
}

export default function ComparisonTable({ period1, period2 }: Props) {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      category: 'Sales',
      items: [
        {
          label: 'Total Sales',
          value1: period1.stats.totalSales,
          value2: period2.stats.totalSales,
          format: formatCurrency
        },
        {
          label: 'Best Day Sales',
          value1: period1.stats.bestDay.totalSales,
          value2: period2.stats.bestDay.totalSales,
          format: formatCurrency
        },
        {
          label: 'Average Daily Sales',
          value1: period1.stats.totalSales / period1.data.length,
          value2: period2.stats.totalSales / period2.data.length,
          format: formatCurrency
        }
      ]
    },
    {
      category: 'Customers',
      items: [
        {
          label: 'Total Customers',
          value1: period1.stats.totalCustomers,
          value2: period2.stats.totalCustomers,
          format: (val: number) => val.toLocaleString()
        },
        {
          label: 'Average per Customer',
          value1: period1.stats.averagePerCustomer,
          value2: period2.stats.averagePerCustomer,
          format: formatCurrency
        },
        {
          label: 'Reservation Rate',
          value1: period1.stats.reservationRate,
          value2: period2.stats.reservationRate,
          format: (val: number) => `${val.toFixed(1)}%`
        },
        {
          label: 'No-show Rate',
          value1: period1.stats.noShowRate,
          value2: period2.stats.noShowRate,
          format: (val: number) => `${val.toFixed(1)}%`
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200">
          {metrics.map(section => (
            <div key={section.category} className="py-4 first:pt-0 last:pb-0">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {section.category}
              </h3>
              <div className="space-y-3">
                {section.items.map(item => {
                  const change = calculateChange(item.value2, item.value1);
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-900">
                          {item.format(item.value2)}
                        </span>
                        <span className={`text-sm ${
                          change > 0 ? 'text-green-600' : 
                          change < 0 ? 'text-red-600' : 
                          'text-gray-500'
                        }`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
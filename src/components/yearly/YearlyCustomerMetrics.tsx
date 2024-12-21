import React from 'react';
import { SalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, UserCheck, UserX, DollarSign } from 'lucide-react';

interface Props {
  data: SalesData[];
  previousYearData: SalesData[];
}

export default function YearlyCustomerMetrics({ data, previousYearData }: Props) {
  const calculateMetrics = (salesData: SalesData[]) => {
    const totalCustomers = salesData.reduce((sum, day) => sum + day.totalPax, 0);
    const totalSales = salesData.reduce((sum, day) => sum + day.totalSales, 0);
    const totalReservations = salesData.reduce((sum, day) => sum + (day.reservations || 0), 0);
    const totalNoShows = salesData.reduce((sum, day) => sum + (day.noShows || 0), 0);

    return {
      totalCustomers,
      averageSpend: totalCustomers ? totalSales / totalCustomers : 0,
      reservationRate: totalCustomers ? (totalReservations / totalCustomers) * 100 : 0,
      noShowRate: totalReservations ? (totalNoShows / totalReservations) * 100 : 0
    };
  };

  const currentMetrics = calculateMetrics(data);
  const previousMetrics = calculateMetrics(previousYearData);

  const metrics = [
    {
      title: 'Total Customers',
      current: currentMetrics.totalCustomers,
      previous: previousMetrics.totalCustomers,
      format: (val: number) => val.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Average Spend',
      current: currentMetrics.averageSpend,
      previous: previousMetrics.averageSpend,
      format: formatCurrency,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Reservation Rate',
      current: currentMetrics.reservationRate,
      previous: previousMetrics.reservationRate,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'No-show Rate',
      current: currentMetrics.noShowRate,
      previous: previousMetrics.noShowRate,
      format: (val: number) => `${val.toFixed(1)}%`,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map(({ title, current, previous, format, icon: Icon, color, bgColor }) => {
            const change = previous ? ((current - previous) / previous) * 100 : 0;
            
            return (
              <div key={title} className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  {change !== 0 && (
                    <span className={`text-sm font-medium ${
                      change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{format(current)}</p>
                {previous !== undefined && (
                  <p className="mt-1 text-sm text-gray-500">
                    vs {format(previous)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
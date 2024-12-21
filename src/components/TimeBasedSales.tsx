import React from 'react';
import { SalesData } from '../types/sales';
import { formatCurrency } from '../utils/currencyUtils';
import { Clock, Sunset, Moon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Props {
  data: SalesData[];
}

export default function TimeBasedSales({ data }: Props) {
  const timeSlots = [
    {
      name: 'Happy Hour',
      key: 'happyHourSales',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      barColor: 'bg-yellow-600'
    },
    {
      name: '7PM - 10PM',
      key: 'salesFrom7pmTo10pm',
      icon: Sunset,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      barColor: 'bg-orange-600'
    },
    {
      name: 'After 10PM',
      key: 'after10pmSales',
      icon: Moon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      barColor: 'bg-indigo-600'
    }
  ];

  const totals = data.reduce((acc, day) => ({
    happyHourSales: acc.happyHourSales + (day.happyHourSales || 0),
    salesFrom7pmTo10pm: acc.salesFrom7pmTo10pm + (day.salesFrom7pmTo10pm || 0),
    after10pmSales: acc.after10pmSales + (day.after10pmSales || 0)
  }), {
    happyHourSales: 0,
    salesFrom7pmTo10pm: 0,
    after10pmSales: 0
  });

  const totalSales = Object.values(totals).reduce((sum, val) => sum + val, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time-based Sales</CardTitle>
        <CardDescription>Monthly sales breakdown by time period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeSlots.map(({ name, key, icon: Icon, color, bgColor, barColor }) => {
            const amount = totals[key as keyof typeof totals];
            const percentage = totalSales > 0 ? (amount / totalSales) * 100 : 0;
            
            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <span className="font-medium text-gray-900">{name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(amount)}</p>
                    <p className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
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
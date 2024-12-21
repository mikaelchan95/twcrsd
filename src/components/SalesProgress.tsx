import React from 'react';
import { SalesData } from '../types/sales';
import { formatCurrency } from '../utils/currencyUtils';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { calculateBusinessDays, calculateDailyTarget } from '../utils/businessDays';
import { useSettings } from '../hooks/useSettings';

interface Props {
  data: SalesData[];
}

export default function SalesProgress({ data }: Props) {
  const { settings } = useSettings();
  const monthlyTarget = settings.targets.monthlySales;

  // Calculate business days
  const businessDays = calculateBusinessDays(data, {
    excludeSundays: true,
    // Add any special dates if needed
    // excludeCustomDates: ['2024-01-01'],
    // includeSpecialDates: ['2024-12-25']
  });

  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);
  const dailyTarget = calculateDailyTarget(
    monthlyTarget,
    businessDays.workingDays,
    businessDays.actualWorkingDays,
    totalSales
  );

  const targetProgress = (totalSales / monthlyTarget) * 100;
  const daysProgress = (businessDays.actualWorkingDays / businessDays.workingDays) * 100;

  const metrics = [
    {
      name: 'Current Sales',
      value: totalSales,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      barColor: 'bg-blue-600',
      percentage: targetProgress,
      subtitle: `${targetProgress.toFixed(1)}% of monthly target`
    },
    {
      name: 'Daily Target',
      value: dailyTarget,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      subtitle: businessDays.remainingWorkingDays === 0 
        ? 'Month completed'
        : `${businessDays.remainingWorkingDays} working day${businessDays.remainingWorkingDays !== 1 ? 's' : ''} remaining`
    },
    {
      name: 'Working Days',
      value: businessDays.actualWorkingDays,
      total: businessDays.workingDays,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      barColor: 'bg-green-600',
      percentage: daysProgress,
      subtitle: `${businessDays.workingDays} total working days`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map(({ name, value, total, icon: Icon, color, bgColor, barColor, percentage, subtitle }) => (
            <div key={name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{name}</span>
                    {subtitle && (
                      <p className="text-sm text-gray-500">{subtitle}</p>
                    )}
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  {name === 'Working Days' 
                    ? `${value} / ${total}`
                    : formatCurrency(value)
                  }
                </p>
              </div>
              
              {percentage !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Monthly Target</span>
              <span>{formatCurrency(monthlyTarget)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
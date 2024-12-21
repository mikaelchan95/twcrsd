import React from 'react';
import { TimeBasedSales } from '../../../types/comparison';
import { formatCurrency } from '../../../utils/currencyUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Clock, Sunset, Moon } from 'lucide-react';
import { calculateTimeBasedMetrics } from '../../../utils/metrics/timeBasedMetrics';

interface Props {
  period1Label: string;
  period2Label: string;
  period1Data: SalesData[];
  period2Data: SalesData[];
  isPartialPeriod: boolean;
}

export default function TimeBasedComparison({
  period1Label,
  period2Label,
  period1Data,
  period2Data,
  isPartialPeriod
}: Props) {
  const metrics = calculateTimeBasedMetrics(period2Data, period1Data, isPartialPeriod);

  const timeSlots = [
    { 
      key: 'happyHour' as keyof TimeBasedSales, 
      label: 'Happy Hour', 
      icon: Clock, 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-yellow-600'
    },
    { 
      key: 'evening' as keyof TimeBasedSales, 
      label: '7PM - 10PM', 
      icon: Sunset, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600'
    },
    { 
      key: 'lateNight' as keyof TimeBasedSales, 
      label: 'After 10PM', 
      icon: Moon, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-50',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-indigo-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time-based Sales Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {timeSlots.map(({ key, label, icon: Icon, color, bgColor, gradientFrom, gradientTo }) => {
            const metric = metrics[key];
            
            return (
              <div key={key} className={`${bgColor} rounded-lg p-4 relative overflow-hidden`}>
                {isPartialPeriod && (
                  <div className="absolute top-0 right-0">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-gray-500 bg-white/90 rounded-bl-lg">
                      Projected
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-white/90 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${color}`}>
                        {metric.percentageOfTotal.toFixed(1)}%
                      </span>
                      {metric.percentagePointChange !== 0 && (
                        <span className={`ml-1 text-xs font-medium ${
                          metric.percentagePointChange > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({metric.percentagePointChange > 0 ? '+' : ''}
                          {metric.percentagePointChange.toFixed(1)}pp)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(metric.currentValue)}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">
                        vs {formatCurrency(metric.previousValue)}
                      </span>
                      <span className={`text-sm font-medium ${
                        metric.percentageChange > 0 ? 'text-green-600' : 
                        metric.percentageChange < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {metric.percentageChange > 0 ? '+' : ''}
                        {metric.percentageChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Daily Avg: {formatCurrency(metric.dailyAverage)}
                    <span className="text-xs ml-1">
                      vs {formatCurrency(metric.previousDailyAverage)}
                    </span>
                  </div>

                  <div className="relative pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
                        style={{ width: `${metric.percentageOfTotal}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
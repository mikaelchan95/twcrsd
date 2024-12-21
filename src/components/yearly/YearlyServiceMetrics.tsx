import React from 'react';
import { SalesData } from '../../types/sales';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Phone, PhoneOff, TrendingUp } from 'lucide-react';

interface Props {
  data: SalesData[];
  previousYearData: SalesData[];
}

export default function YearlyServiceMetrics({ data, previousYearData }: Props) {
  const calculateServiceMetrics = (salesData: SalesData[]) => {
    const totals = salesData.reduce((acc, day) => ({
      answered: acc.answered + (day.phoneCallsAnswered || 0),
      missed: acc.missed + (day.missedPhoneCalls || 0)
    }), { answered: 0, missed: 0 });

    const total = totals.answered + totals.missed;
    return {
      ...totals,
      total,
      answerRate: total > 0 ? (totals.answered / total) * 100 : 0
    };
  };

  const currentMetrics = calculateServiceMetrics(data);
  const previousMetrics = calculateServiceMetrics(previousYearData);

  const metrics = [
    {
      title: 'Answered Calls',
      current: currentMetrics.answered,
      previous: previousMetrics.answered,
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Missed Calls',
      current: currentMetrics.missed,
      previous: previousMetrics.missed,
      icon: PhoneOff,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Answer Rate',
      current: currentMetrics.answerRate,
      previous: previousMetrics.answerRate,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      isPercentage: true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {metrics.map(({ title, current, previous, icon: Icon, color, bgColor, isPercentage }) => {
            const change = previous ? ((current - previous) / previous) * 100 : 0;
            const value = isPercentage ? `${current.toFixed(1)}%` : current.toLocaleString();
            const previousValue = isPercentage ? `${previous.toFixed(1)}%` : previous.toLocaleString();

            return (
              <div key={title} className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{title}</p>
                      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {change !== 0 && (
                        <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      vs {previousValue}
                    </p>
                  </div>
                </div>

                {/* Progress bar for answer rate */}
                {title === 'Answer Rate' && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${currentMetrics.answerRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Monthly Trend */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total Calls</span>
              <span>{currentMetrics.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Daily Average</span>
              <span>
                {(currentMetrics.total / (data.length || 1)).toFixed(1)} calls/day
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { ServiceMetrics } from '../../../types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Phone, PhoneOff } from 'lucide-react';

interface Props {
  period1Label: string;
  period2Label: string;
  period1Metrics: ServiceMetrics;
  period2Metrics: ServiceMetrics;
}

export default function ServiceMetricsComparison({
  period1Label,
  period2Label,
  period1Metrics,
  period2Metrics
}: Props) {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const calculateDailyAverage = (metrics: ServiceMetrics, days: number) => ({
    answered: Math.round(metrics.phoneCallsAnswered / days),
    missed: Math.round(metrics.missedPhoneCalls / days)
  });

  const metrics = [
    {
      key: 'phoneCallsAnswered',
      label: 'Answered Calls',
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'missedPhoneCalls',
      label: 'Missed Calls',
      icon: PhoneOff,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const answerRateChange = calculateChange(period2Metrics.answerRate, period1Metrics.answerRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Metrics Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map(({ key, label, icon: Icon, color, bgColor }) => {
              const value1 = period1Metrics[key as keyof ServiceMetrics];
              const value2 = period2Metrics[key as keyof ServiceMetrics];
              const change = calculateChange(value2, value1);

              return (
                <div key={key} className={`${bgColor} rounded-lg p-4 relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-white/80 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-900 mt-2">{label}</h3>
                  <div className="mt-1">
                    <div className="text-2xl font-bold text-gray-900">
                      {value2.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1 space-x-1 text-sm">
                      <span className="text-gray-500">vs</span>
                      <span className="text-gray-900 font-medium">
                        {value1.toLocaleString()}
                      </span>
                      <span className={`${change > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                        ({change > 0 ? '+' : ''}{change.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`bg-gray-50 rounded-lg p-4 relative overflow-hidden`}>
            <h3 className="text-sm font-medium text-gray-900">Answer Rate</h3>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-gray-900">
                  {period2Metrics.answerRate.toFixed(1)}%
                </div>
                <span className={`text-sm font-medium ${
                  answerRateChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {answerRateChange > 0 ? '+' : ''}{answerRateChange.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${period2Metrics.answerRate}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                vs {period1Metrics.answerRate.toFixed(1)}% in {period1Label}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
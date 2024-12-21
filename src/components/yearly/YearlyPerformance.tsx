import React from 'react';
import { SalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, Target, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Props {
  currentYearData: SalesData[];
  previousYearData: SalesData[];
}

export default function YearlyPerformance({ currentYearData, previousYearData }: Props) {
  const calculatePerformanceMetrics = (data: SalesData[]) => {
    if (!data.length) return { totalSales: 0, bestDay: null, worstDay: null };

    const bestDay = data.reduce((best, current) => 
      current.totalSales > (best?.totalSales || 0) ? current : best
    );

    const worstDay = data.reduce((worst, current) => 
      current.totalSales < (worst?.totalSales || Infinity) ? current : worst
    );

    return {
      totalSales: data.reduce((sum, day) => sum + day.totalSales, 0),
      bestDay,
      worstDay
    };
  };

  const currentMetrics = calculatePerformanceMetrics(currentYearData);
  const previousMetrics = calculatePerformanceMetrics(previousYearData);

  const yearOverYear = previousMetrics.totalSales 
    ? ((currentMetrics.totalSales - previousMetrics.totalSales) / previousMetrics.totalSales) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Year-over-Year Growth</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {yearOverYear >= 0 ? '+' : ''}{yearOverYear.toFixed(1)}%
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                yearOverYear >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {yearOverYear >= 0 
                  ? <TrendingUp className="h-6 w-6 text-green-600" />
                  : <TrendingDown className="h-6 w-6 text-red-600" />
                }
              </div>
            </div>
          </div>

          {currentMetrics.bestDay && (
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Best Day</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {formatCurrency(currentMetrics.bestDay.totalSales)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {format(parseISO(currentMetrics.bestDay.date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-600">Monthly Performance</h4>
            <div className="flex items-center space-x-4">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Previous Year</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatCurrency(previousMetrics.totalSales / 12)}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Year</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatCurrency(currentMetrics.totalSales / 
                    (new Set(currentYearData.map(d => format(parseISO(d.date), 'M'))).size))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
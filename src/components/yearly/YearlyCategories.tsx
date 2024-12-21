import React from 'react';
import { SalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Wine, Beer, Utensils } from 'lucide-react';
import { useYearlyAnalytics } from '../../hooks/useYearlyAnalytics';

interface Props {
  data: SalesData[];
  previousYearData: SalesData[];
}

export default function YearlyCategories({ data, previousYearData }: Props) {
  const year = data.length > 0 ? new Date(data[0].date).getFullYear().toString() : '';
  const { analytics, previousYearAnalytics, growth } = useYearlyAnalytics(data, year);

  if (!analytics) return null;

  const categories = [
    {
      name: 'Food',
      value: analytics.categorySales.food,
      previousValue: previousYearAnalytics?.categorySales.food,
      icon: Utensils,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      barColor: 'bg-orange-600'
    },
    {
      name: 'Bar',
      value: analytics.categorySales.bar,
      previousValue: previousYearAnalytics?.categorySales.bar,
      icon: Beer,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      barColor: 'bg-amber-600'
    },
    {
      name: 'Wine',
      value: analytics.categorySales.wine,
      previousValue: previousYearAnalytics?.categorySales.wine,
      icon: Wine,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      barColor: 'bg-purple-600'
    }
  ];

  const totalSales = Object.values(analytics.categorySales).reduce((sum, val) => sum + val, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map(({ name, value, previousValue, icon: Icon, color, bgColor, barColor }) => {
            const percentage = (value / totalSales) * 100;
            const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;

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
                    <p className="font-medium text-gray-900">{formatCurrency(value)}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${color}`}>
                        {percentage.toFixed(1)}%
                      </span>
                      {change !== 0 && (
                        <span className={`text-xs ${
                          change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({change > 0 ? '+' : ''}{change.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {previousValue && (
                  <p className="mt-1 text-sm text-gray-500">
                    vs {formatCurrency(previousValue)} last year
                  </p>
                )}
              </div>
            );
          })}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Revenue</span>
              <span className="font-medium text-gray-900">{formatCurrency(totalSales)}</span>
            </div>
            {previousYearAnalytics && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Year-over-Year Growth</span>
                <span className={`font-medium ${
                  growth?.salesGrowth && growth.salesGrowth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {growth?.salesGrowth && growth.salesGrowth > 0 ? '+' : ''}
                  {growth?.salesGrowth?.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
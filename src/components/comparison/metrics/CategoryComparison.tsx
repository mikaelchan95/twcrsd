import React from 'react';
import { CategorySales } from '../../../types/comparison';
import { formatCurrency } from '../../../utils/currencyUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Utensils, Beer, Wine } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
  period1Label: string;
  period2Label: string;
  period1Sales: CategorySales;
  period2Sales: CategorySales;
  isPartialPeriod: boolean;
}

interface CategoryConfig {
  key: keyof CategorySales;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function CategoryComparison({
  period1Label,
  period2Label,
  period1Sales,
  period2Sales,
  isPartialPeriod
}: Props) {
  const categories: CategoryConfig[] = [
    { 
      key: 'food', 
      label: 'Food', 
      icon: Utensils, 
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600'
    },
    { 
      key: 'bar', 
      label: 'Bar', 
      icon: Beer, 
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-amber-600'
    },
    { 
      key: 'wine', 
      label: 'Wine', 
      icon: Wine, 
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600'
    }
  ];

  const metrics = useMemo(() => {
    const totalCurrentSales = Object.values(period2Sales).reduce((sum, val) => sum + val, 0);
    const totalPreviousSales = Object.values(period1Sales).reduce((sum, val) => sum + val, 0);

    return categories.map(category => {
      const currentValue = period2Sales[category.key];
      const previousValue = period1Sales[category.key];
      const percentageOfTotal = (currentValue / totalCurrentSales) * 100;
      const previousPercentageOfTotal = (previousValue / totalPreviousSales) * 100;
      const percentageChange = previousValue !== 0 
        ? ((currentValue - previousValue) / previousValue) * 100
        : 0;
      const percentagePointChange = percentageOfTotal - previousPercentageOfTotal;

      return {
        ...category,
        currentValue,
        previousValue,
        percentageOfTotal,
        previousPercentageOfTotal,
        percentageChange,
        percentagePointChange
      };
    });
  }, [period1Sales, period2Sales]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Category Sales Comparison</CardTitle>
        {isPartialPeriod ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Projected
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Actual
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metrics.map(({ 
            key, 
            label, 
            icon: Icon, 
            color, 
            bgColor,
            gradientFrom,
            gradientTo,
            currentValue,
            previousValue,
            percentageOfTotal,
            percentageChange,
            percentagePointChange
          }) => (
            <div 
              key={key} 
              className={`${bgColor} rounded-lg p-4 relative overflow-hidden transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/90 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${color}`}>
                    {percentageOfTotal.toFixed(1)}%
                  </span>
                  {percentagePointChange !== 0 && (
                    <span className={`ml-1 text-xs font-medium ${
                      percentagePointChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ({percentagePointChange > 0 ? '+' : ''}
                      {percentagePointChange.toFixed(1)}pp)
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-900">{label}</h3>
              
              <div className="mt-2 space-y-2">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(currentValue)}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">vs {formatCurrency(previousValue)}</span>
                    <span className={`text-sm font-medium ${
                      percentageChange > 0 ? 'text-green-600' : 
                      percentageChange < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {percentageChange > 0 ? '+' : ''}
                      {percentageChange.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
                      style={{ width: `${percentageOfTotal}%` }}
                    />
                  </div>
                </div>
              </div>

              <div 
                className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-60"
                style={{ 
                  maskImage: 'linear-gradient(to right, transparent, black)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black)'
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
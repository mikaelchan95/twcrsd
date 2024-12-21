import React from 'react';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { SalesData } from '../../../types/sales';
import { formatCurrency } from '../../../utils/currencyUtils';
import { calculateBusinessDays, calculateMonthlyProjection } from '../../../utils/businessDays';

interface Props {
  data: SalesData[];
}

export default function AnalyticsActions({ data }: Props) {
  // Calculate business days and projections
  const businessDays = calculateBusinessDays(data, { excludeSundays: true });
  const {
    projection,
    dailyAverage,
    completionRate,
    isPartialMonth
  } = calculateMonthlyProjection(data);

  // Calculate total sales
  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <span className="block font-medium text-gray-900">Daily Average</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(dailyAverage)}
              </span>
              <span className="text-sm text-gray-500">
                per working day
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-sm text-gray-500">Working Days</span>
          <span className="font-medium text-gray-900">
            {businessDays.actualWorkingDays} / {businessDays.workingDays}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <span className="block font-medium text-gray-900">Monthly Projection</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(projection)}
              </span>
              {isPartialMonth && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Projected
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-sm text-gray-500">Completion</span>
          <span className="font-medium text-gray-900">
            {completionRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg">
            <AlertCircle className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <span className="block font-medium text-gray-900">Current Progress</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalSales)}
              </span>
              <span className="text-sm text-gray-500">
                total sales
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-sm text-gray-500">Remaining Days</span>
          <span className="font-medium text-gray-900">
            {businessDays.remainingWorkingDays}
          </span>
        </div>
      </div>
    </div>
  );
}
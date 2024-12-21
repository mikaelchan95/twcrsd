import React from 'react';
import { SalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useYearlyAnalytics } from '../../hooks/useYearlyAnalytics';

interface Props {
  data: SalesData[];
}

export default function YearlyTrends({ data }: Props) {
  const year = data.length > 0 ? format(parseISO(data[0].date), 'yyyy') : new Date().getFullYear().toString();
  const { analytics, previousYearAnalytics, isLoading } = useYearlyAnalytics(data, year);

  if (isLoading || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-500">Loading trends...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = analytics.monthlyTrend.map((month, index) => ({
    month: month.month,
    currentSales: month.sales,
    previousSales: previousYearAnalytics?.monthlyTrend[index]?.sales || 0,
    currentCustomers: month.customers,
    previousCustomers: previousYearAnalytics?.monthlyTrend[index]?.customers || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white rounded-lg border p-3 shadow-lg">
                      <p className="font-medium">{payload[0].payload.month}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-indigo-600">
                          Current Sales: {formatCurrency(payload[0].value)}
                        </p>
                        {previousYearAnalytics && (
                          <p className="text-sm text-gray-500">
                            Previous Year: {formatCurrency(payload[1].value)}
                          </p>
                        )}
                        <p className="text-sm text-blue-600">
                          Customers: {payload[2].value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="currentSales"
                name="Current Sales"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5', r: 4 }}
                activeDot={{ r: 6 }}
              />
              {previousYearAnalytics && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="previousSales"
                  name="Previous Year"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ fill: '#9CA3AF', r: 4 }}
                />
              )}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="currentCustomers"
                name="Customers"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: '#2563EB', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
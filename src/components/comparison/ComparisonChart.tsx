import React from 'react';
import { SalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { format, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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

interface Props {
  period1Data: SalesData[];
  period2Data: SalesData[];
  period1Label: string;
  period2Label: string;
  currentPeriodColor?: string;
  previousPeriodColor?: string;
}

export default function ComparisonChart({
  period1Data,
  period2Data,
  period1Label,
  period2Label,
  currentPeriodColor = '#4F46E5',
  previousPeriodColor = '#9CA3AF'
}: Props) {
  const sortedPeriod1 = [...period1Data].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  const sortedPeriod2 = [...period2Data].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  const maxDays = Math.max(sortedPeriod1.length, sortedPeriod2.length);
  const chartData = Array.from({ length: maxDays }, (_, index) => ({
    day: index + 1,
    [period1Label]: sortedPeriod1[index]?.totalSales || 0,
    [period2Label]: sortedPeriod2[index]?.totalSales || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Sales Comparison</CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentPeriodColor }}></div>
            <span className="ml-2 text-sm font-medium">{period2Label}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: previousPeriodColor }}></div>
            <span className="ml-2 text-sm text-gray-600">{period1Label}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 60, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                label={{ value: 'Day of Period', position: 'insideBottom', offset: -20 }}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(day) => `Day ${day}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
              />
              <Line
                type="monotone"
                dataKey={period2Label}
                stroke={currentPeriodColor}
                strokeWidth={2.5}
                dot={{ fill: currentPeriodColor, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey={period1Label}
                stroke={previousPeriodColor}
                strokeWidth={2}
                dot={{ fill: previousPeriodColor, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
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
}

export default function ComparisonChart({
  period1Data,
  period2Data,
  period1Label,
  period2Label
}: Props) {
  // Sort data chronologically
  const sortedPeriod1 = [...period1Data].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  const sortedPeriod2 = [...period2Data].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  // Prepare data for the chart
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
        <CardDescription>Compare daily sales between periods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={period1Label}
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey={period2Label}
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
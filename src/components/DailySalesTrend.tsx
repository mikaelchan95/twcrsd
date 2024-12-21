import React from 'react';
import { SalesData } from '../types/sales';
import { formatCurrency } from '../utils/currencyUtils';
import { format, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface Props {
  data: SalesData[];
}

export default function DailySalesTrend({ data }: Props) {
  // Sort data chronologically
  const sortedData = [...data].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  const chartData = sortedData.map(day => ({
    date: format(parseISO(day.date), 'd MMM'),
    sales: day.totalSales,
    fullDate: format(parseISO(day.date), 'd MMM yyyy'),
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Daily Sales Trend</CardTitle>
        <CardDescription>
          Track your daily sales performance over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 60, bottom: 25 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={50}
                tickMargin={5}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border bg-white px-3 py-2 shadow-lg">
                      <p className="mb-1 font-medium">
                        {payload[0].payload.fullDate}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatCurrency(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: '#2563EB',
                  strokeWidth: 2,
                  stroke: '#fff'
                }}
                activeDot={{
                  r: 6,
                  fill: '#2563EB',
                  stroke: '#fff',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
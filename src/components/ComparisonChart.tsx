import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SalesData } from '../types/sales';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ComparisonChartProps {
  period1: string;
  period2: string;
  period1Data: SalesData[];
  period2Data: SalesData[];
}

export default function ComparisonChart({
  period1,
  period2,
  period1Data,
  period2Data
}: ComparisonChartProps) {
  const formatData = (data: SalesData[]) => {
    return data.map(day => ({
      date: format(new Date(day.date), 'd MMM'),
      sales: day.totalSales
    }));
  };

  const period1ChartData = formatData(period1Data);
  const period2ChartData = formatData(period2Data);

  const maxDataPoints = Math.max(period1ChartData.length, period2ChartData.length);
  const chartData = Array.from({ length: maxDataPoints }, (_, i) => ({
    index: i + 1,
    [`${period1}`]: period1ChartData[i]?.sales || 0,
    [`${period2}`]: period2ChartData[i]?.sales || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Sales Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={period1} 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey={period2} 
                stroke="#82ca9d" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
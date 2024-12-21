import React, { useState } from 'react';
import { SalesData } from '../types/sales';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getMonthStats, getQuarterStats, formatCurrency } from '../utils/dataUtils';
import { format } from 'date-fns';

interface ComparisonViewProps {
  data: SalesData[];
}

export function ComparisonView({ data }: ComparisonViewProps) {
  const [period1, setPeriod1] = useState('');
  const [period2, setPeriod2] = useState('');

  const months = Array.from(new Set(data.map(item => format(new Date(item.date), 'MMMM yyyy'))));
  const quarters = Array.from(new Set(data.map(item => {
    const date = new Date(item.date);
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `Q${quarter} ${date.getFullYear()}`;
  })));

  const getPeriodData = (period: string): SalesData[] => {
    if (period.startsWith('Q')) {
      const [q, year] = period.split(' ');
      const quarter = parseInt(q.substring(1));
      return data.filter(item => {
        const date = new Date(item.date);
        return date.getFullYear() === parseInt(year) && 
               Math.floor(date.getMonth() / 3) + 1 === quarter;
      });
    } else {
      return data.filter(item => 
        format(new Date(item.date), 'MMMM yyyy') === period
      );
    }
  };

  const period1Data = period1 ? getPeriodData(period1) : [];
  const period2Data = period2 ? getPeriodData(period2) : [];

  const stats1 = period1.startsWith('Q') ? 
    getQuarterStats(period1Data) : 
    getMonthStats(period1Data);
  
  const stats2 = period2.startsWith('Q') ? 
    getQuarterStats(period2Data) : 
    getMonthStats(period2Data);

  const calculateChange = (value1: number, value2: number): string => {
    if (!value1 || !value2) return '0%';
    const change = ((value2 - value1) / value1) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select value={period1} onValueChange={setPeriod1}>
            <SelectTrigger>
              <SelectValue placeholder="Select first period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select period</SelectItem>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
              {quarters.map(quarter => (
                <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={period2} onValueChange={setPeriod2}>
            <SelectTrigger>
              <SelectValue placeholder="Select second period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select period</SelectItem>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
              {quarters.map(quarter => (
                <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {period1 && period2 && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{period1}</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats1.totalSales)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{period2}</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats2.totalSales)}</p>
                  <p className="text-sm text-gray-500">
                    {calculateChange(stats1.totalSales, stats2.totalSales)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-xl font-bold">{stats1.totalCustomers}</p>
                  <p className="text-sm text-gray-500">Avg: {formatCurrency(stats1.averagePerCustomer)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-xl font-bold">{stats2.totalCustomers}</p>
                  <p className="text-sm text-gray-500">
                    {calculateChange(stats1.totalCustomers, stats2.totalCustomers)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
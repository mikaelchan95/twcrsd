import React from 'react';
import { SalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';

interface Props {
  data: SalesData[];
  previousYearData: SalesData[];
}

export default function YearlyPaymentAnalysis({ data, previousYearData }: Props) {
  const calculatePaymentMetrics = (salesData: SalesData[]) => {
    return salesData.reduce((acc, day) => {
      Object.entries(day.paymentMethods).forEach(([method, amount]) => {
        acc[method] = (acc[method] || 0) + amount;
      });
      return acc;
    }, {} as Record<string, number>);
  };

  const currentMetrics = calculatePaymentMetrics(data);
  const previousMetrics = calculatePaymentMetrics(previousYearData);
  const totalCurrent = Object.values(currentMetrics).reduce((sum, val) => sum + val, 0);

  const paymentMethods = [
    { key: 'Cash', icon: Wallet, color: 'text-green-600', bgColor: 'bg-green-50' },
    { key: 'Visa', icon: CreditCard, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { key: 'MasterCard', icon: CreditCard, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { key: 'Amex', icon: CreditCard, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { key: 'NETS', icon: DollarSign, color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {paymentMethods.map(({ key, icon: Icon, color, bgColor }) => {
            const currentAmount = currentMetrics[key] || 0;
            const previousAmount = previousMetrics[key] || 0;
            const percentage = totalCurrent ? (currentAmount / totalCurrent) * 100 : 0;
            const change = previousAmount ? ((currentAmount - previousAmount) / previousAmount) * 100 : 0;

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <span className="font-medium text-gray-900">{key}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(currentAmount)}</p>
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
                    className={`h-2 rounded-full ${color.replace('text', 'bg')}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Transactions</span>
              <span className="font-medium text-gray-900">{formatCurrency(totalCurrent)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
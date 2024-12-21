import React from 'react';
import { SalesData } from '../types/sales';
import { formatCurrency } from '../utils/currencyUtils';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Props {
  data: SalesData[];
}

export default function PaymentMethodsChart({ data }: Props) {
  const paymentMethods = data.reduce((acc, day) => {
    Object.entries(day.paymentMethods).forEach(([method, amount]) => {
      acc[method] = (acc[method] || 0) + amount;
    });
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(paymentMethods).reduce((sum, amount) => sum + amount, 0);

  // Map payment methods to icons and colors
  const methodConfig = {
    'Cash': { 
      icon: Wallet, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      barColor: 'bg-green-600'
    },
    'Visa': { 
      icon: CreditCard, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      barColor: 'bg-blue-600'
    },
    'MasterCard': { 
      icon: CreditCard, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      barColor: 'bg-orange-600'
    },
    'Amex': { 
      icon: CreditCard, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100',
      barColor: 'bg-purple-600'
    },
    'NETS': { 
      icon: DollarSign, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-100',
      barColor: 'bg-indigo-600'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Monthly breakdown by payment type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(paymentMethods).map(([method, amount]) => {
            const config = methodConfig[method as keyof typeof methodConfig] || {
              icon: CreditCard,
              color: 'text-gray-600',
              bgColor: 'bg-gray-100',
              barColor: 'bg-gray-600'
            };
            const Icon = config.icon;
            const percentage = (amount / total) * 100;

            return (
              <div key={method}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <span className="font-medium text-gray-900">{method}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(amount)}</p>
                    <p className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${config.barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
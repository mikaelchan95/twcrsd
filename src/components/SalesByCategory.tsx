import React from 'react';
import { SalesData } from '../types/sales';
import { formatCurrency } from '../utils/currencyUtils';
import { Wine, Beer, Utensils } from 'lucide-react';
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

export default function SalesByCategory({ data }: Props) {
  const categorySales = data.reduce((acc, day) => ({
    food: acc.food + (day.foodSales || 0),
    bar: acc.bar + (day.barSales || 0),
    wine: acc.wine + (day.wineSales || 0)
  }), { food: 0, bar: 0, wine: 0 });

  const total = Object.values(categorySales).reduce((sum, amount) => sum + amount, 0);

  const categories = [
    {
      name: 'Food',
      amount: categorySales.food,
      icon: Utensils,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      barColor: 'bg-orange-600'
    },
    {
      name: 'Bar',
      amount: categorySales.bar,
      icon: Beer,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      barColor: 'bg-amber-600'
    },
    {
      name: 'Wine',
      amount: categorySales.wine,
      icon: Wine,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      barColor: 'bg-purple-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>Monthly breakdown by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map(({ name, amount, icon: Icon, color, bgColor, barColor }) => {
            const percentage = (amount / total) * 100;
            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <span className="font-medium text-gray-900">{name}</span>
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
                    className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
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
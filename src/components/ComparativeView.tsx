import React from 'react';
import { SalesData } from '../types/sales';
import ComparisonDashboard from './comparison/ComparisonDashboard';

interface Props {
  data: SalesData[];
}

export default function ComparativeView({ data }: Props) {
  return (
    <div className="space-y-6">
      <ComparisonDashboard data={data} />
    </div>
  );
}
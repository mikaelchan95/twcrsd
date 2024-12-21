import React from 'react';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { ViewType } from '../types';

interface Props {
  viewType: ViewType;
  setViewType: (type: ViewType) => void;
}

export default function DashboardHeader({ viewType, setViewType }: Props) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Sales Dashboard</h1>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setViewType('monthly')}
              className={`px-4 py-2 rounded-lg ${
                viewType === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="h-4 w-4 inline-block mr-2" />
              Monthly
            </button>
            <button
              onClick={() => setViewType('yearly')}
              className={`px-4 py-2 rounded-lg ${
                viewType === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline-block mr-2" />
              Yearly
            </button>
            <button
              onClick={() => setViewType('comparative')}
              className={`px-4 py-2 rounded-lg ${
                viewType === 'comparative'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline-block mr-2" />
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { ViewType } from './types';
import DashboardHeader from './components/DashboardHeader';
import MonthlyView from './components/MonthlyView';
import YearlyView from './components/YearlyView';
import ComparativeView from './components/ComparativeView';
import ReportInput from './components/ReportInput';
import { useSalesData } from './hooks/useSalesData';
import { Trash2, Loader2 } from 'lucide-react';

function App() {
  const [viewType, setViewType] = React.useState<ViewType>('monthly');
  const { salesData, addSalesData, clearSalesData, isLoading, error } = useSalesData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error loading sales data: {error}</p>
          <p className="mt-2 text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader viewType={viewType} setViewType={setViewType} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <ReportInput onDataParsed={addSalesData} />
            {salesData.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all sales data?')) {
                    clearSalesData();
                  }
                }}
                className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear all data"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {salesData.length > 0 && (
            <>
              {viewType === 'monthly' && <MonthlyView data={salesData} />}
              {viewType === 'yearly' && <YearlyView data={salesData} />}
              {viewType === 'comparative' && <ComparativeView data={salesData} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
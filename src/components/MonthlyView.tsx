import React, { useState } from 'react';
import { format } from 'date-fns';
import { SalesData } from '../types/sales';
import { groupDataByMonth, getMonthStats } from '../utils/dataUtils';
import SalesMetrics from './SalesMetrics';
import SalesProgress from './SalesProgress';
import DailySalesTrend from './DailySalesTrend';
import SalesByCategory from './SalesByCategory';
import PaymentMethodsChart from './PaymentMethodsChart';
import PhoneCallStats from './PhoneCallStats';
import SalesTable from './SalesTable';
import TimeBasedSales from './TimeBasedSales';
import QuickActions from './monthly/QuickActions';
import { ChevronDown } from 'lucide-react';

interface Props {
  data: SalesData[];
}

export default function MonthlyView({ data }: Props) {
  const monthlyData = groupDataByMonth(data);
  const months = Object.keys(monthlyData).sort().reverse();
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  
  const currentMonthData = monthlyData[selectedMonth] || [];
  const previousMonthData = monthlyData[months[months.indexOf(selectedMonth) + 1]] || [];
  
  const stats = getMonthStats(currentMonthData);
  const prevStats = getMonthStats(previousMonthData);

  const handleDataUpdate = (updatedData: SalesData[]) => {
    const newMonthlyData = { ...monthlyData };
    newMonthlyData[selectedMonth] = updatedData;
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing data...');
  };

  const handleEmail = () => {
    // Implement email functionality
    console.log('Emailing report...');
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Monthly Overview</h2>
            <p className="text-gray-500 mt-1">Track and analyze your monthly performance</p>
          </div>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer min-w-[200px]"
            >
              {months.map(month => (
                <option key={month} value={month}>
                  {format(new Date(month), 'MMMM yyyy')}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <SalesMetrics
            title="Total Sales"
            value={stats.totalSales}
            previousValue={prevStats.totalSales}
            type="currency"
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none"
          />
          <SalesMetrics
            title="Best Day Sales"
            value={stats.bestDay.totalSales}
            subtitle={format(new Date(stats.bestDay.date), 'MMM dd, yyyy')}
            type="currency"
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-none"
          />
          <SalesMetrics
            title="Total Customers"
            value={stats.totalCustomers}
            perCustomer={stats.averagePerCustomer}
            type="number"
            className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-none"
          />
          <SalesMetrics
            title="Reservation Rate"
            value={stats.reservationRate}
            subtitle={`${stats.noShowRate.toFixed(1)}% no-show rate`}
            type="percentage"
            className="bg-gradient-to-br from-amber-50 to-orange-50 border-none"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailySalesTrend data={currentMonthData} />
        </div>
        <div>
          <SalesProgress data={currentMonthData} />
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesByCategory data={currentMonthData} />
        <TimeBasedSales data={currentMonthData} />
        <PhoneCallStats data={currentMonthData} />
      </div>

      {/* Payment Methods and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodsChart data={currentMonthData} />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <QuickActions
            data={currentMonthData}
            onExport={handleExport}
            onPrint={handlePrint}
            onShare={handleShare}
            onEmail={handleEmail}
          />
        </div>
      </div>

      {/* Detailed Data Table */}
      <SalesTable 
        data={currentMonthData} 
        onDataUpdate={handleDataUpdate}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      />
    </div>
  );
}
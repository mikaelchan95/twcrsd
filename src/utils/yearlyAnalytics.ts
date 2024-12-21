import { SalesData } from '../types/sales';
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { calculateBusinessDays } from './businessDays';

export interface YearlyAnalytics {
  totalSales: number;
  averageMonthlySales: number;
  monthlyTrend: {
    month: string;
    sales: number;
    customers: number;
    averageSpend: number;
  }[];
  customerMetrics: {
    totalCustomers: number;
    averagePerCustomer: number;
    reservationRate: number;
    noShowRate: number;
    monthlyAverage: number;
  };
  bestPerformance: {
    day: string;
    sales: number;
    customers: number;
  };
  worstPerformance: {
    day: string;
    sales: number;
    customers: number;
  };
  categorySales: {
    food: number;
    bar: number;
    wine: number;
  };
  workingDaysMetrics: {
    totalDays: number;
    actualWorkingDays: number;
    completionRate: number;
  };
}

export function calculateYearlyAnalytics(data: SalesData[], year: string): YearlyAnalytics {
  // Filter data for the specific year
  const yearData = data.filter(day => isSameYear(parseISO(day.date), parseISO(`${year}-01-01`)));
  
  // Calculate business days for the year
  const businessDays = calculateBusinessDays(yearData, { excludeSundays: true });
  
  // Calculate monthly trends
  const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
    const monthData = yearData.filter(day => 
      isSameMonth(parseISO(day.date), new Date(parseInt(year), i))
    );
    
    const totalSales = monthData.reduce((sum, day) => sum + day.totalSales, 0);
    const totalCustomers = monthData.reduce((sum, day) => sum + day.totalPax, 0);
    
    return {
      month: format(new Date(parseInt(year), i), 'MMM'),
      sales: totalSales,
      customers: totalCustomers,
      averageSpend: totalCustomers > 0 ? totalSales / totalCustomers : 0
    };
  });

  // Calculate total and average metrics
  const totalSales = yearData.reduce((sum, day) => sum + day.totalSales, 0);
  const totalCustomers = yearData.reduce((sum, day) => sum + day.totalPax, 0);
  const totalReservations = yearData.reduce((sum, day) => sum + (day.reservations || 0), 0);
  const totalNoShows = yearData.reduce((sum, day) => sum + (day.noShows || 0), 0);

  // Find best and worst performing days
  const bestDay = yearData.reduce((best, current) => 
    current.totalSales > (best?.totalSales || 0) ? current : best
  );
  
  const worstDay = yearData.reduce((worst, current) => 
    current.totalSales < (worst?.totalSales || Infinity) ? current : worst
  );

  // Calculate category sales
  const categorySales = yearData.reduce((acc, day) => ({
    food: acc.food + (day.foodSales || 0),
    bar: acc.bar + (day.barSales || 0),
    wine: acc.wine + (day.wineSales || 0)
  }), { food: 0, bar: 0, wine: 0 });

  // Calculate completion rate
  const completionRate = (businessDays.actualWorkingDays / businessDays.workingDays) * 100;

  return {
    totalSales,
    averageMonthlySales: totalSales / monthlyTrend.filter(m => m.sales > 0).length,
    monthlyTrend,
    customerMetrics: {
      totalCustomers,
      averagePerCustomer: totalCustomers > 0 ? totalSales / totalCustomers : 0,
      reservationRate: totalCustomers > 0 ? (totalReservations / totalCustomers) * 100 : 0,
      noShowRate: totalReservations > 0 ? (totalNoShows / totalReservations) * 100 : 0,
      monthlyAverage: totalCustomers / monthlyTrend.filter(m => m.customers > 0).length
    },
    bestPerformance: {
      day: bestDay.date,
      sales: bestDay.totalSales,
      customers: bestDay.totalPax
    },
    worstPerformance: {
      day: worstDay.date,
      sales: worstDay.totalSales,
      customers: worstDay.totalPax
    },
    categorySales,
    workingDaysMetrics: {
      totalDays: businessDays.totalDays,
      actualWorkingDays: businessDays.actualWorkingDays,
      completionRate
    }
  };
}

export function calculateYearOverYearGrowth(
  currentYear: YearlyAnalytics,
  previousYear: YearlyAnalytics
): Record<string, number> {
  return {
    salesGrowth: ((currentYear.totalSales - previousYear.totalSales) / previousYear.totalSales) * 100,
    customerGrowth: ((currentYear.customerMetrics.totalCustomers - previousYear.customerMetrics.totalCustomers) / previousYear.customerMetrics.totalCustomers) * 100,
    averageSpendGrowth: ((currentYear.customerMetrics.averagePerCustomer - previousYear.customerMetrics.averagePerCustomer) / previousYear.customerMetrics.averagePerCustomer) * 100,
    reservationRateGrowth: currentYear.customerMetrics.reservationRate - previousYear.customerMetrics.reservationRate,
    categoryGrowth: {
      food: ((currentYear.categorySales.food - previousYear.categorySales.food) / previousYear.categorySales.food) * 100,
      bar: ((currentYear.categorySales.bar - previousYear.categorySales.bar) / previousYear.categorySales.bar) * 100,
      wine: ((currentYear.categorySales.wine - previousYear.categorySales.wine) / previousYear.categorySales.wine) * 100
    }
  };
}
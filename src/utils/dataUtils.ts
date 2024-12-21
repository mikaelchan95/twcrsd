import { SalesData, MonthlyStats, QuarterlyStats, YearlyStats } from '../types/sales';
import { startOfMonth, endOfMonth, parseISO, format } from 'date-fns';

export function groupDataByMonth(data: SalesData[]): Record<string, SalesData[]> {
  return data.reduce((acc, item) => {
    const monthKey = format(parseISO(item.date), 'yyyy-MM');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(item);
    return acc;
  }, {} as Record<string, SalesData[]>);
}

export function groupDataByQuarter(data: SalesData[]): Record<string, SalesData[]> {
  return data.reduce((acc, item) => {
    const date = parseISO(item.date);
    const quarter = Math.floor((date.getMonth() / 3)) + 1;
    const quarterKey = `${date.getFullYear()}-Q${quarter}`;
    
    if (!acc[quarterKey]) {
      acc[quarterKey] = [];
    }
    acc[quarterKey].push(item);
    return acc;
  }, {} as Record<string, SalesData[]>);
}

export function groupDataByYear(data: SalesData[]): Record<string, SalesData[]> {
  return data.reduce((acc, item) => {
    const yearKey = format(parseISO(item.date), 'yyyy');
    if (!acc[yearKey]) {
      acc[yearKey] = [];
    }
    acc[yearKey].push(item);
    return acc;
  }, {} as Record<string, SalesData[]>);
}

export function getMonthStats(data: SalesData[]): MonthlyStats {
  if (!data.length) {
    return {
      totalSales: 0,
      bestDay: { date: '', totalSales: 0 },
      totalCustomers: 0,
      averagePerCustomer: 0,
      reservationRate: 0,
      noShowRate: 0,
      phoneCallsAnswered: 0,
      missedPhoneCalls: 0,
      answerRate: 0
    };
  }

  const bestDay = data.reduce((best, current) => 
    current.totalSales > best.totalSales ? current : best
  );

  const totalCustomers = data.reduce((sum, day) => 
    sum + ((day.reservations || 0) + (day.walkIns || 0) - (day.cancellations || 0) - (day.noShows || 0)), 0
  );

  const totalReservations = data.reduce((sum, day) => sum + (day.reservations || 0), 0);
  const totalNoShows = data.reduce((sum, day) => sum + (day.noShows || 0), 0);
  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);

  const answeredCalls = data.reduce((sum, day) => sum + (day.phoneCallsAnswered || 0), 0);
  const missedCalls = data.reduce((sum, day) => sum + (day.missedPhoneCalls || 0), 0);
  const totalCalls = answeredCalls + missedCalls;

  return {
    totalSales,
    bestDay,
    totalCustomers,
    averagePerCustomer: totalCustomers ? totalSales / totalCustomers : 0,
    reservationRate: totalCustomers ? (totalReservations / totalCustomers) * 100 : 0,
    noShowRate: totalReservations ? (totalNoShows / totalReservations) * 100 : 0,
    phoneCallsAnswered: answeredCalls,
    missedPhoneCalls: missedCalls,
    answerRate: totalCalls ? (answeredCalls / totalCalls) * 100 : 0
  };
}

export function getQuarterStats(data: SalesData[]): QuarterlyStats {
  if (!data.length) {
    return {
      totalSales: 0,
      totalCustomers: 0,
      averagePerCustomer: 0,
      reservationRate: 0
    };
  }

  const totalCustomers = data.reduce((sum, day) => 
    sum + ((day.reservations || 0) + (day.walkIns || 0) - (day.cancellations || 0) - (day.noShows || 0)), 0
  );

  const totalReservations = data.reduce((sum, day) => sum + (day.reservations || 0), 0);
  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);

  return {
    totalSales,
    totalCustomers,
    averagePerCustomer: totalCustomers ? totalSales / totalCustomers : 0,
    reservationRate: totalCustomers ? (totalReservations / totalCustomers) * 100 : 0
  };
}

export function getYearlyStats(data: SalesData[]): YearlyStats {
  if (!data.length) {
    return {
      totalSales: 0,
      averageMonthlySales: 0,
      totalCustomers: 0,
      averagePerCustomer: 0,
      reservationRate: 0,
      noShowRate: 0
    };
  }

  const monthlyData = groupDataByMonth(data);
  const months = Object.keys(monthlyData);

  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);
  const totalCustomers = data.reduce((sum, day) => 
    sum + ((day.reservations || 0) + (day.walkIns || 0) - (day.cancellations || 0) - (day.noShows || 0)), 0
  );

  const totalReservations = data.reduce((sum, day) => sum + (day.reservations || 0), 0);
  const totalNoShows = data.reduce((sum, day) => sum + (day.noShows || 0), 0);

  return {
    totalSales,
    averageMonthlySales: months.length ? totalSales / months.length : 0,
    totalCustomers,
    averagePerCustomer: totalCustomers ? totalSales / totalCustomers : 0,
    reservationRate: totalCustomers ? (totalReservations / totalCustomers) * 100 : 0,
    noShowRate: totalReservations ? (totalNoShows / totalReservations) * 100 : 0
  };
}

export function calculateMonthlyTotals(data: SalesData[]): {
  sales: number;
  customers: number;
  reservations: number;
} {
  return data.reduce((acc, day) => ({
    sales: acc.sales + day.totalSales,
    customers: acc.customers + ((day.reservations || 0) + (day.walkIns || 0) - (day.cancellations || 0) - (day.noShows || 0)),
    reservations: acc.reservations + (day.reservations || 0)
  }), { sales: 0, customers: 0, reservations: 0 });
}

export function getQuarterlyStats(data: SalesData[]): Record<string, QuarterlyStats> {
  const quarterlyData = groupDataByQuarter(data);
  return Object.entries(quarterlyData).reduce((acc, [quarter, data]) => ({
    ...acc,
    [quarter]: getQuarterStats(data)
  }), {});
}

export function calculateCategoryTotals(data: SalesData[]): {
  food: number;
  bar: number;
  wine: number;
} {
  return data.reduce((acc, day) => ({
    food: acc.food + (day.foodSales || 0),
    bar: acc.bar + (day.barSales || 0),
    wine: acc.wine + (day.wineSales || 0)
  }), { food: 0, bar: 0, wine: 0 });
}

export function calculatePaymentMethodTotals(data: SalesData[]): Record<string, number> {
  return data.reduce((acc, day) => {
    if (day.paymentMethods) {
      Object.entries(day.paymentMethods).forEach(([method, amount]) => {
        acc[method] = (acc[method] || 0) + amount;
      });
    }
    return acc;
  }, {} as Record<string, number>);
}
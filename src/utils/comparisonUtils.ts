import { SalesData } from '../types/sales';
import { 
  ComparisonPeriodData, 
  ComparisonPeriodType,
  CategorySales,
  TimeBasedSales,
  CustomerMetrics,
  ServiceMetrics 
} from '../types/comparison';
import { 
  format, 
  parseISO, 
  isAfter, 
  endOfMonth, 
  getDaysInMonth,
  startOfMonth,
  isSameMonth,
  isSameYear,
  isToday
} from 'date-fns';

function isPartialPeriod(data: SalesData[]): boolean {
  if (!data.length) return false;
  
  const lastDate = parseISO(data[data.length - 1].date);
  const today = new Date();
  
  return isSameMonth(lastDate, today) && isSameYear(lastDate, today);
}

function getProRateFactor(data: SalesData[]): number {
  if (!data.length) return 1;
  
  const lastDate = parseISO(data[data.length - 1].date);
  const daysInMonth = getDaysInMonth(lastDate);
  const completedDays = data.length;
  
  return daysInMonth / completedDays;
}

function proRateValue(value: number, factor: number): number {
  return value * factor;
}

export function groupDataByPeriod(
  data: SalesData[],
  periodType: ComparisonPeriodType
): Record<string, SalesData[]> {
  const grouped: Record<string, SalesData[]> = {};

  data.forEach(item => {
    const date = parseISO(item.date);
    let periodKey: string;

    if (periodType === 'month') {
      periodKey = format(date, 'yyyy-MM');
    } else {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      periodKey = `${format(date, 'yyyy')}-Q${quarter}`;
    }

    if (!grouped[periodKey]) {
      grouped[periodKey] = [];
    }
    grouped[periodKey].push(item);
  });

  return grouped;
}

function calculateCategorySales(data: SalesData[], isPartial: boolean): CategorySales {
  const totals = data.reduce(
    (acc, day) => ({
      food: acc.food + (day.foodSales || 0),
      bar: acc.bar + (day.barSales || 0),
      wine: acc.wine + (day.wineSales || 0)
    }),
    { food: 0, bar: 0, wine: 0 }
  );

  if (!isPartial) return totals;

  const proRateFactor = getProRateFactor(data);
  return {
    food: proRateValue(totals.food, proRateFactor),
    bar: proRateValue(totals.bar, proRateFactor),
    wine: proRateValue(totals.wine, proRateFactor)
  };
}

function calculateTimeBasedSales(data: SalesData[], isPartial: boolean): TimeBasedSales {
  const totals = data.reduce(
    (acc, day) => ({
      happyHour: acc.happyHour + (day.happyHourSales || 0),
      evening: acc.evening + (day.salesFrom7pmTo10pm || 0),
      lateNight: acc.lateNight + (day.after10pmSales || 0)
    }),
    { happyHour: 0, evening: 0, lateNight: 0 }
  );

  if (!isPartial) return totals;

  const proRateFactor = getProRateFactor(data);
  return {
    happyHour: proRateValue(totals.happyHour, proRateFactor),
    evening: proRateValue(totals.evening, proRateFactor),
    lateNight: proRateValue(totals.lateNight, proRateFactor)
  };
}

function calculateCustomerMetrics(data: SalesData[], isPartial: boolean): CustomerMetrics {
  const totals = data.reduce(
    (acc, day) => ({
      customers: acc.customers + day.totalPax,
      reservations: acc.reservations + (day.reservations || 0),
      walkIns: acc.walkIns + (day.walkIns || 0),
      noShows: acc.noShows + (day.noShows || 0),
      cancellations: acc.cancellations + (day.cancellations || 0)
    }),
    { customers: 0, reservations: 0, walkIns: 0, noShows: 0, cancellations: 0 }
  );

  if (!isPartial) {
    return {
      totalCustomers: totals.customers,
      reservations: totals.reservations,
      walkIns: totals.walkIns,
      noShows: totals.noShows,
      cancellations: totals.cancellations,
      reservationRate: totals.customers > 0 ? (totals.reservations / totals.customers) * 100 : 0,
      noShowRate: totals.reservations > 0 ? (totals.noShows / totals.reservations) * 100 : 0
    };
  }

  const proRateFactor = getProRateFactor(data);
  const proRatedTotals = {
    customers: proRateValue(totals.customers, proRateFactor),
    reservations: proRateValue(totals.reservations, proRateFactor),
    walkIns: proRateValue(totals.walkIns, proRateFactor),
    noShows: proRateValue(totals.noShows, proRateFactor),
    cancellations: proRateValue(totals.cancellations, proRateFactor)
  };

  return {
    totalCustomers: proRatedTotals.customers,
    reservations: proRatedTotals.reservations,
    walkIns: proRatedTotals.walkIns,
    noShows: proRatedTotals.noShows,
    cancellations: proRatedTotals.cancellations,
    reservationRate: proRatedTotals.customers > 0 ? 
      (proRatedTotals.reservations / proRatedTotals.customers) * 100 : 0,
    noShowRate: proRatedTotals.reservations > 0 ? 
      (proRatedTotals.noShows / proRatedTotals.reservations) * 100 : 0
  };
}

function calculateServiceMetrics(data: SalesData[]): ServiceMetrics {
  // Service metrics are not pro-rated as they represent actual counts
  const totals = data.reduce(
    (acc, day) => ({
      answered: acc.answered + (day.phoneCallsAnswered || 0),
      missed: acc.missed + (day.missedPhoneCalls || 0)
    }),
    { answered: 0, missed: 0 }
  );

  const totalCalls = totals.answered + totals.missed;

  return {
    phoneCallsAnswered: totals.answered,
    missedPhoneCalls: totals.missed,
    answerRate: totalCalls > 0 ? (totals.answered / totalCalls) * 100 : 0
  };
}

export function calculatePeriodStats(data: SalesData[]): ComparisonPeriodData {
  if (!data.length) {
    return {
      label: '',
      data: [],
      totalSales: 0,
      averageDailySales: 0,
      bestDaySales: 0,
      worstDaySales: 0,
      customerMetrics: {
        totalCustomers: 0,
        reservations: 0,
        walkIns: 0,
        noShows: 0,
        cancellations: 0,
        reservationRate: 0,
        noShowRate: 0
      },
      categorySales: { food: 0, bar: 0, wine: 0 },
      timeBasedSales: { happyHour: 0, evening: 0, lateNight: 0 },
      serviceMetrics: {
        phoneCallsAnswered: 0,
        missedPhoneCalls: 0,
        answerRate: 0
      },
      paymentMethods: {},
      isPartialPeriod: false,
      daysInPeriod: 0,
      completedDays: 0
    };
  }

  const isPartial = isPartialPeriod(data);
  const lastDate = parseISO(data[data.length - 1].date);
  const daysInPeriod = getDaysInMonth(lastDate);
  const completedDays = data.length;

  // Calculate raw totals first
  const rawTotalSales = data.reduce((sum, item) => sum + item.totalSales, 0);
  const proRateFactor = isPartial ? getProRateFactor(data) : 1;
  
  // Pro-rate total sales if it's a partial period
  const totalSales = isPartial ? proRateValue(rawTotalSales, proRateFactor) : rawTotalSales;
  
  const dailySales = data.map(item => item.totalSales);
  const averageDailySales = rawTotalSales / completedDays;

  const paymentMethods = data.reduce((acc, item) => {
    Object.entries(item.paymentMethods).forEach(([method, amount]) => {
      acc[method] = (acc[method] || 0) + amount;
    });
    return acc;
  }, {} as Record<string, number>);

  if (isPartial) {
    Object.keys(paymentMethods).forEach(key => {
      paymentMethods[key] = proRateValue(paymentMethods[key], proRateFactor);
    });
  }

  return {
    label: format(lastDate, 'MMMM yyyy'),
    data,
    totalSales,
    averageDailySales,
    bestDaySales: Math.max(...dailySales),
    worstDaySales: Math.min(...dailySales),
    customerMetrics: calculateCustomerMetrics(data, isPartial),
    categorySales: calculateCategorySales(data, isPartial),
    timeBasedSales: calculateTimeBasedSales(data, isPartial),
    serviceMetrics: calculateServiceMetrics(data),
    paymentMethods,
    isPartialPeriod: isPartial,
    daysInPeriod,
    completedDays
  };
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function formatPeriodLabel(period: string, periodType: ComparisonPeriodType): string {
  if (periodType === 'month') {
    const [year, month] = period.split('-');
    return format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM yyyy');
  }
  return period;
}
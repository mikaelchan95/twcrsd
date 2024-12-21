import { SalesData } from '../../types/sales';
import { 
  DailyMetrics,
  AggregatedMetrics,
  ProjectionConfig 
} from '../../types/metrics';
import { 
  startOfDay, 
  endOfDay, 
  differenceInDays,
  getDaysInMonth,
  isSameMonth,
  parseISO,
  isAfter,
  isBefore,
  endOfMonth
} from 'date-fns';

export function calculateDailyMetrics(data: SalesData): DailyMetrics {
  return {
    date: data.date,
    totalSales: data.totalSales,
    totalCustomers: data.totalPax,
    averagePerCustomer: data.perHeadSpend,
    categorySales: {
      food: data.foodSales || 0,
      bar: data.barSales || 0,
      wine: data.wineSales || 0
    },
    timeBasedSales: {
      happyHour: data.happyHourSales || 0,
      evening: data.salesFrom7pmTo10pm || 0,
      lateNight: data.after10pmSales || 0
    },
    customerMetrics: {
      totalCustomers: data.totalPax,
      reservations: data.reservations || 0,
      walkIns: data.walkIns || 0,
      noShows: data.noShows || 0,
      cancellations: data.cancellations || 0,
      reservationRate: data.reservations ? (data.reservations / data.totalPax) * 100 : 0,
      noShowRate: data.reservations ? (data.noShows || 0) / data.reservations * 100 : 0
    },
    serviceMetrics: {
      phoneCallsAnswered: data.phoneCallsAnswered || 0,
      missedPhoneCalls: data.missedPhoneCalls || 0,
      answerRate: calculateAnswerRate(data.phoneCallsAnswered || 0, data.missedPhoneCalls || 0)
    },
    paymentMethods: data.paymentMethods
  };
}

export function aggregateMetrics(
  dailyMetrics: DailyMetrics[],
  shouldProRate: boolean = false
): AggregatedMetrics {
  if (!dailyMetrics.length) {
    return createEmptyAggregatedMetrics();
  }

  const lastDate = parseISO(dailyMetrics[dailyMetrics.length - 1].date);
  const daysInPeriod = getDaysInMonth(lastDate);
  const completedDays = dailyMetrics.length;
  const isPartialPeriod = shouldProRate && completedDays < daysInPeriod;
  const proRateFactor = isPartialPeriod ? daysInPeriod / completedDays : 1;

  // Calculate raw totals
  const rawTotals = dailyMetrics.reduce((acc, day) => ({
    totalSales: acc.totalSales + day.totalSales,
    totalCustomers: acc.totalCustomers + day.totalCustomers,
    categorySales: {
      food: acc.categorySales.food + day.categorySales.food,
      bar: acc.categorySales.bar + day.categorySales.bar,
      wine: acc.categorySales.wine + day.categorySales.wine
    },
    timeBasedSales: {
      happyHour: acc.timeBasedSales.happyHour + day.timeBasedSales.happyHour,
      evening: acc.timeBasedSales.evening + day.timeBasedSales.evening,
      lateNight: acc.timeBasedSales.lateNight + day.timeBasedSales.lateNight
    }
  }), {
    totalSales: 0,
    totalCustomers: 0,
    categorySales: { food: 0, bar: 0, wine: 0 },
    timeBasedSales: { happyHour: 0, evening: 0, lateNight: 0 }
  });

  // Pro-rate if necessary
  const totalSales = isPartialPeriod ? rawTotals.totalSales * proRateFactor : rawTotals.totalSales;
  const totalCustomers = isPartialPeriod ? Math.round(rawTotals.totalCustomers * proRateFactor) : rawTotals.totalCustomers;

  const categorySales = isPartialPeriod ? {
    food: rawTotals.categorySales.food * proRateFactor,
    bar: rawTotals.categorySales.bar * proRateFactor,
    wine: rawTotals.categorySales.wine * proRateFactor
  } : rawTotals.categorySales;

  const timeBasedSales = isPartialPeriod ? {
    happyHour: rawTotals.timeBasedSales.happyHour * proRateFactor,
    evening: rawTotals.timeBasedSales.evening * proRateFactor,
    lateNight: rawTotals.timeBasedSales.lateNight * proRateFactor
  } : rawTotals.timeBasedSales;

  // Calculate customer metrics
  const customerMetrics = calculateCustomerMetrics(dailyMetrics, isPartialPeriod, proRateFactor);
  
  // Calculate service metrics (don't pro-rate these as they're actual counts)
  const serviceMetrics = calculateServiceMetrics(dailyMetrics);

  // Find best and worst days
  const { bestDaySales, worstDaySales } = findExtremes(dailyMetrics);

  return {
    totalSales,
    totalCustomers,
    averageDailySales: rawTotals.totalSales / completedDays,
    bestDaySales,
    worstDaySales,
    categorySales,
    timeBasedSales,
    customerMetrics,
    serviceMetrics,
    paymentMethods: aggregatePaymentMethods(dailyMetrics, isPartialPeriod, proRateFactor),
    daysInPeriod,
    completedDays,
    isPartialPeriod
  };
}

function calculateAnswerRate(answered: number, missed: number): number {
  const total = answered + missed;
  return total > 0 ? (answered / total) * 100 : 0;
}

function calculateCustomerMetrics(
  dailyMetrics: DailyMetrics[],
  isPartialPeriod: boolean,
  proRateFactor: number
) {
  const totals = dailyMetrics.reduce((acc, day) => ({
    reservations: acc.reservations + day.customerMetrics.reservations,
    walkIns: acc.walkIns + day.customerMetrics.walkIns,
    noShows: acc.noShows + day.customerMetrics.noShows,
    cancellations: acc.cancellations + day.customerMetrics.cancellations
  }), { reservations: 0, walkIns: 0, noShows: 0, cancellations: 0 });

  if (isPartialPeriod) {
    Object.keys(totals).forEach(key => {
      totals[key as keyof typeof totals] = Math.round(totals[key as keyof typeof totals] * proRateFactor);
    });
  }

  const totalCustomers = totals.reservations + totals.walkIns - totals.noShows - totals.cancellations;

  return {
    totalCustomers,
    reservations: totals.reservations,
    walkIns: totals.walkIns,
    noShows: totals.noShows,
    cancellations: totals.cancellations,
    reservationRate: totalCustomers > 0 ? (totals.reservations / totalCustomers) * 100 : 0,
    noShowRate: totals.reservations > 0 ? (totals.noShows / totals.reservations) * 100 : 0
  };
}

function calculateServiceMetrics(dailyMetrics: DailyMetrics[]) {
  const totals = dailyMetrics.reduce((acc, day) => ({
    answered: acc.answered + day.serviceMetrics.phoneCallsAnswered,
    missed: acc.missed + day.serviceMetrics.missedPhoneCalls
  }), { answered: 0, missed: 0 });

  const totalCalls = totals.answered + totals.missed;

  return {
    phoneCallsAnswered: totals.answered,
    missedPhoneCalls: totals.missed,
    answerRate: totalCalls > 0 ? (totals.answered / totalCalls) * 100 : 0
  };
}

function findExtremes(dailyMetrics: DailyMetrics[]) {
  return dailyMetrics.reduce((acc, day) => ({
    bestDaySales: Math.max(acc.bestDaySales, day.totalSales),
    worstDaySales: Math.min(acc.worstDaySales, day.totalSales)
  }), { bestDaySales: 0, worstDaySales: Infinity });
}

function aggregatePaymentMethods(
  dailyMetrics: DailyMetrics[],
  isPartialPeriod: boolean,
  proRateFactor: number
) {
  const totals = dailyMetrics.reduce((acc, day) => {
    Object.entries(day.paymentMethods).forEach(([method, amount]) => {
      acc[method] = (acc[method] || 0) + amount;
    });
    return acc;
  }, {} as Record<string, number>);

  if (isPartialPeriod) {
    Object.keys(totals).forEach(key => {
      totals[key] = totals[key] * proRateFactor;
    });
  }

  return totals;
}

function createEmptyAggregatedMetrics(): AggregatedMetrics {
  return {
    totalSales: 0,
    totalCustomers: 0,
    averageDailySales: 0,
    bestDaySales: 0,
    worstDaySales: 0,
    categorySales: { food: 0, bar: 0, wine: 0 },
    timeBasedSales: { happyHour: 0, evening: 0, lateNight: 0 },
    customerMetrics: {
      totalCustomers: 0,
      reservations: 0,
      walkIns: 0,
      noShows: 0,
      cancellations: 0,
      reservationRate: 0,
      noShowRate: 0
    },
    serviceMetrics: {
      phoneCallsAnswered: 0,
      missedPhoneCalls: 0,
      answerRate: 0
    },
    paymentMethods: {},
    daysInPeriod: 0,
    completedDays: 0,
    isPartialPeriod: false
  };
}
import { SalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { format } from 'date-fns';

export async function generateExcelData(data: SalesData[]): Promise<Blob> {
  // Calculate totals for summary
  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);
  const totalCustomers = data.reduce((sum, day) => sum + day.totalPax, 0);
  const averagePerCustomer = totalSales / totalCustomers;

  // Create summary section
  const summary = [
    ['Sales Report Summary'],
    ['Period', format(new Date(data[0].date), 'MMMM yyyy')],
    ['Total Sales', formatCurrency(totalSales)],
    ['Total Customers', totalCustomers.toString()],
    ['Average per Customer', formatCurrency(averagePerCustomer)],
    [''],  // Empty row for spacing
  ];

  // Create headers for daily data
  const headers = [
    'Date',
    'Total Sales',
    'Food Sales',
    'Bar Sales',
    'Wine Sales',
    'Happy Hour Sales',
    '7PM-10PM Sales',
    'After 10PM Sales',
    'Total Customers',
    'Reservations',
    'Walk-ins',
    'No Shows',
    'Cancellations',
    'Phone Calls Answered',
    'Missed Calls',
    'Per Head Spend'
  ];

  // Create daily data rows
  const rows = data.map(day => [
    format(new Date(day.date), 'yyyy-MM-dd'),
    formatCurrency(day.totalSales),
    formatCurrency(day.foodSales || 0),
    formatCurrency(day.barSales || 0),
    formatCurrency(day.wineSales || 0),
    formatCurrency(day.happyHourSales || 0),
    formatCurrency(day.salesFrom7pmTo10pm || 0),
    formatCurrency(day.after10pmSales || 0),
    day.totalPax.toString(),
    (day.reservations || 0).toString(),
    (day.walkIns || 0).toString(),
    (day.noShows || 0).toString(),
    (day.cancellations || 0).toString(),
    (day.phoneCallsAnswered || 0).toString(),
    (day.missedPhoneCalls || 0).toString(),
    formatCurrency(day.perHeadSpend)
  ]);

  // Create payment methods summary
  const paymentMethods = data.reduce((acc, day) => {
    Object.entries(day.paymentMethods).forEach(([method, amount]) => {
      acc[method] = (acc[method] || 0) + amount;
    });
    return acc;
  }, {} as Record<string, number>);

  const paymentSummary = [
    [''],  // Empty row for spacing
    ['Payment Methods Summary'],
    ...Object.entries(paymentMethods).map(([method, amount]) => [
      method,
      formatCurrency(amount)
    ])
  ];

  // Combine all sections
  const csvContent = [
    ...summary,
    [headers.join(',')],
    ...rows.map(row => row.join(',')),
    ...paymentSummary.map(row => row.join(','))
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}
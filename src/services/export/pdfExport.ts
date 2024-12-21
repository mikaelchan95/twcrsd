import { SalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/currencyUtils';
import { format } from 'date-fns';

export async function generatePDFData(data: SalesData[]): Promise<Blob> {
  // Calculate totals and averages
  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);
  const totalCustomers = data.reduce((sum, day) => sum + day.totalPax, 0);
  const averagePerCustomer = totalSales / totalCustomers;

  // Generate report content
  const content = [
    '=== Sales Report ===',
    `Period: ${format(new Date(data[0].date), 'MMMM yyyy')}`,
    '',
    'Summary:',
    `Total Sales: ${formatCurrency(totalSales)}`,
    `Total Customers: ${totalCustomers}`,
    `Average per Customer: ${formatCurrency(averagePerCustomer)}`,
    '',
    'Daily Breakdown:',
    ...data.map(day => 
      `Date: ${format(new Date(day.date), 'yyyy-MM-dd')}\n` +
      `  Total Sales: ${formatCurrency(day.totalSales)}\n` +
      `  Food Sales: ${formatCurrency(day.foodSales || 0)}\n` +
      `  Bar Sales: ${formatCurrency(day.barSales || 0)}\n` +
      `  Wine Sales: ${formatCurrency(day.wineSales || 0)}\n` +
      `  Customers: ${day.totalPax}\n` +
      `  Reservations: ${day.reservations || 0}\n` +
      `  Walk-ins: ${day.walkIns || 0}\n` +
      `  No Shows: ${day.noShows || 0}\n` +
      `  Per Head Spend: ${formatCurrency(day.perHeadSpend)}`
    ),
    '',
    'Payment Methods:',
    ...Object.entries(data.reduce((acc, day) => {
      Object.entries(day.paymentMethods).forEach(([method, amount]) => {
        acc[method] = (acc[method] || 0) + amount;
      });
      return acc;
    }, {} as Record<string, number>)).map(([method, amount]) =>
      `  ${method}: ${formatCurrency(amount)}`
    )
  ].join('\n');

  return new Blob([content], { type: 'application/pdf' });
}
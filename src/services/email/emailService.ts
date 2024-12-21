import { SalesData } from '../../types/sales';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/currencyUtils';

export interface EmailConfig {
  to: string;
  subject: string;
  period: string;
}

export async function sendEmailReport(data: SalesData[], config: EmailConfig): Promise<boolean> {
  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);
  const totalCustomers = data.reduce((sum, day) => sum + day.totalPax, 0);
  
  const emailContent = `
    Sales Report for ${config.period}
    
    Total Sales: ${formatCurrency(totalSales)}
    Total Customers: ${totalCustomers}
    Average per Customer: ${formatCurrency(totalSales / totalCustomers)}
    
    Generated on ${format(new Date(), 'PPP')}
  `;

  // In a real application, this would integrate with an email service
  console.log('Sending email:', {
    to: config.to,
    subject: config.subject,
    content: emailContent
  });

  return true;
}
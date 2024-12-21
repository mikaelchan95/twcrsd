import { SalesData } from '../../types/sales';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/currencyUtils';

export interface ShareConfig {
  title: string;
  period: string;
}

export async function shareReport(data: SalesData[], config: ShareConfig): Promise<boolean> {
  const totalSales = data.reduce((sum, day) => sum + day.totalSales, 0);
  
  const shareData = {
    title: config.title,
    text: `Sales Report for ${config.period} - Total: ${formatCurrency(totalSales)}`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      console.error('Error sharing:', err);
      return false;
    }
  }

  // Fallback for browsers that don't support native sharing
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareUrl)}`;
  window.open(shareUrl, '_blank');
  return true;
}
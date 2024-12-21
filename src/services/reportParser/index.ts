import { SalesData } from '../../types/sales';
import { tryParseDate, formatDate } from '../../utils/dateUtils';
import {
  matchTotalSales,
  matchTimeSales,
  matchCategorySales,
  matchPaymentMethod,
  matchPromotion,
  matchCustomerMetrics,
  matchMTDSales
} from './matchers';

export function parseMultiDayReport(report: string): SalesData[] {
  const salesDataArray: SalesData[] = [];
  
  try {
    // Split report into individual day reports, handling various date formats
    const dayReports = report.split(/(?=\*?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*,?\s*\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}\*?|(?=\[[\d/]+,))/i)
      .filter(report => report.trim());

    for (const dayReport of dayReports) {
      // Clean up the report text
      const lines = dayReport.split('\n')
        .map(line => line.replace(/[\*\[\]\u2022\u2028\u2029\u200B\u200C\u200D\u2060]/g, '').trim()) // Remove bullets, special chars
        .filter(line => line);

      const data: Partial<SalesData> = {
        paymentMethods: {},
        promotions: [],
        miscellaneous: {},
        entertainment: {}
      };

      // Parse date - handle various date formats
      const dateMatch = lines.join(' ').match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*,?\s*(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/i);
      if (dateMatch) {
        const [_, day, month, year] = dateMatch;
        const dateString = `${day} ${month} ${year}`;
        const parsedDate = tryParseDate(dateString);
        if (parsedDate) {
          data.date = formatDate(parsedDate);
        }
      }

      // Parse lines
      for (const line of lines) {
        // Total Sales
        const totalSales = matchTotalSales(line);
        if (totalSales !== null) {
          data.totalSales = totalSales;
          continue;
        }

        // Time-based sales
        Object.assign(data, matchTimeSales(line));

        // Category sales
        Object.assign(data, matchCategorySales(line));

        // Payment methods
        const paymentMethod = matchPaymentMethod(line);
        if (paymentMethod) {
          data.paymentMethods[paymentMethod.method] = paymentMethod.amount;
          continue;
        }

        // Promotions - handle various formats
        const promotion = matchPromotion(line);
        if (promotion) {
          data.promotions?.push(promotion);
          continue;
        }

        // Customer metrics
        const customerMetric = matchCustomerMetrics(line);
        if (customerMetric) {
          data[customerMetric.field] = customerMetric.value;
          continue;
        }

        // MTD Sales
        const mtdSales = matchMTDSales(line);
        if (mtdSales !== null) {
          data.mtdSales = mtdSales;
          continue;
        }
      }

      // Calculate derived fields
      if (data.date && data.totalSales !== undefined) {
        const totalPax = (data.reservations || 0) + (data.walkIns || 0) -
                        (data.cancellations || 0) - (data.noShows || 0);
        data.totalPax = totalPax;
        data.perHeadSpend = totalPax > 0 ? data.totalSales / totalPax : 0;

        salesDataArray.push(data as SalesData);
      }
    }

    return salesDataArray;

  } catch (error) {
    console.error('Error parsing report:', error);
    throw new Error('Failed to parse the report. Please check the format and try again.');
  }
}
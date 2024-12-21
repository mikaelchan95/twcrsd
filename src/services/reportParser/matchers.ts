import { parseCurrency } from '../../utils/currencyUtils';
import { CUSTOMER_METRICS } from './constants';
import type { SalesData } from '../../types/sales';

export function matchTotalSales(line: string): number | null {
  const match = line.match(/Total Sales\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  return match ? parseCurrency(match[1]) : null;
}

export function matchTimeSales(line: string): Partial<SalesData> {
  const data: Partial<SalesData> = {};
  
  const happyHourMatch = line.match(/Happy Hour\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  if (happyHourMatch) {
    data.happyHourSales = parseCurrency(happyHourMatch[1]);
  }

  const eveningMatch = line.match(/Sales from 7pm (?:to|-) 10pm\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  if (eveningMatch) {
    data.salesFrom7pmTo10pm = parseCurrency(eveningMatch[1]);
  }

  const lateNightMatch = line.match(/After 10pm Sales\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  if (lateNightMatch) {
    data.after10pmSales = parseCurrency(lateNightMatch[1]);
  }

  return data;
}

export function matchCategorySales(line: string): Partial<SalesData> {
  const data: Partial<SalesData> = {};

  const foodMatch = line.match(/Food\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  if (foodMatch) {
    data.foodSales = parseCurrency(foodMatch[1]);
  }

  const barMatch = line.match(/Bar\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  if (barMatch) {
    data.barSales = parseCurrency(barMatch[1]);
  }

  const wineMatch = line.match(/Wine\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  if (wineMatch) {
    data.wineSales = parseCurrency(wineMatch[1]);
  }

  return data;
}

export function matchPaymentMethod(line: string): { method: string; amount: number } | null {
  const match = line.match(/^(Cash|Amex|MasterCard|Visa|NETS)\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  if (match) {
    const [_, method, amount] = match;
    return {
      method: method.trim(),
      amount: parseCurrency(amount)
    };
  }
  return null;
}

export function matchPromotion(line: string): { name: string; amount: number; sets: number } | null {
  // Handle various promotion formats
  const patterns = [
    /^(.*?):\s*\$?([\d,]+(?:\.\d{2})?)\s*\((\d+)\s*sets?\)/i,
    /^(?:•\s*)?(.*?):\s*\$?([\d,]+(?:\.\d{2})?)\s*\((\d+)\s*sets?\)/i,
    /^(?:•\s*)?(.*?):\s*(?:Free)?\s*(?:\$?([\d,]+(?:\.\d{2})?))?\s*\((\d+)\s*sets?\)/i
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      const [_, name, amount, sets] = match;
      return {
        name: name.trim(),
        amount: amount ? parseCurrency(amount) : 0,
        sets: parseInt(sets)
      };
    }
  }
  return null;
}

export function matchCustomerMetrics(line: string): { field: keyof SalesData; value: number } | null {
  // Handle various formats including bullet points
  const patterns = Object.entries(CUSTOMER_METRICS).map(([key, field]) => ({
    pattern: new RegExp(`(?:•\\s*)?${key}\\s*:?\\s*(\\d+)(?:\\s*pax)?`, 'i'),
    field
  }));

  for (const { pattern, field } of patterns) {
    const match = line.match(pattern);
    if (match) {
      return {
        field: field as keyof SalesData,
        value: parseInt(match[1])
      };
    }
  }

  // Special cases for phone calls
  const answeredCallsMatch = line.match(/(?:•\s*)?Received and Answered Phone Call\s*:?\s*(\d+)/i);
  if (answeredCallsMatch) {
    return {
      field: 'phoneCallsAnswered',
      value: parseInt(answeredCallsMatch[1])
    };
  }

  const missedCallsMatch = line.match(/(?:•\s*)?Missed Phone Calls\s*:?\s*(\d+)/i);
  if (missedCallsMatch) {
    return {
      field: 'missedPhoneCalls',
      value: parseInt(missedCallsMatch[1])
    };
  }

  return null;
}

export function matchMTDSales(line: string): number | null {
  const match = line.match(/M\.T\.D Sales\s*:?\s*\$?([\d,]+(?:\.\d{2})?)/i);
  return match ? parseCurrency(match[1]) : null;
}
import { parse, format, isValid } from 'date-fns';

export const DATE_FORMATS = [
  'dd MMMM yyyy',
  'd MMMM yyyy',
  'MMMM d yyyy',
  'MMMM dd yyyy',
  'dd/MM/yyyy',
  'd/M/yyyy'
] as const;

export function tryParseDate(dateString: string): Date | null {
  for (const formatString of DATE_FORMATS) {
    try {
      const parsed = parse(dateString, formatString, new Date());
      if (isValid(parsed)) return parsed;
    } catch {}
  }
  
  console.warn(`Invalid date format: "${dateString}". Using current date as fallback.`);
  return null;
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
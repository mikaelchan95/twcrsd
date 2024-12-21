export function parseCurrency(str: string): number {
  return parseFloat(str.replace(/[^0-9.-]+/g, '')) || 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}
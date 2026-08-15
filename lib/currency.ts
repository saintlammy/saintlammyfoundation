export function formatCurrencyAmount(
  amount: number,
  currency: string,
  locale = 'en-NG'
): string {
  const normalizedCurrency = String(currency || 'USD').toUpperCase();
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normalizedCurrency,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toLocaleString(locale, { maximumFractionDigits: 2 })}`;
  }
}

export function formatDateTime(value: string, locale = 'en'): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

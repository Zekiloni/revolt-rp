export const htmlToPlainText = (html: string) => html.replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '');


export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US',
  useSymbol = true,
  minFractionDigits = 2,
  maxFractionDigits = 2
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: useSymbol ? 'symbol' : 'code',
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits
  }).format(value);
}

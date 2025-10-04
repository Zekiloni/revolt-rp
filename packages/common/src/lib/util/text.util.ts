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


export const isIpv4 = (ip: string): boolean => {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

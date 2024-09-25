interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const formatCurrency = (
  amount: number,
  options: CurrencyFormatOptions = {}
): string => {
  const {
    currency = 'COP',
    locale = 'es-CO',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);

  return formattedCurrency.replace(/\u00A0/g, ' ');
};

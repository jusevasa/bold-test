import { formatCurrency } from '../../../src/utils/format-currency.utils';

describe('formatCurrency', () => {
  it('formats currency with default options', () => {
    expect(formatCurrency(1000)).toBe('$ 1.000');
  });

  it('formats currency with specified currency', () => {
    expect(formatCurrency(1000, { currency: 'USD' })).toBe('US$ 1.000');
  });

  it('formats currency with minimumFractionDigits', () => {
    expect(formatCurrency(1000, { minimumFractionDigits: 2 })).toBe(
      '$ 1.000,00'
    );
  });

  it('formats currency with maximumFractionDigits', () => {
    expect(formatCurrency(1000, { maximumFractionDigits: 0 })).toBe('$ 1.000');
  });
});

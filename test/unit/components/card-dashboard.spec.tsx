import { render, screen } from '@testing-library/react';

import { CardDashboard } from '../../../src/components/card-dashboard';
import { formatCurrency } from '../../../src/utils/format-currency.utils';

vi.mock('../../../src/utils/format-currency.utils', () => ({
  formatCurrency: vi.fn((value: number) => `$${value.toFixed(2)}`),
}));

describe('CardDashboard', () => {
  const filtersMock = {
    dataphone: false,
    paymentLink: false,
    all: false,
    searchQuery: '',
    today: false,
    thisWeek: false,
    thisMonth: false,
  };

  it('renders total sales and date by filter correctly', () => {
    render(
      <CardDashboard
        filters={filtersMock}
        totalSales={1234.56}
        dateByFilter='September 2024'
        labelByDayFiltered='días'
        isLoading={false}
      />
    );

    expect(screen.getByText(/total de ventas días/i)).toBeInTheDocument();
    expect(screen.getByText('$1234.56')).toBeInTheDocument();
    expect(screen.getByText('September 2024')).toBeInTheDocument();
  });
});

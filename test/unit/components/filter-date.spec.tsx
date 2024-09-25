import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';

import { FilterDate } from '../../../src/components/filter-date';
import { useSalesContext } from '../../../src/hooks/useSalesContext';

vi.mock('../../../src/hooks/useSalesContext', () => ({
  useSalesContext: vi.fn(),
}));

describe('FilterDate', () => {
  const setFiltersMock = vi.fn();
  const filtersMock = {
    today: false,
    thisWeek: false,
    thisMonth: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSalesContext as any).mockReturnValue({
      filters: filtersMock,
      setFilters: setFiltersMock,
    });
  });

  it('renders the filter buttons correctly', () => {
    render(<FilterDate isLoading={false} />);

    expect(screen.getByRole('button', { name: /hoy/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /esta semana/i })
    ).toBeInTheDocument();

    const currentMonth = DateTime.local().toFormat('MMMM');
    expect(
      screen.getByRole('button', { name: new RegExp(currentMonth, 'i') })
    ).toBeInTheDocument();
  });
});

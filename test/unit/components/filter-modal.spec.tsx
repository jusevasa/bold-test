import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterModal } from '../../../src/components/filter-modal';
import { useSalesContext } from '../../../src/hooks/useSalesContext';

vi.mock('../../../src/hooks/useSalesContext', () => ({
  useSalesContext: vi.fn(),
}));

describe('FilterModal', () => {
  const setFiltersMock = vi.fn();
  const filtersMock = {
    dataphone: false,
    paymentLink: false,
    all: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSalesContext as any).mockReturnValue({
      filters: filtersMock,
      setFilters: setFiltersMock,
    });
  });

  it('renders the button and modal correctly', () => {
    render(<FilterModal isLoading={false} />);

    const button = screen.getByRole('button', { name: /filtrar/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('Filtrar');
  });

  it('toggles modal open and close', () => {
    render(<FilterModal isLoading={false} />);

    const button = screen.getByRole('button', { name: /filtrar/i });
    fireEvent.click(button);

    expect(screen.getByRole('dialog')).toBeVisible();

    const closeButton = screen.getByLabelText(/Cerrar/i);
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });

  it('applies filters when the Apply button is clicked', () => {
    render(<FilterModal isLoading={false} />);

    const button = screen.getByRole('button', { name: /filtrar/i });
    fireEvent.click(button);

    const dataphoneCheckbox = screen.getByLabelText(/cobro con datáfono/i);
    fireEvent.click(dataphoneCheckbox);

    const applyButton = screen.getByRole('button', { name: /aplicar/i });
    fireEvent.click(applyButton);

    expect(setFiltersMock).toHaveBeenCalledWith({
      dataphone: true,
      paymentLink: false,
      all: false,
    });
  });

  it('closes modal on outside click and Escape key press', () => {
    const { container } = render(<FilterModal isLoading={false} />);

    const button = screen.getByRole('button', { name: /filtrar/i });
    fireEvent.click(button);

    expect(screen.getByRole('dialog')).toBeVisible();

    fireEvent.mouseDown(container);
    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    fireEvent.click(button);

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });
});

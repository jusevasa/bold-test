import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../../../src/components/header';

describe('Header', () => {
  it('renders the header with correct elements', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();

    const boldIcon = screen.getByRole('img');
    expect(boldIcon).toBeInTheDocument();

    expect(screen.getByText('Mi negocio')).toBeInTheDocument();
    expect(screen.getByText('Ayuda')).toBeInTheDocument();

    const helpIcon = screen.getByRole('img', { hidden: true });
    expect(helpIcon).toBeInTheDocument();
  });

  it('renders navigation items correctly', () => {
    render(<Header />);

    const ayudaItem = screen.getByText('Ayuda');
    expect(ayudaItem).toBeInTheDocument();
    expect(ayudaItem).toHaveClass('flex gap-1 justify-center items-center');
  });
});

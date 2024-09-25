import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalTransaction } from '../../../src/components/modal-transaction';
import { Transaction } from '../../../src/types/transaction.type';
import { Status } from '../../../src/enums/status.enum';
import { PaymentMethod } from '../../../src/enums/payment-method.enum';
import { SalesType } from '../../../src/enums/sales-type.enum';

describe('ModalTransaction', () => {
  const mockTransaction: Transaction = {
    id: '1',
    status: Status.successful,
    createdAt: Date.now(),
    paymentMethod: PaymentMethod.bancolombia,
    transactionReference: 123456,
    amount: 10000,
    salesType: SalesType.paymentLink,
    deduction: 1000,
  };

  it('renders the modal when isOpen is true', () => {
    render(
      <ModalTransaction
        isOpen={true}
        onClose={jest.fn()}
        transaction={mockTransaction}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Detalles de la transacción')).toBeInTheDocument();
    expect(screen.getByText('¡Cobro exitoso!')).toBeInTheDocument();
    expect(screen.getByText('10000')).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    const { container } = render(
      <ModalTransaction
        isOpen={false}
        onClose={jest.fn()}
        transaction={mockTransaction}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when the close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <ModalTransaction
        isOpen={true}
        onClose={handleClose}
        transaction={mockTransaction}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('displays transaction details correctly', () => {
    render(
      <ModalTransaction
        isOpen={true}
        onClose={jest.fn()}
        transaction={mockTransaction}
      />
    );

    expect(screen.getByText(mockTransaction.id)).toBeInTheDocument();
    expect(screen.getByText('- 10,000')).toBeInTheDocument();
  });

  it('renders the correct payment method', () => {
    render(
      <ModalTransaction
        isOpen={true}
        onClose={jest.fn()}
        transaction={mockTransaction}
      />
    );

    expect(screen.getByText(PaymentMethod.bancolombia)).toBeInTheDocument();
  });

  it('renders the correct sales type', () => {
    render(
      <ModalTransaction
        isOpen={true}
        onClose={jest.fn()}
        transaction={mockTransaction}
      />
    );

    expect(screen.getByText('Link de pagos')).toBeInTheDocument();
  });
});

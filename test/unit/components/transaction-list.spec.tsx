import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionList } from '../../../src/components/transaction-list';
import { Transaction } from '../../../src/types/transaction.type';
import { Status } from '../../../src/enums/status.enum';
import { PaymentMethod } from '../../../src/enums/payment-method.enum';
import { SalesType } from '../../../src/enums/sales-type.enum';

describe('TransactionList', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      status: Status.successful,
      createdAt: Date.now(),
      paymentMethod: PaymentMethod.bancolombia,
      transactionReference: 123456,
      amount: 10000,
      salesType: SalesType.paymentLink,
      deduction: 1000,
    },
  ];

  it('renders loading state', () => {
    render(
      <TransactionList transactions={[]} onClick={vi.fn()} isLoading={true} />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders transaction data', () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        onClick={vi.fn()}
        isLoading={false}
      />
    );
    expect(screen.getByText('Transacción')).toBeInTheDocument();
    expect(screen.getByText('Cobro exitoso')).toBeInTheDocument();
  });

  it('calls onClick when transaction is clicked', () => {
    const handleClick = vi.fn();
    render(
      <TransactionList
        transactions={mockTransactions}
        onClick={handleClick}
        isLoading={false}
      />
    );

    const transactionRow = screen.getByText('Cobro exitoso').closest('tr');
    if (transactionRow) {
      fireEvent.click(transactionRow);
    }

    expect(handleClick).toHaveBeenCalledWith(mockTransactions[0]);
  });
});

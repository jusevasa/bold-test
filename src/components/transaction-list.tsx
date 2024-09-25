import { Link, ReceiptText } from 'lucide-react';
import { DateTime } from 'luxon';

import { BancolombiaIcon } from './icons/bancolombia-icon';
import { DaviPlataIcon } from './icons/daviplata-icon';
import { formatCurrency } from '../utils/format-currency.utils';
import { Franchise } from '../enums/franchise.enum';
import { MasterCardIcon } from './icons/mastercard-icon';
import { NequiIcon } from './icons/nequi-icon';
import { PaymentMethod } from '../enums/payment-method.enum';
import { SalesType } from '../enums/sales-type.enum';
import { Status } from '../enums/status.enum';
import { Transaction } from '../types/transaction.type';
import { VisaIcon } from './icons/visa-icon';
import pseIcon from '../assets/pse.png';

interface TransactionListProps {
  transactions: Transaction[];
  onClick: (transaction: Transaction) => void;
  isLoading: boolean;
}

export const TransactionList = ({
  transactions,
  onClick,
  isLoading,
}: TransactionListProps) => {
  const isDedution = (transaction: Transaction): boolean => {
    return transaction.status === Status.successful;
  };

  if (isLoading) return <SkeletonLoader />;

  return (
    <table className='w-full mt-[1px]'>
      <thead>
        <tr className='bg-white text-xs [&>*]:font-normal [&>*]:text-left [&>*]:pl-4 [&>*]:py-2'>
          <th>Transacción</th>
          <th>Fecha y hora</th>
          <th>Método de pago</th>
          <th>ID Transacción Bold</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <tr
            key={transaction.id}
            className={`relative bg-white border-b-2 border-grey-light transition-colors cursor-pointer hover:bg-gray-100 ${
              index % 2 === 1
                ? 'md:after:content-[""] md:after:absolute md:after:left-0 after:w-1 md:after:h-full md:after:bg-primary'
                : ''
            }`}
            onClick={() => onClick(transaction)}
            data-testid="transaction-item"
          >
            <td className={isDedution(transaction) ? 'pb-8' : ''}>
              {renderStatus({
                status: transaction.status,
                salesType: transaction.salesType,
              })}
            </td>
            <td
              className={
                isDedution(transaction) ? 'text-sm pl-4 pb-8' : 'text-sm pl-4'
              }
            >
              {DateTime.fromMillis(transaction.createdAt).toFormat(
                'd/M/yyyy - HH:mm:ss'
              )}
            </td>
            <td className={isDedution(transaction) ? 'pb-8' : ''}>
              {renderPaymentMethod({
                paymentMethod: transaction.paymentMethod,
                transactionReference: transaction.transactionReference,
                franchise: transaction.franchise,
              })}
            </td>
            <td
              className={
                isDedution(transaction)
                  ? 'font-mono text-sm pl-4 pb-8'
                  : 'font-mono text-sm pl-4'
              }
            >
              {transaction.id}
            </td>
            <td className='pl-4'>
              {renderAmount({
                amount: transaction.amount,
                status: transaction.status,
                deduction: transaction.deduction,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const renderStatus = ({
  status,
  salesType,
}: {
  status: Status;
  salesType: SalesType;
}) => {
  const salesTypeIconMap: Record<SalesType, JSX.Element> = {
    [SalesType.paymentLink]: <Link className='w-4 h-4' />,
    [SalesType.terminal]: <ReceiptText className='w-4 h-4' />,
  };

  const SalesTypeIcon = salesTypeIconMap[salesType];

  switch (status) {
    case Status.rejected:
      return (
        <div className='text-primary flex gap-x-2 justify-start items-center text-sm pl-4'>
          {SalesTypeIcon}
          Cobro no realizado
        </div>
      );
    case Status.successful:
      return (
        <div className='text-primary flex gap-x-2 justify-start items-center text-sm pl-4'>
          {SalesTypeIcon}
          Cobro exitoso
        </div>
      );
  }
};

const renderPaymentMethod = ({
  paymentMethod,
  transactionReference,
  franchise,
}: {
  paymentMethod: PaymentMethod;
  transactionReference: number;
  franchise?: Franchise;
}): JSX.Element | string => {
  const franchiseIconMap: Record<Franchise, JSX.Element> = {
    [Franchise.mastercard]: <MasterCardIcon className='w-10 h-10' />,
    [Franchise.visa]: <VisaIcon className='w-7 h-7' />,
  };

  const paymentMethodIconMap: Record<PaymentMethod, JSX.Element | null> = {
    [PaymentMethod.bancolombia]: <BancolombiaIcon className='w-10 h-10' />,
    [PaymentMethod.daviplata]: <DaviPlataIcon className='w-10 h-10' />,
    [PaymentMethod.nequi]: <NequiIcon className='w-10 h-10' />,
    [PaymentMethod.pse]: (
      <img
        src={pseIcon}
        alt='pse'
        className='w-10 h-10'
        width={100}
        height={100}
      />
    ),
    [PaymentMethod.card]: null,
  };

  if (paymentMethod === PaymentMethod.card && franchise) {
    const FranchiseIcon = franchiseIconMap[franchise];

    return (
      <div className='flex gap-x-2 justify-start items-center text-sm pl-4'>
        {FranchiseIcon}
        **** {transactionReference}
      </div>
    );
  }

  const PaymentIcon = paymentMethodIconMap[paymentMethod];

  if (PaymentIcon) {
    return (
      <div className='flex gap-x-2 justify-start items-center text-sm pl-4'>
        {PaymentIcon}
        <span className='text-black'>{paymentMethod}</span>
      </div>
    );
  }

  return <div className='text-black'>{paymentMethod}</div>;
};

const renderAmount = ({
  amount,
  status,
  deduction,
}: {
  amount: number;
  status: Status;
  deduction?: number;
}): JSX.Element => {
  return (
    <div className='flex flex-col py-5'>
      <div className='text-primary text-sm'>{formatCurrency(amount)}</div>
      {status === Status.successful && (
        <div className='flex flex-col text-xs'>
          <p className='text-grey-dark'>Deducción Bold</p>
          {deduction ? (
            <div className='text-secondary font-normal'>
              - {formatCurrency(deduction)}
            </div>
          ) : (
            <span className='h-4'></span>
          )}
        </div>
      )}
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div role='status' className='flex justify-center items-center h-80'>
      <svg
        aria-hidden='true'
        className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-300 fill-primary'
        viewBox='0 0 100 101'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

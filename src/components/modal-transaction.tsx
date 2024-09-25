import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Link, CircleX, ReceiptText } from 'lucide-react';
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

interface ModalTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

export const ModalTransaction: React.FC<ModalTransactionProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const [animateModal, setAnimateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setTimeout(() => setAnimateModal(true), 20);
    } else {
      setAnimateModal(false);
      const timer = setTimeout(() => setShowModal(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showModal) return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      data-testid='modal-detail'
      role='dialog'
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out ${
          animateModal ? 'opacity-25' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm transform overflow-hidden bg-white shadow-2xl transition-all duration-500 ease-in-out sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-l-lg ${
          animateModal
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b border-gray-200 p-4'>
            <h2 className='text-lg font-semibold text-primary'>
              Detalles de la transacción
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-500'
              role='button'
            >
              <X className='h-6 w-6 text-primary' />
            </button>
          </div>
          {transaction && (
            <div className='flex-1 overflow-y-auto p-6'>
              {renderIconStatus(transaction.status)}
              <div className='mb-6 text-center'>
                <p className='text-3xl font-bold text-primary'>
                  {formatCurrency(transaction.amount)}
                </p>
                <p className='text-sm text-grey-dark'>
                  {DateTime.fromMillis(transaction.createdAt).toFormat(
                    'd/M/yyyy - HH:mm:ss'
                  )}
                </p>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-grey-dark'>ID transacción Bold</span>
                  <span className='font-semibold text-primary'>
                    {transaction.id}
                  </span>
                </div>
                {transaction.deduction && (
                  <div className='flex justify-between items-center'>
                    <span className='text-grey-dark'>Deducción Bold</span>
                    <span className='font-semibold text-secondary'>
                      - {formatCurrency(transaction.deduction)}
                    </span>
                  </div>
                )}
                <hr className='border-grey-dark my-2 border-size-3' />
                <div className='flex justify-between items-center'>
                  <span className='text-grey-dark'>Método de pago</span>
                  {renderPaymentMethod({
                    paymentMethod: transaction.paymentMethod,
                    transactionReference: transaction.transactionReference,
                    franchise: transaction.franchise,
                  })}
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-grey-dark'>Tipo de pago</span>
                  {renderSaleType(transaction.salesType)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const renderIconStatus = (status: Status) => {
  switch (status) {
    case Status.rejected:
      return (
        <div className='text-black flex justify-center items-center flex-col mb-2'>
          <CircleX className='w-10 h-10 text-secondary' />
          <h3 className='font-bold'>Cobro no realizado</h3>
        </div>
      );
    case Status.successful:
      return (
        <div className='text-black flex justify-center items-center flex-col mb-2'>
          <CheckCircle className='w-10 h-10 text-green-600' />
          <h3 className='font-bold'>¡Cobro exitoso!</h3>
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
      <div className='flex gap-x-2 justify-start items-center text-sm pl-4 text-grey-dark'>
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
        <span className='text-grey-dark'>{paymentMethod}</span>
      </div>
    );
  }

  return <div className='text-grey-dark'>{paymentMethod}</div>;
};

const renderSaleType = (saleType: SalesType) => {
  switch (saleType) {
    case SalesType.paymentLink:
      return (
        <div className='text-primary font-bold flex gap-x-2 justify-start items-center text-sm pl-4'>
          <Link className='w-4 h-4' />
          Link de pagos
        </div>
      );
    case SalesType.terminal:
      return (
        <div className='text-primary font-bold flex gap-x-2 justify-start items-center text-sm pl-4'>
          <ReceiptText className='w-4 h-4' />
          Terminal
        </div>
      );
  }
};

import { InfoIcon } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

import { formatCurrency } from '../utils/format-currency.utils';

interface CardDashboardProps {
  filters: {
    dataphone: boolean;
    paymentLink: boolean;
    all: boolean;
    searchQuery: string;
    today: boolean;
    thisWeek: boolean;
    thisMonth: boolean;
  };
  totalSales: number;
  dateByFilter: string;
  labelByDayFiltered: string;
  isLoading: boolean;
}

export const CardDashboard = ({
  filters,
  totalSales,
  dateByFilter,
  labelByDayFiltered,
  isLoading,
}: CardDashboardProps) => {
  const renderTooltip = () => {
    if (filters.today) return 'Total de ventas del día de hoy';
    if (filters.thisWeek) return 'Total de ventas de la semana actual';
    if (filters.thisMonth) return 'Total consolidado de ventas del mes';
    return '';
  };
  if (isLoading) return <CardDashboardSkeleton />;
  return (
    <div className='bg-white shadow-md rounded-lg' data-testid="card-dashboard">
      <div className='flex justify-between items-center bg-gradient-to-r from-primary to-secondary rounded-t-lg p-3'>
        <p className='text-white text-sm' data-testid="dashboard-total-sales">
          Total de ventas {labelByDayFiltered.toLowerCase()}
        </p>
        <InfoIcon className='w-4 h-4 text-white' data-tooltip-id='my-tooltip' role='img' />
        <Tooltip place='top' id='my-tooltip'>
          {renderTooltip()}
        </Tooltip>
      </div>
      <div className='flex justify-center items-center flex-col pt-4 pb-2 gap-y-2'>
        <p className='font-bold text-lg bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text'>
          {formatCurrency(totalSales)}
        </p>
        <span className='text-sm'>{dateByFilter}</span>
      </div>
    </div>
  );
};

const CardDashboardSkeleton = () => {
  return (
    <div className='bg-white shadow-md rounded-lg animate-pulse'>
      <div className='flex justify-between items-center bg-gradient-to-r from-primary to-secondary rounded-t-lg p-3'>
        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        <div className='w-4 h-4 bg-gray-200 rounded-full'></div>
      </div>
      <div className='flex justify-center items-center flex-col pt-4 pb-2 gap-y-2'>
        <div className='h-8 bg-gray-200 rounded w-3/4'></div>
        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
      </div>
    </div>
  );
};

import { DateTime } from 'luxon';
import { useSalesContext } from '../hooks/useSalesContext';
import { SalesContextType } from '../context/sales.context';
import { capitalizeFirstCharacter } from '../utils/capitalize.utils';

interface FilterDateProps {
  isLoading: boolean;
}
export const FilterDate = ({ isLoading }: FilterDateProps) => {
  const { filters, setFilters } = useSalesContext();

  const currentMonth = DateTime.local().toFormat('MMMM');

  const handleFilterChange = (
    filterType: keyof SalesContextType['filters']
  ) => {
    setFilters((prevFilters: SalesContextType['filters']) => ({
      ...prevFilters,
      today: filterType === 'today',
      thisWeek: filterType === 'thisWeek',
      thisMonth: filterType === 'thisMonth',
    }));
  };

  if (isLoading) return <FilterDateSkeleton />;

  return (
    <nav className='bg-white w-full text-primary px-3 py-2 grid grid-cols-3 gap-x-2 justify-between items-center rounded-md'>
      <button
        className={`hover:bg-slate-100 transition-colors rounded-full w-full radius-md py-1 ${
          filters.today
            ? 'bg-grey-light hover:bg-grey-light cursor-default'
            : ''
        }`}
        onClick={() => handleFilterChange('today')}
      >
        Hoy
      </button>
      <button
        className={`w-full py-1 rounded-full hover:bg-slate-100 transition-colors ${
          filters.thisWeek
            ? 'bg-grey-light hover:bg-grey-light cursor-default'
            : ''
        }`}
        onClick={() => handleFilterChange('thisWeek')}
      >
        Esta semana
      </button>
      <button
        className={`w-full py-1 rounded-full hover:bg-slate-100 transition-colors ${
          filters.thisMonth
            ? 'bg-grey-light hover:bg-grey-light cursor-default'
            : ''
        }`}
        onClick={() => handleFilterChange('thisMonth')}
      >
        {capitalizeFirstCharacter(currentMonth)}
      </button>
    </nav>
  );
};

const FilterDateSkeleton = () => {
  return (
    <nav className='bg-white w-full text-primary px-3 py-2 grid grid-cols-3 gap-x-2 justify-between items-center rounded-md'>
      <div className='h-10 bg-gray-200 rounded-full w-full animate-pulse'></div>
      <div className='h-10 bg-gray-200 rounded-full w-full animate-pulse'></div>
      <div className='h-10 bg-gray-200 rounded-full w-full animate-pulse'></div>
    </nav>
  );
};

import React from 'react';
import { DateTime } from 'luxon';
import { capitalizeFirstCharacter } from '../utils/capitalize.utils';
import { useSales } from '../hooks/useSalesContext';

interface FilterDateProps {
  isLoading: boolean;
}

export const FilterDate: React.FC<FilterDateProps> = ({ isLoading }) => {
  const { state, dispatch } = useSales();
  const { filters } = state;

  const currentMonth = DateTime.local().toFormat('MMMM');

  const filterOptions = [
    { key: 'today', label: 'Hoy' },
    { key: 'thisWeek', label: 'Esta semana' },
    { key: 'thisMonth', label: capitalizeFirstCharacter(currentMonth) },
  ] as const;

  const handleFilterChange = (
    filterType: 'today' | 'thisWeek' | 'thisMonth'
  ) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        ...filters,
        today: filterType === 'today',
        thisWeek: filterType === 'thisWeek',
        thisMonth: filterType === 'thisMonth',
      },
    });
  };
  
  if (isLoading) return <FilterDateSkeleton />;

  return (
    <nav className='bg-white w-full text-primary px-3 py-2 grid grid-cols-3 gap-x-2 justify-between items-center rounded-md'>
      {filterOptions.map(({ key, label }) => (
        <button
          key={key}
          className={`w-full py-1 rounded-full transition-colors ${
            filters[key] ? 'bg-grey-light cursor-default' : 'hover:bg-slate-100'
          }`}
          onClick={() => handleFilterChange(key)}
          disabled={filters[key]}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

const FilterDateSkeleton: React.FC = () => (
  <nav className='bg-white w-full text-primary px-3 py-2 grid grid-cols-3 gap-x-2 justify-between items-center rounded-md'>
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className='h-10 bg-gray-200 rounded-full w-full animate-pulse'
      />
    ))}
  </nav>
);

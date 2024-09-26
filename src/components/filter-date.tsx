import { DateTime } from 'luxon';
import { capitalizeFirstCharacter } from '../utils/capitalize.utils';
import { SalesContextType } from '../context/sales.context';
import { useSalesContext } from '../hooks/useSalesContext';

interface FilterDateProps {
  isLoading: boolean;
}

export const FilterDate = ({ isLoading }: FilterDateProps) => {
  const { filters, setFilters } = useSalesContext();

  const currentMonth = DateTime.local().toFormat('MMMM');

  const filterOptions = [
    { key: 'today', label: 'Hoy' },
    { key: 'thisWeek', label: 'Esta semana' },
    { key: 'thisMonth', label: capitalizeFirstCharacter(currentMonth) },
  ] as const;

  const handleFilterChange = (filterType: keyof SalesContextType['filters']) => {
    setFilters((prevFilters:SalesContextType['filters']) => ({
      ...Object.fromEntries(
        Object.keys(prevFilters).map((key) => [key, key === filterType])
      ),
    }));
  };

  if (isLoading) return <FilterDateSkeleton />;

  return (
    <nav className="bg-white w-full text-primary px-3 py-2 grid grid-cols-3 gap-x-2 justify-between items-center rounded-md">
      {filterOptions.map(({ key, label }) => (
        <button
          key={key}
          className={`w-full py-1 rounded-full transition-colors ${
            filters[key]
              ? 'bg-grey-light cursor-default'
              : 'hover:bg-slate-100'
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

const FilterDateSkeleton = () => (
  <nav className="bg-white w-full text-primary px-3 py-2 grid grid-cols-3 gap-x-2 justify-between items-center rounded-md">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="h-10 bg-gray-200 rounded-full w-full animate-pulse" />
    ))}
  </nav>
);
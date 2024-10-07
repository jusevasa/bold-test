import { DateTime } from 'luxon';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Layout } from './sections/layout';
import { TransactionList } from './components/transaction-list';
import { FilterModal } from './components/filter-modal';
import { fetchTransactions } from './services/transactions.service';
import { FilterDate } from './components/filter-date';
import { capitalizeFirstCharacter } from './utils/capitalize.utils';
import { ModalTransaction } from './components/modal-transaction';
import { Transaction } from './types/transaction.type';
import { CardDashboard } from './components/card-dashboard';
import { useSales } from './hooks/useSalesContext';

function App() {
  const { state, dispatch, filteredTransactions } = useSales();
  const { filters, totalSales } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction>();

  useEffect(() => {
    const getTransactions = async () => {
      setIsLoading(true);
      try {
        const fetchedTransactions = await fetchTransactions();
        dispatch({ type: 'SET_TRANSACTIONS', payload: fetchedTransactions });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getTransactions();
  }, [dispatch]);

  const renderDateByFilter = useMemo(() => {
    const today = DateTime.local().toFormat("dd 'de' MMMM yyyy");
    const startOfWeek = DateTime.local().startOf('week').toFormat('MMM dd, yy');
    const endOfWeek = DateTime.local().endOf('week').toFormat('MMM dd, yy');
    const month = DateTime.local().toFormat('MMMM, yyyy');

    if (filters.today) return today;
    if (filters.thisWeek)
      return `${capitalizeFirstCharacter(
        startOfWeek
      )} - ${capitalizeFirstCharacter(endOfWeek)}`;
    if (filters.thisMonth) return capitalizeFirstCharacter(month);
    return '';
  }, [filters.today, filters.thisWeek, filters.thisMonth]);

  const renderLabelDayFiltered = useMemo(() => {
    const currentMonth = DateTime.local().toFormat('MMMM');

    if (filters.today) return 'Hoy';
    if (filters.thisWeek) return 'en Esta semana';
    if (filters.thisMonth) return capitalizeFirstCharacter(currentMonth);

    return '';
  }, [filters.today, filters.thisWeek, filters.thisMonth]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FILTERS', payload: { searchQuery: e.target.value } });
  };

  return (
    <Layout>
      <main className='max-w-5xl mx-auto px-6'>
        <section className='pt-10 max-w-screen-xl mx-auto'>
          <div className='grid grid-cols-1 gap-y-10 md:grid-cols-[300px,1fr] md:gap-x-10'>
            <CardDashboard
              filters={filters}
              totalSales={totalSales}
              dateByFilter={renderDateByFilter}
              labelByDayFiltered={renderLabelDayFiltered}
              isLoading={isLoading}
            />
            <div className='flex flex-col gap-y-3'>
              <FilterDate isLoading={isLoading} />
              <FilterModal isLoading={isLoading} />
            </div>
          </div>
          <div className='flex flex-col bg-gradient-to-r from-primary to-secondary rounded-t-2xl mt-4'>
            <div className='p-3 text-white'>
              <h2 className='text-sm'>
                Tus ventas {renderLabelDayFiltered.toLowerCase()}
              </h2>
            </div>
            <div className='flex bg-white justify-center items-center'>
              <div className='px-3 py-5'>
                <Search className='w-4 h-4 text-gray-300' />
              </div>
              <input
                type='text'
                placeholder='Buscar'
                className='w-full text-sm text-gray-dark bg-transparent px-4 py-2 focus:outline-none'
                value={filters.searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <TransactionList
            transactions={filteredTransactions}
            onClick={(transaction) => {
              setIsModalOpen(true);
              setCurrentTransaction(transaction);
            }}
            isLoading={isLoading}
          />
        </section>
      </main>
      <ModalTransaction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={currentTransaction}
      />
    </Layout>
  );
}

export default App;

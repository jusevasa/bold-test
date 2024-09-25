import { createContext, useEffect, useState } from 'react';
import { Transaction } from '../types/transaction.type';
import { SalesType } from '../enums/sales-type.enum';
import { DateTime } from 'luxon';


export interface SalesContextType {
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
  filteredTransactions: Transaction[];
  transactions: Transaction[];
  setFilters: React.Dispatch<React.SetStateAction<unknown>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  updateTotalSales: (amount: number) => void;
}

export const SalesContext = createContext<SalesContextType | undefined>(
  undefined
);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('salesFilters');
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          dataphone: false,
          paymentLink: false,
          today: true,
          thisWeek: false,
          thisMonth: false,
          all: true,
          searchQuery: '',
        };
  });

  const [totalSales, setTotalSales] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  useEffect(() => {
    localStorage.setItem('salesFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...transactions];

      if (filters.today) {
        const today = DateTime.local().startOf('day');
        filtered = filtered.filter((transaction) =>
          DateTime.fromMillis(transaction.createdAt).hasSame(today, 'day')
        );
      } else if (filters.thisWeek) {
        const startOfWeek = DateTime.local().startOf('week');
        const endOfWeek = DateTime.local().endOf('week');
        filtered = filtered.filter((transaction) => {
          const transactionDate = DateTime.fromMillis(transaction.createdAt);
          return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        });
      } else if (filters.thisMonth) {
        const startOfMonth = DateTime.local().startOf('month');
        const endOfMonth = DateTime.local().endOf('month');
        filtered = filtered.filter((transaction) => {
          const transactionDate = DateTime.fromMillis(transaction.createdAt);
          return (
            transactionDate >= startOfMonth && transactionDate <= endOfMonth
          );
        });
      }

      if (!filters.all) {
        filtered = filtered.filter((transaction) => {
          if (
            filters.dataphone &&
            transaction.salesType === SalesType.terminal
          )
            return true;
          if (
            filters.paymentLink &&
            transaction.salesType === SalesType.paymentLink
          )
            return true;
          return false;
        });
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();

        filtered = filtered.filter((transaction) => {
          return (
            transaction.id.toString().toLowerCase().includes(query) ||
            new Date(transaction.createdAt)
              .toLocaleString()
              .toLowerCase()
              .includes(query) ||
            transaction.paymentMethod.toLowerCase().includes(query) ||
            transaction.franchise?.toLowerCase().includes(query) ||
            transaction.amount.toString().toLowerCase().includes(query)
          );
        });
      }

      setFilteredTransactions(filtered);

      const total = filtered.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      setTotalSales(total);
    };

    applyFilters();
  }, [filters, transactions]);

  return (
    <SalesContext.Provider
      value={{
        filters,
        totalSales,
        filteredTransactions,
        transactions,
        setFilters,
        setTransactions,
        updateTotalSales: setTotalSales,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

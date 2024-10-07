import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import { Transaction } from '../types/transaction.type';
import { SalesType } from '../enums/sales-type.enum';
import { DateTime } from 'luxon';
import { StateSales } from '../interfaces/sales.interface';
import { ActionSales } from '../types/sales-actions.type';

export interface SalesContextType {
  state: StateSales;
  dispatch: React.Dispatch<ActionSales>;
  filteredTransactions: Transaction[];
}

const salesReducer = (state: StateSales, action: ActionSales): StateSales => {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'UPDATE_TOTAL_SALES':
      return { ...state, totalSales: action.payload };
    default:
      return state;
  }
};

export const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(salesReducer, {
    filters: {
      dataphone: false,
      paymentLink: false,
      today: true,
      thisWeek: false,
      thisMonth: false,
      all: true,
      searchQuery: '',
    },
    totalSales: 0,
    transactions: [],
  });

  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem('salesFilters');
      if (savedFilters) {
        dispatch({ type: 'SET_FILTERS', payload: JSON.parse(savedFilters) });
      }
    } catch (error) {
      console.error('Error loading filters from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('salesFilters', JSON.stringify(state.filters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  }, [state.filters]);

  const filteredTransactions = useMemo(() => {
    let filtered = state.transactions;
  
    // Filtro para 'today'
    if (state.filters.today) {
      const today = DateTime.local().startOf('day');
      filtered = filtered.filter((transaction) => {
        const transactionDate = DateTime.fromMillis(transaction.createdAt);
        // Comparación directa de las fechas
        return transactionDate >= today && transactionDate < today.plus({ days: 1 });
      });
    }
    
    // Filtro para 'thisWeek'
    else if (state.filters.thisWeek) {
      const startOfWeek = DateTime.local().startOf('week');
      const endOfWeek = DateTime.local().endOf('week');
      filtered = filtered.filter((transaction) => {
        const transactionDate = DateTime.fromMillis(transaction.createdAt);
        // Comparación dentro del rango de la semana
        return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
      });
    }
    
    // Filtro para 'thisMonth'
    else if (state.filters.thisMonth) {
      const startOfMonth = DateTime.local().startOf('month');
      const endOfMonth = DateTime.local().endOf('month');
      filtered = filtered.filter((transaction) => {
        const transactionDate = DateTime.fromMillis(transaction.createdAt);
        return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
      });
    }
  
    // Filtrar por tipos de ventas (dataphone, paymentLink)
    if (!state.filters.all) {
      filtered = filtered.filter((transaction) => {
        if (state.filters.dataphone && transaction.salesType === SalesType.terminal) return true;
        if (state.filters.paymentLink && transaction.salesType === SalesType.paymentLink) return true;
        return false;
      });
    }
  
    // Filtro por búsqueda (searchQuery)
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter((transaction) => {
        return (
          transaction.id.toString().toLowerCase().includes(query) ||
          new Date(transaction.createdAt).toLocaleString().toLowerCase().includes(query) ||
          transaction.paymentMethod.toLowerCase().includes(query) ||
          transaction.franchise?.toLowerCase().includes(query) ||
          transaction.amount.toString().toLowerCase().includes(query)
        );
      });
    }
  
    return filtered;
  }, [state.filters, state.transactions]);

  const totalSales = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [filteredTransactions]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_TOTAL_SALES', payload: totalSales });
  }, [totalSales]);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    filteredTransactions,
  }), [state, filteredTransactions]);

  return (
    <SalesContext.Provider value={contextValue}>
      {children}
    </SalesContext.Provider>
  );
};

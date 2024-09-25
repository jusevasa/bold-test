import { useContext } from 'react';

import { SalesContext } from '../context/sales.context';

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext must be used within a SalesProvider');
  }
  return context;
};

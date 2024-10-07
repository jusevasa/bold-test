import { FiltersSales } from '../interfaces/sales.interface';
import { Transaction } from './transaction.type';

export type ActionSales =
  | { type: 'SET_FILTERS'; payload: Partial<FiltersSales> }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'UPDATE_TOTAL_SALES'; payload: number };

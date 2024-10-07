import { Transaction } from '../types/transaction.type';

export interface StateSales {
  filters: FiltersSales;
  totalSales: number;
  transactions: Transaction[];
}

export interface FiltersSales {
  dataphone: boolean;
  paymentLink: boolean;
  all: boolean;
  searchQuery: string;
  today: boolean;
  thisWeek: boolean;
  thisMonth: boolean;
}

import { Transaction } from '../types/transaction.type';

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.data) {
      throw new Error('Invalid response structure');
    }

    return data.data;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
};

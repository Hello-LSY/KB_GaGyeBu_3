import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: []
  }),
  actions: {
    async fetchTransactions() {
      const response = await axios.get('http://localhost:3000/transactions');
      this.transactions = response.data;
    }
  }
});

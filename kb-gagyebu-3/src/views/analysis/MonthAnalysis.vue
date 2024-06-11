<template>
  <div>
    <h2>Monthly Income and Expenses</h2>
    <div v-if="Object.keys(monthlySummary).length > 0">
      <div v-for="(summary, month) in monthlySummary" :key="month">
        <h5>{{ month }}</h5>
        <p>총 수익: {{ summary.income }}</p>
        <p>총 지출: {{ summary.expense }}</p>
        <p>순 수익: {{ summary.net }}</p>
      </div>
    </div>
    <div v-else>
      <p>No transaction data available.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactions';

const transactionStore = useTransactionStore();

onMounted(async () => {
  await transactionStore.fetchTransactions();
});

const monthlySummary = computed(() => {
  const summary = {};
  transactionStore.transactions.forEach(transaction => {
    const month = transaction.start.slice(0, 7); // 'YYYY-MM' 형식으로 자르기
    if (!summary[month]) {
      summary[month] = { income: 0, expense: 0, net: 0 };
    }
    if (transaction.type === 'income') {
      summary[month].income += parseFloat(transaction.amount);
    } else if (transaction.type === 'expense') {
      summary[month].expense += parseFloat(transaction.amount);
    }
    summary[month].net = summary[month].income - summary[month].expense;
  });
  return summary;
});
</script>

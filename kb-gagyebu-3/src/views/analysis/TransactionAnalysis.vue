<template>
  <div>
    <h2>User Transaction Summary</h2>
    <div v-if="users.length > 0">
      <div v-for="user in users" :key="user.id">
        <h5>{{ user.name }}</h5>
        <p>총 수익: {{ user.totalIncome }}</p>
        <p>총 지출: {{ user.totalExpense }}</p>
        <p>순 수익: {{ user.netIncome }}</p>
      </div>
    </div>
    <div v-else>
      <p>No user data available.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/users';
import { useTransactionStore } from '@/stores/transactions';

const userStore = useUserStore();
const transactionStore = useTransactionStore();

onMounted(async () => {
  await userStore.fetchUsers();
  await transactionStore.fetchTransactions();
});

const users = computed(() => {
  return userStore.users.map(user => {
    const transactions = transactionStore.transactions.filter(t => t.userId === user.id);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const netIncome = totalIncome - totalExpense;
    return { ...user, totalIncome, totalExpense, netIncome };
  });
});
</script>

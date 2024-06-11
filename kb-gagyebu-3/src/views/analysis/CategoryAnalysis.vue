<template>
  <div>
    <h2>Category-wise Expense Analysis</h2>
    <div v-if="expenseCategories.length > 0">
      <div v-for="category in expenseCategories" :key="category.id">
        <h5>{{ category.name }}</h5>
        <p>토탈 지출: {{ category.total }}</p>
      </div>
    </div>
    <div v-else>
      <p>No expense data available.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactions';
import { useCategoryStore } from '@/stores/categories';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

onMounted(async () => {
  await transactionStore.fetchTransactions();
  await categoryStore.fetchCategories();
});

const expenseCategories = computed(() => {
  const categories = categoryStore.categories.filter(c => c.type === 'expense');
  return categories.map(category => {
    const total = transactionStore.transactions
      .filter(t => t.categoryId === category.id && t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return { ...category, total };
  });
});
</script>

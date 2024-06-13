<template>
  <div class="container flex-column" >
    <div class="tab-buttons d-flex justify-content-start mt-3 mb-3 mx-2">
      <button class="tab-btn" :class="{ 'active': isIncome === false }" @click="selectTab(false)">지출</button>
      <button class="tab-btn" :class="{ 'active': isIncome === true }" @click="selectTab(true)">수입</button>
    </div>
    <div v-if="isIncome" class="contents">
        <div class="chart-container mb-3">
          <Doughnut v-if="loaded" :data="incomeChartData" :options="chartOptions" />
        </div>
        <ul v-if="loaded" class="details-list">
          <li v-for="(value, key, index) in incomeDetails" :key="index">
            <span class="color-box" :style="{ backgroundColor: backgroundColors[index % backgroundColors.length] }"></span>
            <span class="category-name">{{ key }}</span>
            <span class="category-amount">{{ value.toLocaleString() }} 원</span>
          </li>
        </ul>
    </div>
    <div v-else class="contents"> <!-- 지출 -->
        <div class="chart-container mb-3">
          <Doughnut v-if="loaded" :data="expenseChartData" :options="chartOptions" />
        </div>
        <ul v-if="loaded" class="details-list">
          <li v-for="(value, key, index) in expenseDetails" :key="index">
            <span class="color-box" :style="{ backgroundColor: backgroundColors[index % backgroundColors.length] }"></span>
            <span class="category-name">{{ key }}</span>
            <span class="category-amount">{{ value.toLocaleString() }} 원</span>
          </li>
        </ul>
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from "vue-chartjs";
import { ref, onMounted, defineProps } from "vue";
import axios from 'axios';

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register( Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);

const backgroundColors = [
  'rgb(255, 182, 193)', 'rgb(191, 232, 245)', 'rgb(255, 255, 200)', 'rgb(229, 250, 175)','rgb(245, 198, 245)','rgb(222, 226, 255)',  'rgb(255, 212, 168)','rgb(255, 222, 237)', 'rgb(252, 207, 202)'
];

const props = defineProps({
  filterTransactionsByDate: Function
});

const loaded = ref(false);
const isIncome = ref(false); 

const incomeChartData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: backgroundColors
    }
  ]
})

const expenseChartData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: backgroundColors
    }
  ]
})

const chartOptions = ref({
   responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
});

const incomeDetails = ref({});
const expenseDetails = ref({});

const selectTab = (tab) => {
  isIncome.value = tab;
};

const computeCategorySums = (transactions, categories, type) => {
  const sumByCategory = {};

  transactions.forEach(transaction => {
    const category = categories.data.find(cat => cat.id === transaction.categoryId);
    if (category && category.type === type) {
      if (!sumByCategory[category.name]) {
        sumByCategory[category.name] = 0;
      }
      sumByCategory[category.name] += parseInt(transaction.amount);
    }
  });

  return sumByCategory;
};


onMounted(async () => {
  loaded.value = false

  try {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const userId = userInfo.id
    
    const transactions = await axios.get('http://localhost:3000/transactions')
    const categories = await axios.get('http://localhost:3000/categories')
    
    // 사용자 필터링
    transactions.data = transactions.data.filter(transaction => transaction.userId === userId);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentMonthTransactions = props.filterTransactionsByDate(transactions.data, currentYear, currentMonth);
    
    const incomeSum = computeCategorySums(currentMonthTransactions, categories, "income")
    const expenseSum = computeCategorySums(currentMonthTransactions, categories, "expense")

    let sortedIncomeDetails = Object.entries(incomeSum).sort((a, b) => b[1] - a[1]);
    let sortedExpenseDetails = Object.entries(expenseSum).sort((a, b) => b[1] - a[1]);
    
    // Chart 데이터 업데이트
    incomeChartData.value.labels = sortedIncomeDetails.map(([name]) => name);
    incomeChartData.value.datasets[0].data = sortedIncomeDetails.map(([, amount]) => amount);
    expenseChartData.value.labels = sortedExpenseDetails.map(([name]) => name);
    expenseChartData.value.datasets[0].data = sortedExpenseDetails.map(([, amount]) => amount);
    sortedIncomeDetails.slice(0, 5).forEach(([category, amount]) => {
      incomeDetails.value[category] = amount;
    });
    sortedExpenseDetails.slice(0, 5).forEach(([category, amount]) => {
      expenseDetails.value[category] = amount;
    });

    loaded.value = true

  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.tab-btn {
  border: none;
  background-color: transparent;
  color: #6c757d; /* 회색 */
  cursor: pointer;
}

.tab-btn.active {
  color: #007bff; /* 선택 시 파란색 */
}å

.chart-container {
  width: 75%; 
  margin: 0 auto; 
}

.details-list {
  list-style: none;
  padding: 0;
}

.details-list li {
  display: flex;
  align-items: center;
  margin: 15px 15px;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
}

.category-name {
  flex-grow: 1;
}

.category-amount {
  font-weight: bold;
}
</style>

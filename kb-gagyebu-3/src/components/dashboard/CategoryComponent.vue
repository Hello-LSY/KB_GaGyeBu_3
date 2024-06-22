<template>
  <div class="container flex-column" style="height: 100%; border-radius: 8px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);" >
    <div class="tab-buttons d-flex justify-content-start mt-4 mx-2">
      <button class="tab-btn" :class="{ 'active': isIncome === false }" @click="selectTab(false)">지출</button>
      <button class="tab-btn" :class="{ 'active': isIncome === true }" @click="selectTab(true)">수입</button>
    </div>
    <div v-if="isIncome" class="contents">
        <div class="chart-container mb-3 mx-3">
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
        <div class="chart-container mb-3 mx-3">
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
'rgba(0, 123, 255, 0.2)',    // Light Blue
    'rgba(0, 106, 217, 0.4)',    // Medium Light Blue
    'rgba(0, 89, 179, 0.6)',     // Medium Blue
    'rgba(0, 72, 143, 0.8)',     // Medium Dark Blue
    'rgba(0, 56, 107, 1.0)',     // Dark Blue
    'rgba(51, 153, 255, 0.6)',   // Sky Blue
    'rgba(102, 178, 255, 0.6)',  // Lighter Blue
    'rgba(153, 204, 255, 0.6)',  // Very Light Blue
    'rgba(204, 229, 255, 0.6)',  // Very Very Light Blue
    'rgba(169, 169, 169, 0.6)',  // Light Gray
    'rgba(128, 128, 128, 0.6)',  // Gray
    'rgba(105, 105, 105, 0.6)',  // Dim Gray
    'rgba(169, 169, 169, 0.8)',  // Dark Gray
    'rgba(192, 192, 192, 1.0)'   // Silver
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

const calculateCategorySums = (transactions, categories, type) => {
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
    
    const response = await axios.get(`http://localhost:3000/transactions?userId=${userId}`);
    const categories = await axios.get('http://localhost:3000/categories')
    
    const transactions = response.data

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentMonthTransactions = props.filterTransactionsByDate(transactions, currentYear, currentMonth);
    
    const incomeSum = calculateCategorySums(currentMonthTransactions, categories, "income")
    const expenseSum = calculateCategorySums(currentMonthTransactions, categories, "expense")

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
  font-weight: 500;
  font-size: 18px;
}

.tab-btn.active {
  color: #15417a; /* 선택 시 파란색 */
}å

.chart-container {
  margin: 0 auto; 
  width: 250px;
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

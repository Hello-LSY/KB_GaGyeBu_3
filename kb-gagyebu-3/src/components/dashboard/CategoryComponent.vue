<template>
  <div class="container flex-column" >
    <div class="tab-buttons d-flex justify-content-start mt-3 mb-3 mx-2">
      <button class="tab-btn" :class="{ 'active': isIncome === false }" @click="selectTab(false)">지출</button>
      <button class="tab-btn" :class="{ 'active': isIncome === true }" @click="selectTab(true)">수입</button>
    </div>
    <div v-if="isIncome" class="contents">
      <div class="category-list"> <!-- 수입 -->
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
    </div>
    <div v-else class="contents"> <!-- 지출 -->
      <div class="category-list">
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
  </div>
</template>

<script setup>
import { Doughnut } from "vue-chartjs";
import { ref, onMounted } from "vue";
import axios from 'axios';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const backgroundColors = [
  'rgb(255, 182, 193)', 'rgb(191, 232, 245)', 'rgb(255, 255, 200)', 'rgb(229, 250, 175)','rgb(245, 198, 245)','rgb(222, 226, 255)',  'rgb(255, 212, 168)','rgb(255, 222, 237)', 'rgb(252, 207, 202)'
];


// 기본값을 false로 설정하여 초기 상태가 "지출"로 설정되도록 함
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

onMounted(async () => {
  loaded.value = false

  try {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    
    if (userInfo == null){ // 로그인 하지 않았을 경우 임시 데이터
        
      incomeChartData.value = {
        labels: ["월급", "금융소득", "기타", "용돈"],
        datasets: [
          {
            data: [2800000, 372000, 238000, 150000],
            backgroundColor: backgroundColors
          }
        ]
      }

      expenseChartData.value ={
        labels: ["외식", "여행", "주거/통신", "취미/문화", "기타"],
        datasets: [
          {
            data: [783000, 521000, 241000, 138000, 71000],
            backgroundColor: backgroundColors
          }
        ]
      }
      incomeDetails.value = {"월급": 2800000, "금융소득": 372000, "기타" : 238000, "용돈": 150000}
      expenseDetails.value = {"외식":783000, "여행": 521000, "주거/통신": 241000, "취미/문화": 138000, "기타": 71000}

      loaded.value = true
      return
      }

    const userId = userInfo.id
    
    const transactions = await axios.get('http://localhost:3000/transactions')
    const categories = await axios.get('http://localhost:3000/categories')
    
    // 사용자 필터링
    transactions.data = transactions.data.filter(transaction => transaction.userId === userId);

    // 현재 연, 월과 동일한 transaction만 필터링
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const currentMonthTransactions = transactions.data.filter(transaction => {
      const transactionDate = new Date(transaction.start);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      return transactionYear === currentYear && transactionMonth === currentMonth;
    });

    // 누적 금액 계산
    const incomeSum = {};
    const expenseSum = {};

    currentMonthTransactions.forEach(transaction => {
      const category = categories.data.find(cat => cat.id === transaction.categoryId);
      if (category) {
        if (category.typeId === "0") { // 수입
          if (!incomeSum[category.name]) {
            incomeSum[category.name] = 0;
          }
          incomeSum[category.name] += parseInt(transaction.amount);
        } else {
          if (!expenseSum[category.name]) {
            expenseSum[category.name] = 0;
          }
          expenseSum[category.name] += parseInt(transaction.amount);
        }
      }
    });

    // 금액 높은 순으로 정렬
    let sortedIncomeDetails = Object.entries(incomeSum).sort((a, b) => b[1] - a[1]);
    let sortedExpenseDetails = Object.entries(expenseSum).sort((a, b) => b[1] - a[1]);
    
    // Chart 데이터 업데이트
    incomeChartData.value.labels = sortedIncomeDetails.map(([name]) => name);
    incomeChartData.value.datasets[0].data = sortedIncomeDetails.map(([, amount]) => amount);

    expenseChartData.value.labels = sortedExpenseDetails.map(([name]) => name);
    expenseChartData.value.datasets[0].data = sortedExpenseDetails.map(([, amount]) => amount);

    // 세부 항목 상위 5개 표시
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
  height: 250px;
  margin: 0 auto; /* 차트를 가운데 정렬 */
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

<template>
    <div class="chart-container">
      <Bar v-if="loaded" :data="chartData" class="weekend-chart"/>
    </div>
  </template>
  
  <script setup>
  import { Bar } from "vue-chartjs";
  import { ref, onMounted } from "vue";
  import axios from 'axios';
  
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from "chart.js";
  
  ChartJS.register( Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);
  
  const chartData = ref({
    labels: [],
    datasets: []
  });
  
  const loaded = ref(false);
  
  onMounted(async () => {
    loaded.value = false;
  
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const userId = userInfo.id;
  
      const transactions = await axios.get('http://localhost:3000/transactions');
  
      // 사용자 필터링
      transactions.data = transactions.data.filter(transaction => transaction.userId === userId);
  
      const currentDate = new Date();
  
      // 이번 주 토요일 찾기
      const thisSaturday = new Date(currentDate);
      thisSaturday.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
  
      // 지난 주 일요일 찾기
      const lastSunday = new Date(thisSaturday);
      lastSunday.setDate(thisSaturday.getDate() - 6);
  
      // 과거 5주치 데이터 가져오기
      const weeklyTransactions = Array.from({ length: 5 }, (_, index) => {
        const start = new Date(lastSunday);
        start.setDate(start.getDate() - (7 * index));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
  
        return transactions.data.filter(transaction => {
          const transactionDate = new Date(transaction.start);
          return transactionDate >= start && transactionDate <= end;
        });
      }).reverse(); // 데이터 역순으로 정렬
  
      // 주차 라벨과 해당하는 날짜 라벨 생성
      const labels = [];
      const dateLabels = [];
      weeklyTransactions.forEach((weekTransactions, index) => {
        const weekStartDate = new Date(lastSunday);
        weekStartDate.setDate(weekStartDate.getDate() - (7 * index));
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);
  
        const { year, month, weekNo } = weekNumberBySunday(weekStartDate);
        labels.push(`${month}월 ${weekNo}주차`);
        dateLabels.push(`${weekStartDate.getMonth() + 1}.${weekStartDate.getDate()} - ${weekEndDate.getMonth() + 1}.${weekEndDate.getDate()}`);
      });
  
      chartData.value = {
        labels: dateLabels.reverse(), // 라벨 역순으로 정렬
        datasets: [
          {
            label: "Income",
            data: weeklyTransactions.map(week => calculateTotal(week, 'income')).reverse(), // 데이터 역순으로 정렬
            backgroundColor: 'rgb(255, 182, 193)',
          },
          {
            label: "Expense",
            data: weeklyTransactions.map(week => calculateTotal(week, 'expense')).reverse(), // 데이터 역순으로 정렬
            backgroundColor:  'rgb(191, 232, 245)',
          }
        ]
      };
  
      loaded.value = true;
  
    } catch (e) {
      console.error(e);
    }
  });
  
  // 주차 라벨 생성 함수
  function weekNumberBySunday(date) {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth() + 1;
    const day = inputDate.getDate();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (inputDate - firstDayOfYear) / 86400000;
    const weekNo = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return { year, month, weekNo };
  }
  
  // 해당 주의 총 수입 또는 지출 계산
  function calculateTotal(weekTransactions, type) {
    return weekTransactions.reduce((total, transaction) => {
      if (transaction.type === type) {
        total += parseInt(transaction.amount);
      }
      return total;
    }, 0);
  }
  
  </script>
  
  <style scoped>
  .chart-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .weekend-chart {
    width: 90%;
  }
  </style>
  
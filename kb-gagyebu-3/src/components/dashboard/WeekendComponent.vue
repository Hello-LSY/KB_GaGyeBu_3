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

      if (userInfo == null){ // 로그인 하지 않았을 경우 임시 데이터
        chartData.value = {
            labels: ["5.12 - 5.18", "5.19 - 5.25", "5.26 - 6.1", "6.2 - 6.8", "6.9 - 6.15"],
            datasets: [
            {
                label: "Income",
                data: [76600, 207500, 107500, 270200, 122600], 
                backgroundColor: 'rgb(255, 182, 193)',
            },
            {
                label: "Expense",
                data: [133300, 65800, 102400, 216700, 85400], 
                backgroundColor:  'rgb(191, 232, 245)',
            }
            ]
        };
        loaded.value = true
        return
      }

      const userId = userInfo.id;
  
      const transactions = await axios.get('http://localhost:3000/transactions');
  
      // 사용자 필터링
      transactions.data = transactions.data.filter(transaction => transaction.userId === userId);
  
      // 이번 주 토요일, 지난주 일요일 찾기
      const currentDate = new Date();
      const thisSaturday = new Date(currentDate);
      thisSaturday.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
      const lastSunday = new Date(thisSaturday);
      lastSunday.setDate(thisSaturday.getDate() - 6);
  
      // 과거 5주치 데이터 
      const weeklyTransactions = Array.from({ length: 5 }, (_, index) => {
        const start = new Date(lastSunday);
        start.setDate(start.getDate() - (7 * index));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
  
        return transactions.data.filter(transaction => {
          const transactionDate = new Date(transaction.start);
          return transactionDate >= start && transactionDate <= end;
        });
      })
  
      // 날짜 라벨 생성
      const dateLabels = [];
      weeklyTransactions.forEach((weekTransactions, index) => {
        const weekStartDate = new Date(lastSunday);
        weekStartDate.setDate(weekStartDate.getDate() - (7 * index));
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);
        dateLabels.push(`${weekStartDate.getMonth() + 1}.${weekStartDate.getDate()} - ${weekEndDate.getMonth() + 1}.${weekEndDate.getDate()}`);
      });
  
      // .reverse로 데이터 역순 정렬
      chartData.value = {
        labels: dateLabels.reverse(),
        datasets: [
          {
            label: "Income",
            data: weeklyTransactions.map(week => calculateTotal(week, '0')), 
            backgroundColor: 'rgb(255, 182, 193)',
          },
          {
            label: "Expense",
            data: weeklyTransactions.map(week => calculateTotal(week, 'expense')), 
            backgroundColor:  'rgb(191, 232, 245)',
          }
        ]
      };
  
      loaded.value = true;
  
    } catch (e) {
      console.error(e);
    }
  });
  
  // 해당 주의 총 수입 또는 지출 계산
  function calculateTotal(weekTransactions, type) {
    return weekTransactions.reduce((total, transaction) => {
      if (transaction.typeId === type) {
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
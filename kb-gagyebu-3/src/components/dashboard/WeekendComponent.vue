<template>
    <div class="flex-container">
      <div class="chart-container">
        <Bar v-if="loaded" :data="chartData" class="weekend-chart" :options="chartOptions"/>
      </div>
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

  const barThickness = ref(window.innerWidth <= 756 ? 15 : 25);

  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
  });

  
  const loaded = ref(false);
  const props = defineProps({  calculateTotalAmount: Function });

  const getWeeklyTransactions = (transactions, lastSunday) => {
    return Array.from({ length: 5 }, (_, index) => {
      const start = new Date(lastSunday);
      start.setDate(start.getDate() - (7 * index));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.start);
        return transactionDate >= start && transactionDate <= end;
      });
    }).reverse();
  };
  
  const getDateLabels = (weeklyTransactions, lastSunday) => {
    const dateLabels = [];
    weeklyTransactions.forEach((weekTransactions, index) => {
      const weekStartDate = new Date(lastSunday);
        weekStartDate.setDate(weekStartDate.getDate() - (7 * index));
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);
        dateLabels.push(`${weekStartDate.getMonth() + 1}.${weekStartDate.getDate()} - ${weekEndDate.getMonth() + 1}.${weekEndDate.getDate()}`);
     });
    return dateLabels.reverse();
  };


  onMounted(async () => {
    loaded.value = false;
  
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));      
      const userId = userInfo.id;
      
      const response = await axios.get(`http://localhost:3000/transactions?userId=${userId}`);

      const transactions = response.data;
  
      // // 이번 주 토요일, 지난주 일요일 찾기
      const currentDate = new Date();
      const thisSaturday = new Date(currentDate);
      thisSaturday.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
      const lastSunday = new Date(thisSaturday);
      lastSunday.setDate(thisSaturday.getDate() - 6);
      const weeklyTransactions = getWeeklyTransactions(transactions, lastSunday)
  
      chartData.value = {
        labels: getDateLabels(weeklyTransactions, lastSunday),
        datasets: [
          {
            barThickness: barThickness.value,
            label: "Income",
            data: weeklyTransactions.map(week => props.calculateTotalAmount(week, 'income')), 
            backgroundColor: '#5987e3',
          },
          {
            barThickness:  barThickness.value,
            label: "Expense",
            data: weeklyTransactions.map(week => props.calculateTotalAmount(week, 'expense')), 
            backgroundColor: '#ed7868',
          }
        ]
      };
      loaded.value = true;
    } catch (e) {
      console.error(e);
    }
  });
</script>
  
<style scoped>
  .flex-container {
    display: flex;
    justify-content: center; 
    align-items: center;
    height: 100%; 
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  .chart-container {
    height: 80%;
    width: 75%;
  }

  @media (max-width: 961px) {
    .chart-container {
      width: 90%;
    }
  }
</style>
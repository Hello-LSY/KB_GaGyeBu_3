<template>
  <div v-if="currentUser">
    <h2>{{ currentUser.name }}님의 지출 분석</h2>
    <div v-if="analyzedUser">
      <p>{{ analyzedUser.description }}</p>
      <p>{{ analyzedUser.spendingSummary }}</p>
      <div class="chart-container">
        <canvas ref="expenseChart"></canvas>
      </div>
      <a :href="analyzedUser.recommendationLink" target="_blank">카드 추천 보러가기</a>
    </div>
    <div v-else>
      <p>지출 데이터가 없습니다.</p>
    </div>
  </div>
  <div v-else>
    <p>로그인 해주세요.</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transactions';
import { useCategoryStore } from '@/stores/categories';
import {
  Chart,
  PolarAreaController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  RadialLinearScale
} from 'chart.js';

Chart.register(PolarAreaController, ArcElement, Tooltip, Legend, Title, RadialLinearScale);

const authStore = useAuthStore();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const expenseChart = ref(null);
let chartInstance = null;

onMounted(async () => {
  await transactionStore.fetchTransactions();
  await categoryStore.fetchCategories();
  authStore.loadUserFromStorage(); // 로그인 사용자 정보 로드

  // 차트 생성
  await nextTick();
  createChart();
});

const currentUser = computed(() => authStore.user);

const analyzedUser = computed(() => {
  if (!currentUser.value) return null;

  const userTransactions = transactionStore.transactions.filter(t => t.userId === currentUser.value.id);
  const expenseTransactions = userTransactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const categoryTotals = {};

  expenseTransactions.forEach(t => {
    if (!categoryTotals[t.categoryId]) {
      categoryTotals[t.categoryId] = 0;
    }
    categoryTotals[t.categoryId] += parseFloat(t.amount);
  });

  if (Object.keys(categoryTotals).length === 0) return null;

  const maxCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
  const maxCategoryName = categoryStore.categories.find(c => c.id === maxCategory)?.name || '기타';
  const maxCategoryPercentage = totalExpense ? ((categoryTotals[maxCategory] / totalExpense) * 100).toFixed(2) : 0;

  let description = '';
  switch (maxCategoryName) {
    case '여행':
      description = '여행을 좋아하는 모험가';
      break;
    case '외식':
      description = '미식가';
      break;
    case '취미/문화':
      description = '여가를 즐기는 YOLO형 인간';
      break;
    default:
      description = '다양한 지출을 즐기는';
  }

  const spendingSummary = totalExpense ? `지출의 ${maxCategoryPercentage}%를 ${maxCategoryName}에 사용하셨군요?` : '지출 데이터가 없습니다.';
  const recommendationLink = `https://www.kbcard.com/ 추천 링크`; // 여기서 적절한 카드 추천 링크를 추가합니다.

  return {
    id: currentUser.value.id,
    name: currentUser.value.name,
    description,
    spendingSummary,
    recommendationLink,
    categoryTotals
  };
});

// 차트 생성 함수
const createChart = () => {
  if (analyzedUser.value && analyzedUser.value.categoryTotals) {
    const ctx = expenseChart.value.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy(); 
    }
    chartInstance = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: Object.keys(analyzedUser.value.categoryTotals).map(
          id => categoryStore.categories.find(c => c.id === id).name
        ),
        datasets: [{
          data: Object.values(analyzedUser.value.categoryTotals),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            grid: {
              circular: true,
              color: function(context) {
                if (context.tick.value === context.scale.max) {
                  return 'rgba(0, 0, 0, 0.3)'; // 가장 큰 원의 테두리 색상
                }
                return 'rgba(0, 0, 0, 0)'; // 나머지 그리드 선 색상 제거
              }
            },
            angleLines: {
              display: true, // 각도선을 표시
              color: 'rgba(0, 0, 0, 0.3)' // 각도선 색상
            },
            ticks: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '주요 지출 내역'
          }
        }
      }
    });
  }
};

// analyzedUser가 변경될 때 차트를 업데이트합니다.
watch(analyzedUser, async () => {
  await nextTick();
  createChart();
});
</script>

<style scoped>
.chart-container {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

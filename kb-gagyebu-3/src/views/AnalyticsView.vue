<template>
  <div class="container-fluid" v-if="currentUser">
    <div v-if="analyzedUser">
      <!-- 이번 달 지출 섹션 -->
      <div class="row mb-4">
        <div class="col-lg-12">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center p-5">
              <p class="font-weight-bold display-4">이번 달 지출: {{ analyzedUser.currentMonthExpense.toLocaleString() }}원</p>
              <p class="text-muted h6">{{ monthlyChangeSummary }}</p>
              <div class="highlight-box">
                <p class="lead mb-1 quote-text"><span class="quote-icon">“</span>{{ analyzedUser.description }}<span class="quote-icon">”</span></p>
                <p class="font-weight-bold2 h5 spending-summary">{{ analyzedUser.spendingSummary }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 주요 지출 내역 및 주간 지출 내역 섹션 -->
      <div class="row mb-4">
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title text-center">카테고리 별 지출 내역</h5>
              <canvas ref="expenseChart" class="w-100"></canvas>
            </div>
          </div>
        </div>
        <div class="col-lg-4 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title text-center">주간 지출 내역</h5>
              <div v-for="week in displayedWeeklyData" :key="week.weekRange" class="week-analysis mb-3">
                <div class="week-range">{{ week.weekRange }}</div>
                <div class="progress bg-light">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-dark-blue" role="progressbar" :style="{ width: (week.total / maxWeeklyExpense * 100) + '%' }"></div>
                </div>
                <div class="week-total">{{ week.total.toLocaleString() }}원</div>
              </div>
              <p class="text-center font-weight-bold2 mt-3">주간 평균 {{ weeklyAverage.toLocaleString() }}원</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 월별 수익 및 지출 및 추천카드 섹션 -->
      <div class="row mb-4">
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title text-center">월별 수익 및 지출</h5>
              <canvas ref="monthlyChart" class="w-100"></canvas>
            </div>
          </div>
        </div>
        <div class="col-lg-4 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center p-4">
              <h3 class="card-title mb-5 ">이 카드는 어때요?</h3>
              <img :src="analyzedUser.recommendation.image" alt="Card Image" class="img-fluid mb-3 card-img-small">
              <h6>{{ analyzedUser.recommendation.name }}</h6>
              <a :href="analyzedUser.recommendation.link" target="_blank" class="btn btn-primary mt-3">카드 보러가기</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center text-muted">지출 데이터가 없습니다.</p>
    </div>
  </div>
  <div v-else>
    <p class="text-center text-muted">로그인 해주세요.</p>
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
  BarController,
  LineController,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
  RadialLinearScale,
  CategoryScale,
  LinearScale
} from 'chart.js';

Chart.register(
  PolarAreaController,
  BarController,
  LineController,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
  RadialLinearScale,
  CategoryScale,
  LinearScale
);

// 카드 이미지 가져오기
import travelCardImage from '@/assets/CardImage/travel.png';
import diningCardImage from '@/assets/CardImage/dining.png';
import cultureCardImage from '@/assets/CardImage/culture.png';
import housingCardImage from '@/assets/CardImage/housing.png';
import educationCardImage from '@/assets/CardImage/edu.png';
import transportCardImage from '@/assets/CardImage/transport.png';
import shoppingCardImage from '@/assets/CardImage/shopping.png';
import generalCardImage from '@/assets/CardImage/general.png';

const authStore = useAuthStore();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const expenseChart = ref(null);
const monthlyChart = ref(null);
const weeklyChart = ref(null);
let expenseChartInstance = null;
let monthlyChartInstance = null;
let weeklyChartInstance = null;

onMounted(async () => {
  await transactionStore.fetchTransactions();
  await categoryStore.fetchCategories();
  authStore.loadUserFromStorage(); // 로그인 사용자 정보 로드

  // 차트 생성
  await nextTick();
  createCharts();
});

const currentUser = computed(() => authStore.user);

const analyzedUser = computed(() => {
  if (!currentUser.value) return null;

  const userTransactions = transactionStore.transactions.filter(t => t.userId === currentUser.value.id);
  const expenseTransactions = userTransactions.filter(t => t.type === 'expense');
  const incomeTransactions = userTransactions.filter(t => t.type === 'income');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const categoryTotals = {};

  expenseTransactions.forEach(t => {
    if (!categoryTotals[t.categoryId]) {
      categoryTotals[t.categoryId] = 0;
    }
    categoryTotals[t.categoryId] += parseFloat(t.amount);
  });

  if (Object.keys(categoryTotals).length === 0) return null;

  const sortedCategories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);
  const maxCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;
  const maxCategoryName = maxCategory ? categoryStore.categories.find(c => c.id === maxCategory)?.name || '기타' : '기타';
  const maxCategoryPercentage = totalExpense ? ((categoryTotals[maxCategory] / totalExpense) * 100).toFixed(2) : 0;

  const categoryDescriptions = {
    '여행': '여행을 좋아하는 모험가',
    '외식': '맛을 탐구하는 미식가',
    '취미/문화': '여가를 즐기는 YOLO형 인간',
    '주거/통신': '실용적인 생활자',
    '교육': '지식을 추구하는 학구파',
    '교통/차량': '이동을 즐기는 탐험가',
    '쇼핑/의류': '패션을 사랑하는 스타일리스트',
    '기타': '다양한 지출을 즐기는 복합적 인간'
  };

  const categoryCardRecommendations = {
    '여행': {
      name: '가온글로벌카드',
      link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09167',
      image: travelCardImage
    },
    '외식': {
      name: 'FNB캐시리플렛 리멤버카드',
      link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?cooperationcode=07274&mainCC=a',
      image: diningCardImage
    },
    '취미/문화': {
      name: '스타체크카드',
      link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=01552',
      image: cultureCardImage
    },
    '주거/통신': {
      name: '굿데이카드',
      link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09061',
      image: housingCardImage
    },
    '교육': {
      name: '에듀카드',
      link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=04432',
      image: educationCardImage
    },
    '교통/차량': {
      name: '톡톡 Pay카드',
      link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09231',
      image: transportCardImage
    },
    '쇼핑/의류': {
      name: '마이핏카드(할인형)',
      link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09248',
      image: shoppingCardImage
    },
    '기타': {
      name: '가온 올포인트카드',
      link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09234',
      image: generalCardImage
    }
  };

  const description = categoryDescriptions[maxCategoryName] || '다양한 지출을 즐기는 복합적 인간';
  const recommendation = categoryCardRecommendations[maxCategoryName] || categoryCardRecommendations['기타'];

  const spendingSummary = totalExpense ? `지출의 ${maxCategoryPercentage}%를 ${maxCategoryName}에 사용하셨군요?` : '지출 데이터가 없습니다.';

  // 월별 수익 및 지출 계산
  const monthlyData = calculateMonthlyData(userTransactions);

  // 주간 지출 계산
  const weeklyData = calculateWeeklyData(userTransactions);

  // 이번 달 지출 계산 함수 호출
  const currentMonthExpense = calculateCurrentMonthExpense(expenseTransactions);

  return {
    id: currentUser.value.id,
    name: currentUser.value.name,
    description,
    spendingSummary,
    recommendation,
    categoryTotals, // 전체 카테고리를 사용하도록 설정
    monthlyData,
    weeklyData,
    currentMonthExpense
  };
});

// 이번 달 지출 계산 함수 추가
const calculateCurrentMonthExpense = (transactions) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // 현재 년-월 형식
  const currentMonthExpenses = transactions.filter(t => t.start.startsWith(currentMonth));
  return currentMonthExpenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
};

// 월별 수익 및 지출 계산 함수
const calculateMonthlyData = (transactions) => {
  const monthlyData = {};

  transactions.forEach(t => {
    const month = t.start.slice(0, 7); // YYYY-MM 형식으로 자르기
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyData[month].income += parseFloat(t.amount);
    } else if (t.type === 'expense') {
      monthlyData[month].expense += parseFloat(t.amount);
    }
  });

  // 날짜 순서대로 정렬된 객체를 반환
  return Object.keys(monthlyData).sort().reduce((obj, key) => {
    obj[key] = monthlyData[key];
    return obj;
  }, {});
};

// 주간 지출 계산 함수
const calculateWeeklyData = (transactions) => {
  const weeklyData = {};
  transactions.forEach(t => {
    const date = new Date(t.start);
    const week = getWeekNumber(date);
    if (!weeklyData[week]) {
      weeklyData[week] = { total: 0, weekRange: getWeekRange(date) };
    }
    if (t.type === 'expense') {
      weeklyData[week].total += parseFloat(t.amount);
    }
  });
  return Object.values(weeklyData);
};

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getWeekRange = (date) => {
  const startOfWeek = new Date(date);
  const endOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  endOfWeek.setDate(date.getDate() + (6 - date.getDay()));
  return `${startOfWeek.toISOString().slice(5, 10)} ~ ${endOfWeek.toISOString().slice(5, 10)}`;
};

// 전월 대비 수익 및 지출 변화 계산 함수
const calculateMonthlyChanges = (monthlyData) => {
  const months = Object.keys(monthlyData).sort();
  if (months.length < 2) return '';

  const lastMonth = months[months.length - 1];
  const prevMonth = months[months.length - 2];

  const incomeChange = monthlyData[lastMonth].income - monthlyData[prevMonth].income;
  const expenseChange = monthlyData[lastMonth].expense - monthlyData[prevMonth].expense;

  return `전 달에 비해 수익은 ${Math.abs(incomeChange).toLocaleString()}원 ${incomeChange > 0 ? '증가' : '감소'}하였고, 지출은 ${Math.abs(expenseChange).toLocaleString()}원 ${expenseChange > 0 ? '증가' : '감소'}하였습니다.`;
};

const monthlyChangeSummary = computed(() => {
  if (!analyzedUser.value || !analyzedUser.value.monthlyData) return '';

  return calculateMonthlyChanges(analyzedUser.value.monthlyData);
});

// 최근 4주간의 주간 지출 데이터만 표시
const displayedWeeklyData = computed(() => {
  if (!analyzedUser.value || !analyzedUser.value.weeklyData) return [];

  const recentWeeks = analyzedUser.value.weeklyData.slice(-4);
  return recentWeeks.map((week, index) => {
    week.total = week.total.toFixed(0); // 소수점 제거
    return week;
  });
});

// 주간 지출의 최대값 계산
const maxWeeklyExpense = computed(() => {
  if (!analyzedUser.value || !analyzedUser.value.weeklyData) return 0;

  return Math.max(...analyzedUser.value.weeklyData.map(week => week.total));
});

// 주간 평균 지출 계산
const weeklyAverage = computed(() => {
  if (!analyzedUser.value || !analyzedUser.value.weeklyData) return 0;

  const total = analyzedUser.value.weeklyData.reduce((sum, week) => sum + parseFloat(week.total), 0);
  return (total / analyzedUser.value.weeklyData.length).toFixed(0);
});

// 차트 생성 함수
const createCharts = () => {
  if (analyzedUser.value && analyzedUser.value.categoryTotals) {
    const expenseCtx = expenseChart.value.getContext('2d');
    if (expenseChartInstance) {
      expenseChartInstance.destroy();
    }
    expenseChartInstance = new Chart(expenseCtx, {
      type: 'polarArea',
      data: {
        labels: Object.keys(analyzedUser.value.categoryTotals).map(
          id => {
            const category = categoryStore.categories.find(c => c.id === id);
            return category ? category.name : '기타';
          }
        ),
        datasets: [{
          data: Object.values(analyzedUser.value.categoryTotals),
          backgroundColor: [
            'rgba(0, 123, 255, 0.2)',
            'rgba(0, 123, 255, 0.4)',
            'rgba(0, 123, 255, 0.6)',
            'rgba(0, 123, 255, 0.8)',
            'rgba(0, 123, 255, 1.0)',
            'rgba(0, 123, 255, 0.5)'
          ],
          borderColor: [
            'rgba(0, 123, 255, 1)',
            'rgba(0, 123, 255, 1)',
            'rgba(0, 123, 255, 1)',
            'rgba(0, 123, 255, 1)',
            'rgba(0, 123, 255, 1)',
            'rgba(0, 123, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            grid: {
              circular: true,
              color: function(context) {
                if (context.tick.value === context.scale.max) {
                  return 'rgba(0, 0, 0, 0.3)';
                }
                return 'rgba(0, 0, 0, 0)';
              }
            },
            angleLines: {
              display: true,
              color: 'rgba(0, 0, 0, 0.3)'
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
        }
      }
    });
  }

  if (analyzedUser.value && analyzedUser.value.monthlyData) {
    const monthlyCtx = monthlyChart.value.getContext('2d');
    if (monthlyChartInstance) {
      monthlyChartInstance.destroy();
    }
    const lastSixMonths = Object.keys(analyzedUser.value.monthlyData).slice(-6);
    monthlyChartInstance = new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: lastSixMonths,
        datasets: [
          {
            label: '수익',
            data: lastSixMonths.map(month => analyzedUser.value.monthlyData[month].income),
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // 진한 빨간색 배경
            borderColor: 'rgba(255, 99, 132, 1)', // 빨간색 경계
            borderWidth: 1
          },
          {
            label: '지출',
            data: lastSixMonths.map(month => analyzedUser.value.monthlyData[month].expense),
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // 진한 파란색 배경
            borderColor: 'rgba(54, 162, 235, 1)', // 파란색 경계
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
        }
      }
    });
  }

  if (analyzedUser.value && analyzedUser.value.weeklyData) {
    const weeklyCtx = weeklyChart.value.getContext('2d');
    if (weeklyChartInstance) {
      weeklyChartInstance.destroy();
    }

    weeklyChartInstance = new Chart(weeklyCtx, {
      type: 'bar',
      data: {
        labels: analyzedUser.value.weeklyData.slice(-4).map(d => d.weekRange),
        datasets: [
          {
            label: '주간 지출',
            data: analyzedUser.value.weeklyData.slice(-4).map(d => d.total),
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '주간 지출 내역'
          }
        }
      }
    });
  }
};


// analyzedUser가 변경될 때 차트를 업데이트합니다.
watch(analyzedUser, async () => {
  await nextTick();
  createCharts();
});
</script>



<style scoped>
.container-fluid {
  padding: 20px;
  overflow: auto;
}

.card {
  border: none;
  border-radius: 15px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
  background-color: #007bff;
  color: #f0f8ff;
  border-radius: 8px; /* 끝이 둥근 효과 */
}

canvas {
  width: 100% !important;
  height: 400px !important;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.2s, border-color 0.2s;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.text-center {
  text-align: center;
}

.lead {
  font-size: 1.25rem;
  font-weight: 300;
}

.font-weight-bold {
  font-weight: bold;
  background-color: #007bff; /* 파란색 배경 */
  color: #ffffff; /* 흰색 글꼴 */
  padding: 15px 15px; /* 내부 여백 */
  border-radius: 10px; /* 끝이 둥근 효과 */
}

.font-weight-bold2 {
  font-weight: bold;
}
.text-muted {
  color: #6c757d;
}

.quote-icon {
  font-size: 2rem;
  vertical-align: middle;
  color: #0056b3;
}

.week-analysis {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.week-range {
  flex: 1;
  text-align: left;
}

.week-total {
  flex: 1;
  text-align: right;
}

.progress {
  flex: 2;
  height: 20px;
}

.progress-bar {
  background-color: #007bff;
}

.card-img-small {
  max-width: 80%;
  height: auto;
}

.highlight-box {
  border: 2px solid #0056b3;
  border-radius: 10px;
  padding: 15px;
  background-color: #f0f8ff;
  margin-top: 20px;
}

.quote-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0056b3;
}

.spending-summary {
  font-size: 1.25rem;
  color: #0056b3;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .card-title {
    text-align: center;
  }
}
</style>
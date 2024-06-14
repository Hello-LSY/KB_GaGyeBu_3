import DashboardView from './views/DashboardView.vue';
import AnalyticsView from './views/AnalyticsView.vue';
import TransactionView from './views/TransactionView.vue';
import ProfileView from './views/ProfileView.vue';
import LoginMember from './views/LoginMember.vue';
import RegisterMember from './views/RegisterMember.vue';
import CategoryAnalysis from './views/analysis/CategoryAnalysis.vue';
import MonthAnalysis from './views/analysis/MonthAnalysis.vue';
import TransactionAnalysis from './views/analysis/TransactionAnalysis.vue';
import HomeView from './views/HomeView.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/home', component: HomeView },
  { path: '/analytics', component: AnalyticsView, meta: { requiresAuth: true } },
  { path: '/transaction', component: TransactionView, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginMember },
  { path: '/register', component: RegisterMember },
  { path: '/analysis/category', component: CategoryAnalysis, meta: { requiresAuth: true } },
  { path: '/analysis/month', component: MonthAnalysis, meta: { requiresAuth: true } },
  { path: '/analysis/transaction', component: TransactionAnalysis, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadUserFromStorage();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isLoggedIn) {
      next({ path: '/home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

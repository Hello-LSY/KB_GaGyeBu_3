import DashboardView from './views/DashboardView.vue';
import AnalyticsView from './views/AnalyticsView.vue';
import TransactionView from './views/TransactionView.vue';
import RegistTransactionView from './views/RegistTransactionView.vue';
import SettingsView from './views/SettingsView.vue';
import ProfileView from './views/ProfileView.vue';
import LoginMember from './views/LoginMember.vue';
import RegisterMember from './views/RegisterMember.vue';
import CategoryAnalysis from './views/analysis/CategoryAnalysis.vue';
import MonthAnalysis from './views/analysis/MonthAnalysis.vue';
import TransactionAnalysis from './views/analysis/TransactionAnalysis.vue';

const routes = [
  { path: '/', component: DashboardView },
  { path: '/analytics', component: AnalyticsView },
  { path: '/transaction', component: TransactionView },
  { path: '/transaction/regist', component: RegistTransactionView },
  { path: '/settings', component: SettingsView },
  { path: '/profile', component: ProfileView },
  { path: '/login', component: LoginMember },
  { path: '/register', component: RegisterMember },
  { path: '/analysis/category', component: CategoryAnalysis },
  { path: '/analysis/month', component: MonthAnalysis },
  { path: '/analysis/transaction', component: TransactionAnalysis }
];

export default routes;

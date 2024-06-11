import DashboardView from './views/DashboardView.vue';
import AnalyticsView from './views/AnalyticsView.vue';
import TransactionView from './views/TransactionView.vue';
import RegistTransactionView from './views/RegistTransactionView.vue';
import SettingsView from './views/SettingsView.vue';
import ProfileView from './views/ProfileView.vue';
import LoginMember from './views/LoginMember.vue';
import RegisterMember from './views/RegisterMember.vue';

const routes = [
  { path: '/', component: DashboardView },
  { path: '/analytics', component: AnalyticsView },
  { path: '/transaction', component: TransactionView },
  { path: '/transaction/regist', component: RegistTransactionView },
  { path: '/settings', component: SettingsView },
  { path: '/profile', component: ProfileView },
  { path: '/login', component: LoginMember },
  { path: '/register', component: RegisterMember }
];

export default routes;

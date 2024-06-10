import DashboardView from './views/DashboardView.vue'
import AnalyticsView from './views/AnalyticsView.vue'
import TransactionView from './views/TransactionView.vue'
import SettingsView from './views/SettingsView.vue'
import ProfileView from './views/ProfileView.vue'

const routes = [
  { path: '/', component: DashboardView },
  { path: '/analytics', component: AnalyticsView },
  { path: '/transaction', component: TransactionView },
  { path: '/settings', component: SettingsView },
  { path: '/profile', component: ProfileView },
]

export default routes

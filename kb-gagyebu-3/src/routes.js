import DashboardView from './views/DashboardView.vue'
import AnalyticsView from './views/AnalyticsView.vue'
import TransactionView from './views/TransactionView.vue'
import RegistTransactionView from './views/RegistTransactionView.vue'
import SettingsView from './views/SettingsView.vue'
import AccountView from './views/AccountView.vue'

const routes = [
  { path: '/', component: DashboardView },
  { path: '/analytics', component: AnalyticsView },
  { path: '/transaction', component: TransactionView },
  { path: '/transaction/regist', component: RegistTransactionView},
  { path: '/settings', component: SettingsView },
  { path: '/account', component: AccountView },
]

export default routes

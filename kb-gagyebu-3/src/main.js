import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './routes'; // 'routes'에서 default export된 router 사용
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useAuthStore } from './stores/auth';
import { useThemeStore } from './stores/theme';
import { useSettingsStore } from './stores/setting';
import 'bootstrap-icons/font/bootstrap-icons.css';
import i18n from './i18n';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const authStore = useAuthStore();
authStore.loadUserFromStorage();

const themeStore = useThemeStore();
themeStore.setTheme(localStorage.getItem('theme') || 'light');

const settingsStore = useSettingsStore();
settingsStore.setLanguage(localStorage.getItem('language') || 'ko');

app.use(router);
app.use(i18n);

app.mount('#app');

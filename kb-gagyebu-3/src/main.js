// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useAuthStore } from './stores/auth';
import 'bootstrap-icons/font/bootstrap-icons.css';


const app = createApp(App);
const pinia = createPinia();
const router = createRouter({
  history: createWebHistory(),
  routes
});

app.use(pinia);

const authStore = useAuthStore();
authStore.loadUserFromStorage();

app.use(router);

// 초기 테마 설정
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

app.mount('#app');

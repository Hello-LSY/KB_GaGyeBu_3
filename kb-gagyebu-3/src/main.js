import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { useAuthStore } from './stores/auth'; // useAuthStore를 import

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
app.mount('#app');

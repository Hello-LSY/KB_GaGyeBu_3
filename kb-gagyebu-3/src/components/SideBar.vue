<template>
  <div class="sidebarsection">
    <div class="sidebaritem">
      <div class="text">
        <i class="bi bi-speedometer2 me-2"></i>
        <router-link to="/" class="sidebar-link">Dashs</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <i class="bi bi-bar-chart-line-fill me-2"></i>
        <router-link to="/analytics" class="sidebar-link">Analytics</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <i class="bi bi-arrow-left-right me-2"></i>
        <router-link to="/transaction" class="sidebar-link">Transaction</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <i class="bi bi-gear-fill me-2"></i>
        <router-link to="/settings" class="sidebar-link">Setting</router-link>
      </div>
    </div>
    <div class="sidebaritem" v-if="isLoggedIn">
      <div class="text">
        <i class="bi bi-person-circle me-2"></i>
        <router-link to="/profile" class="sidebar-link">Profile</router-link>
      </div>
    </div>
    <div class="sidebaritem">
      <div class="text">
        <i class="bi bi-file-earmark-plus-fill me-2"></i>
        <router-link to="/transaction/regist" class="sidebar-link">Regist Transaction</router-link>
      </div>
    </div>
    <div class="sidebaritem" v-if="!isLoggedIn">
      <div class="text">
        <i class="bi bi-person-plus-fill me-2"></i>
        <router-link to="/register" class="sidebar-link">Register</router-link>
      </div>
    </div>
    <div class="sidebaritem" v-if="!isLoggedIn">
      <div class="text">
        <i class="bi bi-box-arrow-in-right me-2"></i>
        <router-link to="/login" class="sidebar-link">Login</router-link>
      </div>
    </div>
    <div class="sidebaritem" v-if="isLoggedIn">
      <div class="text">
        <i class="bi bi-box-arrow-left me-2"></i>
        <button @click="logout" class="btn-logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const currentTheme = computed(() => themeStore.theme);

const logout = () => {
  authStore.logout();
};
</script>

<style scoped>
.sidebarsection {
  width: 220px;
  background-color: var(--sidebar-background);
  padding: 15px;
  height: 100vh;
  overflow-y: auto;
  white-space: nowrap;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebaritem {
  margin-bottom: 20px;
}

.sidebar-link {
  text-decoration: none;
  color: var(--text-color);
  display: block;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.sidebar-link:hover {
  background-color: var(--sidebar-hover-background);
}

.btn-logout {
  background: none;
  border: none;
  padding: 10px 15px;
  text-align: left;
  width: 100%;
  color: var(--text-color);
  cursor: pointer;
  display: block;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-logout:hover {
  background-color: var(--sidebar-hover-background);
}

.text {
  display: flex;
  align-items: center;
}

.text i {
  font-size: 1.2rem;
  margin-right: 10px;
}
</style>

<template>
  <div>
    <button v-if="isMobile" @click="toggleMenu" class="menu-button">Menu</button>
    <div :class="sidebarClass">
      <div class="sidebaritem">
        <router-link to="/" class="sidebar-link">
          <i class="bi bi-speedometer2"></i>
          <span v-if="!isMobile">Dashboard</span>
        </router-link>
      </div>
      <div class="sidebaritem">
        <router-link to="/analytics" class="sidebar-link">
          <i class="bi bi-bar-chart-line-fill"></i>
          <span v-if="!isMobile">Analytics</span>
        </router-link>
      </div>
      <div class="sidebaritem">
        <router-link to="/transaction" class="sidebar-link">
          <i class="bi bi-arrow-left-right"></i>
          <span v-if="!isMobile">Transaction</span>
        </router-link>
      </div>
      <div class="sidebaritem" v-if="isLoggedIn">
        <router-link to="/profile" class="sidebar-link">
          <i class="bi bi-person-circle"></i>
          <span v-if="!isMobile">Profile</span>
        </router-link>
      </div>
      <div class="sidebaritem" v-if="!isLoggedIn">
        <router-link to="/register" class="sidebar-link">
          <i class="bi bi-person-plus-fill"></i>
          <span v-if="!isMobile">Register</span>
        </router-link>
      </div>
      <div class="sidebaritem" v-if="!isLoggedIn">
        <router-link to="/login" class="sidebar-link">
          <i class="bi bi-box-arrow-in-right"></i>
          <span v-if="!isMobile">Login</span>
        </router-link>
      </div>
      <div class="sidebaritem" v-if="isLoggedIn">
        <button @click="handleLogout" class="btn-logout">
          <i class="bi bi-box-arrow-left"></i>
          <span v-if="!isMobile">Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const router = useRouter();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const currentTheme = computed(() => themeStore.theme);

const handleLogout = () => {
  authStore.logout();
  router.push('/home');
};

// 반응형 처리를 위한 로직
const sidebarClass = ref('sidebarsection hidden');
const isMobile = ref(false);
const isMenuVisible = ref(false);

const handleResize = () => {
  if (window.innerWidth < 768) {  // 768px 이하일 때
    isMobile.value = true;
    sidebarClass.value = 'sidebarsection hidden';
  } else {
    isMobile.value = false;
    sidebarClass.value = 'sidebarsection';
  }
};

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
  sidebarClass.value = isMenuVisible.value ? 'sidebarsection top' : 'sidebarsection hidden';
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
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
  transition: all 0.3s ease;
}

.sidebarsection.top {
  width: 100%;
  height: auto;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  z-index: 1000;  /* 최상위로 설정 */
  padding-right: 70px;  /* 오른쪽에 여백 추가 */
}

.sidebarsection.hidden {
  display: none;
}

.sidebaritem {
  margin-bottom: 20px;
}

.sidebarsection.top .sidebaritem {
  margin-right: 0;
  margin-bottom: 0;
}

.sidebar-link {
  text-decoration: none;
  color: var(--text-color);
  display: flex;
  align-items: center;
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
  display: flex;
  align-items: center;
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

.menu-button {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1001;  /* 메뉴 버튼이 최상위에 오도록 설정 */
  background-color: var(--sidebar-background);
  color: var(--text-color);
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .sidebarsection {
    height: auto;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding-right: 40px;  /* 오른쪽에 여백 추가 */
  }

  .sidebaritem {
    margin-right: 0;
    margin-bottom: 0;
  }
  
}
</style>

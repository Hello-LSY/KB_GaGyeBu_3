<template>
  <div>
    <button v-if="isMobile" @click="toggleMenu" class="menu-button">Menu</button>
    <div :class="sidebarClass">
      <div class="sidebaritem">
        <div class="text">
          <i class="bi bi-speedometer2 me-2"></i>
          <router-link to="/" class="sidebar-link">
            <span v-if="!isMobile">Dashs</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem">
        <div class="text">
          <i class="bi bi-bar-chart-line-fill me-2"></i>
          <router-link to="/analytics" class="sidebar-link">
            <span v-if="!isMobile">Analytics</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem">
        <div class="text">
          <i class="bi bi-arrow-left-right me-2"></i>
          <router-link to="/transaction" class="sidebar-link">
            <span v-if="!isMobile">Transaction</span>
          </router-link>
        </div>
      </div>
      <!-- <div class="sidebaritem">
        <div class="text">
          <i class="bi bi-gear-fill me-2"></i>
          <router-link to="/settings" class="sidebar-link">
            <span v-if="!isMobile">Setting</span>
          </router-link>
        </div>
      </div> -->
      <div class="sidebaritem" v-if="isLoggedIn">
        <div class="text">
          <i class="bi bi-person-circle me-2"></i>
          <router-link to="/profile" class="sidebar-link">
            <span v-if="!isMobile">Profile</span>
          </router-link>
        </div>
      </div>
      <!-- <div class="sidebaritem">
        <div class="text">
          <i class="bi bi-file-earmark-plus-fill me-2"></i>
          <router-link to="/transaction/regist" class="sidebar-link">
            <span v-if="!isMobile">Regist Transaction</span>
          </router-link>
        </div>
      </div> -->
      <div class="sidebaritem" v-if="!isLoggedIn">
        <div class="text">
          <i class="bi bi-person-plus-fill me-2"></i>
          <router-link to="/register" class="sidebar-link">
            <span v-if="!isMobile">Register</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem" v-if="!isLoggedIn">
        <div class="text">
          <i class="bi bi-box-arrow-in-right me-2"></i>
          <router-link to="/login" class="sidebar-link">
            <span v-if="!isMobile">Login</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem" v-if="isLoggedIn">
        <div class="text">
          <i class="bi bi-box-arrow-left me-2"></i>
          <button @click="logout" class="btn-logout">
            <span v-if="!isMobile">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const currentTheme = computed(() => themeStore.theme);

const logout = () => {
  authStore.logout();
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
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  z-index: 1000;  /* 최상위로 설정 */
}

.sidebarsection.hidden {
  display: none;
}

.sidebaritem {
  margin-bottom: 20px;
}

.sidebarsection.top .sidebaritem {
  margin-right: 20px;
  margin-bottom: 0;
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
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  .sidebaritem {
    margin-right: 20px;
    margin-bottom: 0;
  }
}
</style>

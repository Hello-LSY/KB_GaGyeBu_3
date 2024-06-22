<template>
  <div>
    <button v-if="isMobile" @click="toggleMenu" class="menu-button fw-bold">Menu</button>
    <div :class="sidebarClass">
      <div class="sidebaritem">
        <div class="text">
          <router-link to="/" class="sidebar-link">
            <i class="bi bi-speedometer2 me-2"></i>
            <span v-if="!isMobile">Dashboard</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem">
        <div class="text">
          <router-link to="/analytics" class="sidebar-link">
            <i class="bi bi-bar-chart-line-fill me-2"></i>
            <span v-if="!isMobile">Analytics</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem">
        <div class="text">
          <router-link to="/transaction" class="sidebar-link">
            <i class="bi bi-arrow-left-right me-2"></i>
            <span v-if="!isMobile">Transaction</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem" v-if="isLoggedIn">
        <div class="text">
          <router-link to="/profile" class="sidebar-link">
            <i class="bi bi-person-circle me-2"></i>
            <span v-if="!isMobile">Profile</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem" v-if="!isLoggedIn">
        <div class="text">
          <router-link to="/register" class="sidebar-link">
            <i class="bi bi-person-plus-fill me-2"></i>
            <span v-if="!isMobile">Register</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem" v-if="!isLoggedIn">
        <div class="text">
          <router-link to="/login" class="sidebar-link">
            <i class="bi bi-box-arrow-in-right me-2"></i>
            <span v-if="!isMobile">Login</span>
          </router-link>
        </div>
      </div>
      <div class="sidebaritem" v-if="isLoggedIn">
        <div class="text">
          <button @click="handleLogout" class="btn-logout">
            <i class="bi bi-box-arrow-left me-2"></i>
            <span v-if="!isMobile">Logout</span>
          </button>
        </div>
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
  background: var(--sidebar-background); /* 배경 색상 변수 */
  padding: 15px;
  height: 100vh;
  overflow-y: auto;
  white-space: nowrap;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-radius: 0px; /* 둥근 모서리 */
  /* border: 2px solid rgba(178, 235, 242, 0.5); 외부 테두리 */
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5); /* 내부 테두리 */
  backdrop-filter: blur(10px); /* 배경 블러 */
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
  z-index: 1000;
  padding-right: 70px;
  border-radius: 0; /* 최상단에서는 둥근 모서리 적용 안함 */
}

.sidebarsection.hidden {
  display: none;
}

.sidebaritem {
  margin-bottom: 25px; /* 간격을 넓힘 */
}

.sidebarsection.top .sidebaritem {
  margin-right: 25px; /* 간격을 넓힘 */
  margin-bottom: 0;
}

.sidebar-link,
.btn-logout {
  background: none;
  border: none;
  padding: 10px 15px;
  text-align: left;
  width: 100%;
  color: var(--link-color); /* 링크 색상 변수 */
  cursor: pointer;
  display: block;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* 고급스러운 폰트 */
  font-weight: 500; /* 글자 굵기 조정 */
  text-decoration: none;
}

.sidebar-link:hover,
.btn-logout:hover {
  background-color: var(--link-hover-background); /* 링크 호버 배경색 변수 */
  color: var(--link-hover-color); /* 링크 호버 텍스트 색 변수 */
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
  z-index: 1001;
  border: none;
  background: var(--menu-button-background); /* 메뉴 버튼 배경 색상 변수 */
  color: var(--menu-button-color); /* 메뉴 버튼 텍스트 색상 변수 */
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
    border-radius: 0; /* 모바일에서는 둥근 모서리 적용 안함 */
  }

  .sidebaritem {
    margin-right: 25px; /* 간격을 넓힘 */
    margin-bottom: 0;
  }
}

</style>

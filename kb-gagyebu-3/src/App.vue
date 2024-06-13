<template>
  <div id="app">
    <Sidebar v-if="!isExcludedView" />
    <RouterView />
    <NotificationButton v-if="settingsStore.notifications && !isExcludedView" />
    <NotificationModal />
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useSettingsStore } from '@/stores/setting';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/SideBar.vue';
import NotificationButton from '@/components/NotificationButton.vue';
import NotificationModal from '@/components/NotificationModal.vue';

const themeStore = useThemeStore();
const settingsStore = useSettingsStore();
const { locale } = useI18n();
const route = useRoute();

const isExcludedView = computed(() => {
  const excludedPaths = ['/home', '/login', '/register'];
  return excludedPaths.includes(route.path);
});

onMounted(() => {
  document.documentElement.setAttribute('data-theme', themeStore.theme);
  locale.value = settingsStore.language;
});

watch(() => themeStore.theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
});

watch(() => settingsStore.language, (newLanguage) => {
  locale.value = newLanguage;
});
</script>

<style>
:root {
  --background-color: #e0f7fa; /* 연한 파란색 */
  --content-background: #f1f8e9; /* 연한 녹색 */
  --text-color: #004d40; /* 짙은 청록색 */
  --sidebar-background: #b2ebf2; /* 파스텔톤의 연한 파란색 */
  --sidebar-hover-background: #80deea; /* 조금 더 짙은 파란색 */
}

[data-theme='dark'] {
  --background-color: #004d40; /* 짙은 청록색 */
  --content-background: #00796b; /* 중간 톤의 청록색 */
  --text-color: #ffffff; /* 흰색 */
  --sidebar-background: #006064; /* 짙은 청록색 */
  --sidebar-hover-background: #004d40; /* 더 짙은 청록색 */
}

#app {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>

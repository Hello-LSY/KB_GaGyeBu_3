<template>
  <div id="app">
    <Sidebar />
    <RouterView />
    <NotificationButton v-if="settingsStore.notifications" />
    <NotificationModal />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useSettingsStore } from '@/stores/setting'; // 경로 수정
import { useI18n } from 'vue-i18n';
import Sidebar from '@/components/SideBar.vue';
import NotificationButton from '@/components/NotificationButton.vue';
import NotificationModal from '@/components/NotificationModal.vue';

const themeStore = useThemeStore();
const settingsStore = useSettingsStore();
const { locale } = useI18n();

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
  --background-color: #ffffff;
  --content-background: #f8f9fa;
  --text-color: #000000;
  --sidebar-background: #f8f9fa;
  --sidebar-hover-background: #e9ecef;
}

[data-theme='dark'] {
  --background-color: #121212;
  --content-background: #1e1e1e;
  --text-color: #ffffff;
  --sidebar-background: #232323;
  --sidebar-hover-background: #333333;
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
<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { RouterView } from 'vue-router';

const themeStore = useThemeStore();

onMounted(() => {
  document.documentElement.setAttribute('data-theme', themeStore.theme);
});
</script>

<style>
:root {
  --background-color: #ffffff;
  --content-background: #f8f9fa;
  --text-color: #000000;
  --sidebar-background: #f8f9fa;
  --sidebar-hover-background: #e9ecef;
}

[data-theme='dark'] {
  --background-color: #121212;
  --content-background: #1e1e1e;
  --text-color: #ffffff;
  --sidebar-background: #232323;
  --sidebar-hover-background: #333333;
}

#app {
  display: flex;
  flex-direction: column;
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

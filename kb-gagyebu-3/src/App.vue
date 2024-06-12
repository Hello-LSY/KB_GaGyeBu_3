<template>
  <div id="app">
    <Sidebar />
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useSettingsStore } from '@/stores/setting';
import { useI18n } from 'vue-i18n';
import Sidebar from '@/components/SideBar.vue';

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

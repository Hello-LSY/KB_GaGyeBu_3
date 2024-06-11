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
}

[data-theme='dark'] {
  --background-color: #121212;
  --content-background: #1e1e1e;
  --text-color: #ffffff;
}

/* 스타일 정의 */
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden; /* If there's any overflow issue */
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>

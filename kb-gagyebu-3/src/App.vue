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
  --background-color: #ffffff; /* 흰색 배경 */
  --content-background: #f7f7f7; /* 연한 회색 배경 */
  --text-color: #333333; /* 어두운 회색 텍스트 */
  --border-color: #e5e7eb; /* 라이트 모드 경계선 색상 */
  --selected-tab-color: #656ce1; /* 탭 선택 색상 */
  --input-background: #ffffff; /* 흰색 입력 필드 배경 */
  --input-border-color: #e0e0e0; /* 입력 필드 경계선 색상 */
  --button-background: linear-gradient(135deg, #e0e0e0, #f5f5f5); /* 버튼 배경 그라데이션 */
  --button-hover-background: linear-gradient(135deg, #d0d0d0, #e0e0e0); /* 버튼 호버 배경 그라데이션 */
  --button-text-color: #333333; /* 버튼 텍스트 색상 */
  --sidebar-background: rgba(224, 224, 224, 0.678); /* 라이트 모드 배경 */
  --link-color: #15417a; /* 라이트 모드 링크 색상 */
  --link-hover-background: #606263; /* 라이트 모드 링크 호버 배경 */
  --link-hover-color: #ffffff; /* 라이트 모드 링크 호버 텍스트 색 */
  --menu-button-background: rgba(224, 224, 224, 0.678); /* 라이트 모드 메뉴 버튼 배경 */
  --menu-button-color: #15417a; /* 라이트 모드 메뉴 버튼 텍스트 색 */
}

[data-theme='dark'] {
  --background-color: #333333; /* 어두운 회색 배경 */
  --content-background: #4f4f4f; /* 중간 톤의 회색 */
  --text-color: #ffffff; /* 흰색 */
  --border-color: #444444; /* 다크 모드 경계선 색상 */
  --selected-tab-color: #ffffff; /* 탭 선택 색상 */
  --input-background: #4f4f4f; /* 중간 톤의 회색 */
  --input-border-color: #666666; /* 입력 필드 경계선 색상 */
  --button-background: linear-gradient(135deg, #606060, #707070); /* 버튼 배경 그라데이션 */
  --button-hover-background: linear-gradient(135deg, #505050, #606060); /* 버튼 호버 배경 그라데이션 */
  --button-text-color: #ffffff; /* 버튼 텍스트 색상 */
  --sidebar-background: rgba(51, 51, 51, 0.9); /* 다크 모드 배경 */
  --link-color: #ffffff; /* 다크 모드 링크 색상 */
  --link-hover-background: #333333; /* 다크 모드 링크 호버 배경 */
  --link-hover-color: #cccccc; /* 다크 모드 링크 호버 텍스트 색 */
  --menu-button-background: rgba(51, 51, 51, 0.9); /* 다크 모드 메뉴 버튼 배경 */
  --menu-button-color: #ffffff; /* 다크 모드 메뉴 버튼 텍스트 색 */
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

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
</script>

<style>
/* 스타일 정의 */
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden; /* If there's any overflow issue */
}
</style>

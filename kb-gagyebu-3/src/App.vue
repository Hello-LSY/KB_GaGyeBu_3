<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';

</script>

<style>
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
</style>

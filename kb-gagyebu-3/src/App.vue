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
  height: 100vh;
}
</style>

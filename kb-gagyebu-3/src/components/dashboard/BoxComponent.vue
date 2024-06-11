<template>
  <div class="box-container">
    <div class="header">
      <div class="icon-wrapper">
        <svg class="main-icon" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            :d = "pathData"
            fill="#656CE1"
          ></path>
        </svg>
      </div>
      <div class="percentage-wrapper">
        <p class="percentage-text"> {{percentage}}%</p>
      </div>
    </div>
    <p class="title">{{title}}</p>
    <p class="content">{{ content }} 원 </p>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    percentage: String,
    title: String,
    content: String,
    pathData: String,
  });
</script>

<style scoped>
.box-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-grow: 1;
  position: relative;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  flex-grow: 0;
  flex-shrink: 0;
}

.icon-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background: #f0f0f5;
}

.main-icon {
  flex-grow: 0;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  fill: none;
  position: relative;
}

.percentage-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  gap: 4px;
}

.arrow-icon {
  flex-grow: 0;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  position: relative;
  fill: none;
}

.percentage-text {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: #5db57a;
}

.title {
  flex-grow: 1;
  width: 150px;
  height: 24px;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: #6b7280;
}

.content {
  align-self: stretch;
  flex-grow: 0;
  flex-shrink: 0;
  width: 200px;
  font-size: 22px;
  font-weight: 700;
  text-align: left;
  color: #252c32;
}
</style>

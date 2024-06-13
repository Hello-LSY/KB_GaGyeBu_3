<template>
  <div class="box-container">
    <div class="header">
      <div class="icon-wrapper">
        <svg class="main-icon" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            :d = "pathData"
            fill="#15417a"
          ></path>
        </svg>
      </div>
      <div class="percentage-wrapper">
        <p :style="percentageStyle" class="percentage-text"> {{percentage}}%</p>
      </div>
    </div>
    <p class="title">{{title}}</p>
    <p class="content">{{ content }} 원 </p>
  </div>
</template>

<script setup>
  import { defineProps, computed } from 'vue';

  const props = defineProps({
    percentage: String,
    title: String,
    content: String,
    pathData: String,
  });

  const percentageStyle = computed(() => {
  const value = parseFloat(props.percentage);
  if (value > 0) {
    return { color: '#5987e3' };
  } else if (value < 0) {
    return { color: '#e35959' };
  } else {
    return { color: '#95a5a6' };
  }
});
</script>

<style scoped>
.box-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  gap: 10px;
  padding: 25px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  min-width: 250px;
}

.box-container:hover{
  transform: translateY(-5px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  height: 100%;
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
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  color: #5db57a;
}

.title {
  flex-grow: 1;
  width: 150px;
  height: 24px;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #6b7280;
}

.content {
  /* align-self: stretch; */
  flex-grow: 0;
  flex-shrink: 0;
  width: 200px;
  font-size: 22px;
  font-weight: 600;
  text-align: left;
  color: #252c32;
}
</style>

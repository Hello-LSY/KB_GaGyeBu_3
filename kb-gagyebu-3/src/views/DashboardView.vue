<template>
    <div class="dashboard-container">
      <Sidebar />
      <div class="dashboard-content">
        <h1>Dashboard</h1>
        <!-- 대시보드 내용 -->
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '../components/SideBar.vue'
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
  }
  
  .sidebar {
    width: 250px;
  }
  
  .dashboard-content {
    flex-grow: 1;
    padding: 20px;
  }
  </style>
  
<template>
    <button @click="showNotificationModal" class="notification-button">
      <i class="bi bi-bell"></i>
    </button>
  </template>
  
  <script setup>
  import { Modal } from 'bootstrap'; // 명시적으로 bootstrap의 Modal을 임포트
  
  const showNotificationModal = () => {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  };
  </script>
  
  <style scoped>
  .notification-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .notification-button i {
    font-size: 24px;
  }
  </style>
  
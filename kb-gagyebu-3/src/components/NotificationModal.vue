<template>
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="notificationModalLabel">알림</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul>
              <li v-for="transaction in transactions" :key="transaction.id">
                {{ transaction.title }} - {{ transaction.amount }}원 ({{ transaction.start }})
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const transactions = ref([]);
  //localStorage에 저장된 사용자 정보를 가져옵니다. 없으면 null을 반환합니다.
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;
  
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/transactions?userId=${userId}`);
      const allTransactions = response.data;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
      transactions.value = allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.start);
        return transactionDate >= oneWeekAgo;
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  onMounted(() => {
    fetchTransactions();
  });
  </script>
  
  <style scoped>
  /* 스타일을 여기에 추가할 수 있습니다 */
  </style>
  
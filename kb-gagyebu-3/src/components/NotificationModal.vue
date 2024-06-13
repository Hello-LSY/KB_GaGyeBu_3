<template>
  <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
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
.modal-dialog {
  max-width: 500px; /* 기본 최대 너비 */
  width: 100%;
  margin: auto; /* 중앙 정렬 */
}

.modal-content {
  width: 100%;
  box-sizing: border-box;
}

.modal-body {
  max-height: 80vh; /* 모달 내용의 최대 높이 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 추가 */
}

@media (max-width: 768px) {
  .modal.fade {
    /* 모달의 가로 크기를 조정하고 싶은 스타일을 여기에 추가 */
    max-width: 100%; /* 예: 화면의 90%로 설정 */
    margin: auto; /* 중앙 정렬 */
    /*오른쪽에 패딩 추가*/
    padding-right: 10px;
  }

  .modal-dialog {
    max-width: 80%;
    margin: 10px; /* 모바일에서는 약간의 마진 추가 */
  }
  
  .modal-content {
    margin: auto;
    max-width: 70%;
    padding: 0px; /* 모바일에서도 패딩이 적용되도록 설정 */
  }

  .modal-body {
    word-wrap: break-word; /* 내용이 잘리지 않도록 자동 줄바꿈 */
  }
}

@media (max-width: 560px) {
  .modal.fade {
    /* 모달의 가로 크기를 조정하고 싶은 스타일을 여기에 추가 */
    max-width: 100%; /* 예: 화면의 90%로 설정 */
    margin: auto; /* 중앙 정렬 */
    /*오른쪽에 패딩 추가*/
    padding-right: 10px;
  }

  .modal-dialog {
    max-width: 80%;
    margin: 10px; /* 모바일에서는 약간의 마진 추가 */
  }
  
  .modal-content {
    margin: auto;
    margin-right: 150px;
    max-width: 70%;
    padding: 0px; /* 모바일에서도 패딩이 적용되도록 설정 */
  }

  .modal-body {
    word-wrap: break-word; /* 내용이 잘리지 않도록 자동 줄바꿈 */
  }
}

</style>
  
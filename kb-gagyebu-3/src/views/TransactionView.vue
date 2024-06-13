<!-- TransactionView.vue -->
<template>
  <div class='demo-app'>
    <div class="calendar-container">
      <div class="app-header-container row justify-content-between align-items-center mt-4">
        <div class="col-auto calendar-navigation">
          <button @click="prev" class="fc-button fc-button-primary fc-prev-button"> < </button>
          <button @click="next" class="fc-button fc-button-primary fc-next-button"> > </button>
          <button @click="today" class="fc-button fc-button-primary fc-today-button">today</button>
        </div>
        <div class="col-auto app-header ">
          {{ currentMonthYear }}
        </div>
      </div>
      
      <FullCalendar
        class='demo-app-calendar'
        ref="fullCalendar"
        :options='calendarOptions'
      >
          <template v-slot:eventContent='arg'>
            <div class="event-custom"
              :style="{
                backgroundColor: getEventColor(arg.event.extendedProps.type),
                borderRadius: '2px'
              }">
              <b> {{ arg.timeText }}</b>
              <i>₩ {{ arg.event.extendedProps.amount }}</i>
            </div>
          </template>
        </FullCalendar>
      </div>
    </div>

  <!-- 거래 내역 등록 모달창 -->
  <div class="modal fade" id="transactionModal" tabindex="-1" aria-labelledby="transactionModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="transactionModalLabel">거래 등록</h5>
          <button type="button" class="btn-close custom-close-btn" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-container">
            <div class="form-group mb-3">
              <h4 class="transaction-date">{{ formData.start }}</h4>
              <label class="form-label">거래 유형</label>
              <select class="form-control" v-model="formData.type">
                <option disabled value="">거래 유형을 선택하세요</option>
                <option v-for="typeOption in type" :key="typeOption.type" :value="typeOption.type">
                  {{ typeOption.name }}
                </option>
              </select>
              <p v-if="validationErrors.type" class="text-danger">{{ validationErrors.type }}</p>
            </div>
              <div class="form-group mb-3">
                <label class="form-label">거래명</label>
                <input type="text" class="form-control" placeholder="거래명을 입력하세요" v-model="formData.title" />
                <p v-if="validationErrors.title" class="text-danger">{{ validationErrors.title }}</p>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">카테고리</label>
                <input type="text" class="form-control" readonly placeholder="거래 유형을 먼저 선택해주세요"
                       @click="openCategoryModal" :value="selectedCategoryName">
                <p v-if="validationErrors.categoryId" class="text-danger">{{ validationErrors.categoryId }}</p>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">금액</label>
                <input type="text" class="form-control" placeholder="금액을 입력하세요" v-model="formData.amount" />
                <p v-if="validationErrors.amount" class="text-danger">{{ validationErrors.amount }}</p>
              </div>
              <div class="form-group mb-4">
                <label class="form-label">메모</label>
                <textarea class="form-control" rows="3" placeholder="메모를 적어주세요" v-model="formData.memo"></textarea>
              </div>
            </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" class="btn btn-primary" @click="saveTransaction">저장</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 거래내역 등록에서 카테고리 선택 모달 -->
    <div class="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="categoryModalLabel">카테고리 선택</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div class="col-4" v-for="category in categories" :key="category.categoryId">
                  <button type="button" class="btn btn-outline-primary w-100 mb-2" @click="selectCategory(category)">
                    {{ category.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 거래 상세 내역 모달창 -->
    <div class="modal fade" id="eventDetailsModal" tabindex="-1" aria-labelledby="eventDetailsModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="eventDetailsModalLabel">거래 상세 정보</h5>
        <button type="button" class="btn-close custom-close-btn" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="form-container">
          <div class="form-group mb-3">
            <p class="details-label">날짜:</p>
            <p class="details-value">{{ formData.start }}</p>
          </div>
          <div class="form-group mb-3">
            <p class="details-label">거래명:</p>
            <p class="details-value">{{ formData.title }}</p>
          </div>
          <div class="form-group mb-3">
            <p class="details-label">카테고리:</p>
            <p class="details-value">{{ formData.fckCategoryName }}</p>
          </div>
          <div class="form-group mb-3">
            <p class="details-label">거래 유형:</p>
            <p class="details-value">{{ formData.type }}</p>
          </div>
          <div class="form-group mb-3">
            <p class="details-label">금액:</p>
            <p class="details-value">{{ formData.amount }}원</p>
          </div>
          <div class="form-group mb-3">
            <p class="details-label">메모:</p>
            <p class="details-value">{{ formData.memo }}</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        <button type="button" class="btn btn-primary" @click="deleteTransaction">삭제</button>
      </div>
    </div> 
  </div>
</div>

  
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  components: {
    FullCalendar
  },
  setup() {
    const authStore = useAuthStore();  // authStore 사용
    const userId = computed(() => authStore.user.id);  // 현재 사용자 ID 가져오기

    const currentEvents = ref([]);
    const fullCalendar = ref(null);
    const masterTransaction = ref([]);
    const type = ref([{type:"expense", name:"지출"},
                      {type:"income", name:"수입"}]);
    const categories = ref([]);
    const selectedCategoryName = ref('');
    const formData = reactive({
      start: '',
      title: '',
      categoryId: '',
      amount: '',
      type: '',
      fckCategoryName: '',
      memo: ''
    });
    const validationErrors = reactive({
      title: '',
      type: '',
      categoryId: '',
      amount: ''
    });
    const calendarOptions = reactive({
      plugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin
      ],
      headerToolbar: {
        left: '',
        center: '',
        right: ''
      },
      initialView: 'dayGridMonth',
      initialEvents:[],
      events:[],
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      select: handleDateSelect,
      eventClick: handleEventClick,
      eventsSet: handleEvents
    });

    onMounted(async () => {
      const transactions = await fetchUserTransactions();
      categories.value = await fetchCategories();
      calendarOptions.events = transactions;
      masterTransaction.value = transactions;
      currentEvents.value = transactions;
      updateMonthYear();
    });

    function formatNumberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function removeCommas(number) {
      return number.toString().replace(/,/g, '');
    }

    const canSave = computed(() => {
      return formData.title && formData.categoryId && formData.amount && formData.type;
    });

    const filteredCategories = computed(() => {
      return categories.value.filter(category => category.type === formData.type);
    });

    watch(() => formData.type, (newType, oldType) => {
      if (newType !== oldType) {
        formData.categoryId = '';
        selectedCategoryName.value = '';
      }
    });

    const currentMonthYear = ref('');

    function updateMonthYear() {
      const calendarApi = fullCalendar.value.getApi();
      const currentDate = calendarApi.getDate();
      currentMonthYear.value = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
    }

    async function fetchCategories() {
      try {
        const response = await axios.get(`http://localhost:3000/categories`);
        return response.data;
      } catch (error) {
        console.error("categories 가져오기 실패", error);
        return [];
      }
    }

    async function fetchUserTransactions() {
      try {
        const response = await axios.get(`http://localhost:3000/transactions/?userId=${userId.value}`);
        return response.data.map(transaction => ({
          ...transaction,
          amount: formatNumberWithCommas(transaction.amount)  // 가져올 때 콤마 추가
        }));
      } catch (error) {
        console.error("userId에 해당하는 event 가져오기 실패", error);
        return [];
      }
    }

    function handleWeekendsToggle() {
      calendarOptions.weekends = !calendarOptions.weekends;
    }

    function resetFormData() {
      selectedCategoryName.value = '';
      formData.title = '';
      formData.start = '';
      formData.categoryId = '';
      formData.amount = '';
      formData.memo = '';
      formData.type = '';
      validationErrors.title = '';
      validationErrors.type = '';
      validationErrors.categoryId = '';
      validationErrors.amount = '';
      formData.fckCategoryName = '';
    }

    function handleDateSelect(selectInfo) {
      const calendarApi = fullCalendar.value.getApi();
      const modalElement = document.getElementById('transactionModal');
      formData.start = selectInfo.startStr;

      calendarApi.unselect();

      modalElement.addEventListener('hide.bs.modal', resetFormData);
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }

    function validateForm() {
      validationErrors.title = formData.title ? '' : '거래명을 입력해야 합니다.';
      validationErrors.type = formData.type ? '' : '거래 유형을 선택해야 합니다.';
      validationErrors.categoryId = formData.categoryId ? '' : '카테고리를 선택해야 합니다.';
      if (!formData.amount) {
        validationErrors.amount = '금액을 입력해야 합니다.';
      } else if (!/^\d+$/.test(removeCommas(formData.amount))) {
        validationErrors.amount = '금액은 숫자로만 입력해야 합니다.';
        formData.amount = '';
      } else {
        validationErrors.amount = removeCommas(formData.amount); // 콤마 제거
        validationErrors.amount = '';
      }
    }

    function saveTransaction() {
      validateForm();
      if (canSave.value) {
        const calendarApi = fullCalendar.value.getApi();
        const newEvent = {
          id: String(userId.value) + "+" + String(currentEvents.value.length + 1),
          userId: String(userId.value),
          title: formData.title,
          start: formData.start,
          end: formData.start,
          memo: formData.memo,
          categoryId: formData.categoryId,
          amount: removeCommas(formData.amount),  // 저장할 때 콤마 제거
          type: formData.type,
          allDay: true,
        };
        calendarApi.addEvent(newEvent);
        axios.post('http://localhost:3000/transactions', {
          id: newEvent.id,
          userId: String(userId.value),
          title: formData.title,
          start: formData.start,
          categoryId: formData.categoryId,
          amount: newEvent.amount,
          memo: formData.memo,
          type: formData.type
        })
        .then(response => {
          fetchUserTransactions().then(updatedTransactions => {
            calendarOptions.events = updatedTransactions;
            currentEvents.value = updatedTransactions;
          });
        })
        .catch(error => {
          console.error('Error adding event:', error);
        });
        const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
        modal.hide();
        resetFormData();
        updateMonthYear(); // 달력 업데이트 후 월/년 갱신
      }
    }

    function openCategoryModal() {
      const modalElement = document.getElementById('categoryModal');
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static' 
      });
      modal.show();
    }

    function selectCategory(category) {
      formData.categoryId = category.id;
      selectedCategoryName.value = category.name;
      const modalElement = document.getElementById('categoryModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }

    function handleEventClick(clickInfo) {
      const calendarApi = fullCalendar.value.getApi();
      formData.title = clickInfo.event.title;
      formData.start = clickInfo.event.startStr;
      formData.fckCategoryName = categories.value.find(cat => cat.id === clickInfo.event.extendedProps.categoryId).name;
      formData.amount = formatNumberWithCommas(clickInfo.event.extendedProps.amount); // 콤마 추가
      formData.type = type.value.find(item => item.type == clickInfo.event.extendedProps.type).name;
      formData.memo = clickInfo.event.extendedProps.memo;
      calendarApi.value = clickInfo.event;

      const modalElement = document.getElementById('eventDetailsModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
      modalElement.addEventListener('hide.bs.modal', resetFormData);
    }

    function deleteTransaction() {
      const calendarApi = fullCalendar.value.getApi();
      if (confirm(`${calendarApi.value.startStr}의 '${calendarApi.value.title}' 거래내역을 삭제하시겠습니까?`)) {
        axios.delete(`http://localhost:3000/transactions/${calendarApi.value.id}`)
          .then(response => {
            calendarApi.value.remove();
            fetchUserTransactions().then(updatedTransactions => {
              calendarOptions.events = updatedTransactions;
              currentEvents.value = updatedTransactions;
            });
          })
          .catch(error => {
            console.error('Error deleting event:', error);
          })
          .finally(() => {
            bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal')).hide();
            updateMonthYear(); // 달력 업데이트 후 월/년 갱신
          });
      }
    }

    function getEventColor(type) {
      switch (type) {
        case 'expense':
          return '#ff8a9a';
        case 'income':
          return '#0e3e72ce';
        default:
          return 'grey'; // Default color for unknown types
      }
    };

    function handleEvents(events) {
      currentEvents.value = events;
      updateMonthYear(); // 달력 업데이트 후 월/년 갱신
    }

    function prev() {
      fullCalendar.value.getApi().prev();
      updateMonthYear(); // 달력 업데이트 후 월/년 갱신
    }

    function next() {
      fullCalendar.value.getApi().next();
      updateMonthYear(); // 달력 업데이트 후 월/년 갱신
    }

    function today() {
      fullCalendar.value.getApi().today();
      updateMonthYear(); // 달력 업데이트 후 월/년 갱신
    }

    return {
      type,
      validationErrors,
      categories: filteredCategories,
      calendarOptions,
      currentEvents,
      handleWeekendsToggle,
      formData,
      saveTransaction,
      openCategoryModal,
      selectCategory,
      selectedCategoryName,
      validationErrors,
      canSave,
      deleteTransaction,
      getEventColor,
      prev,
      next,
      today,
      fullCalendar,
      currentMonthYear,
      userId
    }
  }
})
</script>





<style lang='css'>
body {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}

.app-header-container {
  text-align: center;
  margin: 5px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.app-header {
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: #0e3e72b2;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 20px; /* Add this line to shift the header slightly to the right */
}

.calendar-navigation {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.calendar-navigation .fc-button {
  background-color: #0e3e72b2;
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  margin-right: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calendar-navigation .fc-button:hover {
  background-color: #0c2d54;
}

/* Calendar header cell styling */
.fc-col-header-cell {
  background-color: #0e3e72b2;
}

.fc-col-header-cell-cushion {
  color: #ffffff !important;
  text-decoration: none;
}

.fc-daygrid-day-number {
  text-decoration: none !important;
  color: #5781ff;
  font-weight: bold;
}

.fc-daygrid-day:hover {
  background-color: #e0e0e0;
}

.demo-app {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
}

.demo-app-main {
  flex-grow: 1;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-app-calendar {
  width: 100%;
  max-width: 100%;
}

.fc {
  max-width: 100%;
}

.fc-event {
  text-align: right;
  background-color: transparent;
  color: white;
  background-clip: padding-box;
  border: none;
  padding-right: 1px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-custom i {
  font-style: normal;
}

.fc-event.transfer {
  background-color: grey;
}

/* Modal customization */
.modal-content {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background-color: #0e3e72b2;
  color: white;
  border-bottom: none;
  padding: 20px;
}

.modal-title {
  font-weight: bold;
}

.modal-body {
  padding: 20px;
  background-color: #f7f7f7;
}

.modal-footer {
  padding: 20px;
  background-color: #f7f7f7;
  border-top: none;
}

.btn-close.custom-close-btn {
  position: relative;
  width: 20px;
  height: 20px;
  background-color: #ff6b6b;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.btn-close.custom-close-btn:before,
.btn-close.custom-close-btn:after {
  content: '';
  position: absolute;
  width: 2px;
  height: 12px;
  background-color: white;
}

.btn-close.custom-close-btn:before {
  transform: rotate(45deg);
}

.btn-close.custom-close-btn:after {
  transform: rotate(-45deg);
}

.btn-close.custom-close-btn:hover {
  background-color: #ff4d4d;
  transform: rotate(90deg);
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.btn-secondary,
.btn-primary {
  border-radius: 20px;
  padding: 10px 20px;
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
}

.btn-primary {
  background-color: #0e3e72b2;
  border: none;
}

.transaction-date {
  color: #0e3e72b2;
  font-weight: bold;
}

.details-label {
  font-weight: bold;
  color: #0e3e72b2;
}

.details-value {
  margin-left: 10px;
  color: #333;
}


</style>

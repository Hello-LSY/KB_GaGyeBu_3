<template>
  <div class='demo-app'>
    <div class='app-header-container'>
      <p class="app-header h1 p-">내 가계부</p>
    </div>
    <div class='demo-app-main'>
      <FullCalendar
        class='demo-app-calendar'
        ref="fullCalendar"
        :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
          <div class="event-custom"
          :style="{
            backgroundColor: getEventColor(arg.event.extendedProps.type),
            borderRadius: '3px'
          }">
            <b> {{ arg.timeText }}</b>
            <i>₩ {{ arg.event.extendedProps.amount }}</i>
          </div>
        </template>
      </FullCalendar>
    </div>
    
    <!-- 거래 내역 등록 모달창 -->
    <div class="modal fade" id="transactionModal" tabindex="-1" aria-labelledby="transactionModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="transactionModalLabel">거래 등록</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-container">
              <div class="form-group mb-3">
                <h4>{{ formData.start }}</h4>
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
            <button type="button" class="btn btn-primary" @click="saveTransaction" >저장</button>
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
                <div class="col-3" v-for="category in categories" :key="category.categoryId">
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
            <h5 class="modal-title" id="eventDetailsModalLabel">이벤트 상세 정보</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-group mb-3">
              <p>날짜 : {{ formData.start }}</p>
            </div>
            <div class="form-group mb-3">
              <p>거래명 : {{ formData.title }}</p>
            </div>
            <div class="form-group mb-3">
              <p>카테고리 : {{ formData.fckCategoryName }}</p>
            </div>
            <div class="form-group mb-3">
              <p>거래 유형 : {{ formData.type }}</p>
            </div>
            <div class="form-group mb-3">
              <p>금액 : {{ formData.amount }}</p>
            </div>
            <div class="form-group mb-3">
              <label class="form-label">메모</label>
              <p>{{ formData.memo }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" class="btn btn-primary" @click="deleteTransaction" >삭제</button>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>


<script>
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue'
import Sidebar from '../components/SideBar.vue'
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default defineComponent({
  components: {
    FullCalendar,
    Sidebar
  },
  setup() {
    const currentEvents = ref([])
    const calendarApi = ref(null)
    const masterTransaction = ref(null)
    const userId = localStorage.getItem('userId') || "1"
    const type = ref([{type:"expense", name:"지출"},
                      {type:"income", name:"수입"},
                      {type:"transfer", name:"이체"}])
    const categories = ref([])
    const selectedCategoryName = ref('')
    const formData = reactive({
      start: '',
      title: '',
      categoryId: '',
      amount: '',
      type: '',
      fckCategoryName: '',
      memo: ''
    })
    const validationErrors = reactive({
      title: '',
      type: '',
      categoryId: '',
      amount: ''
    })
    const calendarOptions = reactive({
      plugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
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
      /* you can update a remote database when these fire:
      eventAdd:
      eventChange:
      eventRemove:
      */
    })

    onMounted(async () => {
      const transactions = await fetchUserTransactions()
      categories.value = await fetchCategories()
      calendarOptions.events = transactions;
      masterTransaction.value = transactions;
      console.log(transactions)
      currentEvents.value = transactions
    })

    const canSave = computed(() => {
      return formData.title && formData.categoryId && formData.amount && formData.type
    })

    const filteredCategories = computed(() => {
      return categories.value.filter(category => category.type === formData.type)
    })

    watch(() => formData.type, (newType, oldType) => {
      if (newType !== oldType) {
        formData.categoryId = ''
        selectedCategoryName.value = ''
      }
    })

    async function fetchCategories() {
      try {
        const response = await axios.get(`http://localhost:3000/categories`)
        return response.data
      } catch (error) {
        console.error("categories 가져오기 실패", error)
        return []
      }
    }

    async function fetchUserTransactions() {
      try {
        const response = await axios.get(`http://localhost:3000/transactions/?userId=${userId}`)
        return response.data
      } catch (error) {
        console.error("userId에 해당하는 event 가져오기 실패", error)
        return []
      }
    }

    function handleWeekendsToggle() {
      calendarOptions.weekends = !calendarOptions.weekends
    }

    function resetFormData() {
      calendarApi.value = null
      selectedCategoryName.value = ''
      formData.title = ''
      formData.start = ''
      formData.categoryId = ''
      formData.amount = ''
      formData.memo = ''
      formData.type = ''
      validationErrors.title = '';
      validationErrors.type = '';
      validationErrors.categoryId = '';
      validationErrors.amount = '';
      formData.fckCategoryName = '';
    }

    function handleDateSelect(selectInfo) {  
      
      calendarApi.value = selectInfo.view.calendar
      const modalElement = document.getElementById('transactionModal');
      formData.start = selectInfo.startStr;

      calendarApi.value.unselect()

      modalElement.addEventListener('hide.bs.modal', resetFormData)
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      })
      modal.show()
    }

    function validateForm() {
      validationErrors.title = formData.title ? '' : '거래명을 입력해야 합니다.';
      validationErrors.type = formData.type ? '' : '거래 유형을 선택해야 합니다.';
      validationErrors.categoryId = formData.categoryId ? '' : '카테고리를 선택해야 합니다.';
      if (!formData.amount) {
        validationErrors.amount = '금액을 입력해야 합니다.';
      } else if (!/^\d+$/.test(formData.amount)) {
        validationErrors.amount = '금액은 숫자로만 입력해야 합니다.';
        formData.amount = ''
      } else {
        validationErrors.amount = '';
      }

    }

    function formatAmount(amount) {
      return new Intl.NumberFormat().format(amount);
    }

    function saveTransaction() {
      validateForm();
      if (canSave.value) {
        const newEvent = {
          id: userId + "+" + String(currentEvents.value.length + 1),
          title: formData.title,
          start: formData.start,
          end: formData.start,
          memo: formData.memo,
          categoryId : formData.categoryId,
          amount : formatAmount(formData.amount),
          type : formData.type,
          allDay: true,
        }
        calendarApi.value.addEvent(newEvent)
        axios.post('http://localhost:3000/transactions', { 
          id : newEvent.id,
          userId : userId,
          title : formData.title,
          start : formData.start,
          categoryId : formData.categoryId,
          amount : newEvent.amount,
          memo : formData.memo,
          type : formData.type
        })
        .then(response => {
          console.log('Event added:', response.data)
        })
        .catch(error => {
          console.error('Error adding event:', error)
        })
        const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'))
        modal.hide()
        resetFormData()
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
      formData.title = clickInfo.event.title;
      formData.start = clickInfo.event.startStr;
      formData.fckCategoryName = categories.value.find(cat => cat.id === clickInfo.event.extendedProps.categoryId).name
      formData.amount = clickInfo.event.extendedProps.amount;
      formData.type = type.value.find(item => item.type ==  clickInfo.event.extendedProps.type).name;
      formData.memo = clickInfo.event.extendedProps.memo;
      calendarApi.value = clickInfo.event;

      const modalElement = document.getElementById('eventDetailsModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
      modalElement.addEventListener('hide.bs.modal', resetFormData)
    }

    function deleteTransaction() {
      if (confirm(`${calendarApi.value.startStr}의 '${calendarApi.value.title}' 거래내역을 삭제하시겠습니까?`)) {
        axios.delete(`http://localhost:3000/transactions/${calendarApi.value.id}`)
          .then(response => {
            console.log('Event deleted:', response.data)
            calendarApi.value.remove() 
          })
          .catch(error => {
            console.error('Error deleting event:', error)
          })
          .finally(() => {
            bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal')).hide();
          })
      }
    }

    function getEventColor(type) {
      switch (type) {
        case 'expense':
          return '#d45333';
        case 'income':
          return '#596cdb';
        default:
          return 'grey'; // Default color for unknown types
      }
    };

    function handleEvents(events) {
      currentEvents.value = events
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
      getEventColor
    }
  }
})
</script>

<style lang='css'>
h2 {
  margin: 0;
  font-size: 16px;
}

.modal-dialog {
  min-width: 580px; /* 기본 값보다 더 크게 조정 */
}

.modal-backdrop.show {
  opacity: 0.5;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b { /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 50%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  overflow-y: auto;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #596cdb;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}


.fc-col-header-cell-cushion {
  text-decoration: none; 
  color: #ffffff;
}

.app-header-container {
  text-align: center;
  color: #f0f8ff;
  font-weight: bold;
  padding: 1rem;
}

.app-header {
  text-align: left;
  background-color: #0e3e72b2;
  border-radius: 8px;
  display: inline-block;
  padding: 0.5rem 1rem;
}


.fc-toolbar-title {
  font-size: 20px; 
  font-weight: bold; 
  color: white;
  background-color: #0e3e72b2; 
  padding: 5px 20px;  
  border-radius: 5px; 
  width: 100%; /* 가로 길이를 넓히기 위해 추가 */
  max-width: 1000px; /* 최대 너비를 제한하기 위해 추가, 필요에 따라 값 조정 */
  margin: 0 auto; /* 가운데 정렬을 위해 추가 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.fc-event {
  text-align: right;
  background-color: transparent;
  color: white;
  background-clip: padding-box; 
  border: none;
  padding-right: 1px;
}

.fc-col-header-cell {
  background-color: #0e3e72b2; /* 원하는 배경색으로 변경 */
  color: #ffffff; /* 텍스트 색상도 필요에 따라 변경 */
}

/* 날짜 셀 스타일 */
.fc-daygrid-day {
  background-color: #ffffff; /* 백그라운드 색상 */
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s; /* 전환 효과 */
}

.fc-daygrid-day:hover {
  /* transform: translate(-2px, -2px);  */
  box-shadow: -4px 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
  background-color: #babcc7a2; /* 호버 시 백그라운드 색상 */
}

.fc-daygrid-day-number {
  text-decoration: none; /* 날짜 숫자의 밑줄 제거 */
  color: #0e253db2; /* 텍스트 색상 */
  font-weight: bold; /* 텍스트 굵게 */

}
.fc-button.fc-button-primary {
  background-color: #0e3e72b2; /* 배경색 */
  border: none; /* 테두리 제거 */
  color: white; /* 텍스트 색상 */
  padding: 5px 10px; /* 패딩 */
  border-radius: 5px; /* 모서리 둥글게 */
}

/* 화살표 버튼 스타일 */
.fc-button.fc-button-primary.fc-prev-button,
.fc-button.fc-button-primary.fc-next-button {
  background-color: #0e3e72b2; /* 배경색 */
  border: none; /* 테두리 제거 */
  color: white; /* 텍스트 색상 */
  padding: 5px 10px; /* 패딩 */
  border-radius: 5px; /* 모서리 둥글게 */
  margin: 0 5px; /* 간격 */
}
/* 이벤트 색상 스타일 */
.fc-event {
  text-align: right;
  background-color: transparent;
  color: white;
  background-clip: padding-box; 
  border: none;
  padding-right: 1px;
  transition: transform 0.2s, box-shadow 0.2s; /* 이벤트에 전환 효과 추가 */
}

.fc-event.expense:hover,
.fc-event.income:hover {
  transform: translate(-3px, -3px) !important; /* 위치 이동 */
  box-shadow: -4px 4px 8px rgba(0, 0, 0, 0.2) !important; /* 그림자 효과 */
}

.fc-event.expense {
  background-color: rgb(172, 18, 18); /* 지출 색상 */
}

.fc-event.income {
  background-color: rgb(10, 10, 138);; /* 수입 색상 */
}

.event-custom i {
  font-style: normal; /* 기울기 제거 */
}

.fc-event.transfer {
  background-color: grey; /* 이체 색상 */
}
</style>


<template>
  <div class='demo-app'>
    <Sidebar />
    <div class='demo-app-main'>
      <FullCalendar
        class='demo-app-calendar'
        :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
          <b> {{ arg.timeText }}</b>
          <i> {{ arg.event.title }} {{ arg.event.amount }}</i>
        </template>
      </FullCalendar>
    </div>

       <!-- 모달창 -->
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
                <select class="form-control" v-model="formData.typeId">
                  <option disabled value="">거래 유형을 선택하세요</option>
                  <option v-for="typeOption in type" :key="typeOption.id" :value="typeOption.id">
                    {{ typeOption.type }}
                  </option>
                </select>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">거래명</label>
                <input type="text" class="form-control" placeholder="거래명을 입력하세요" v-model="formData.title" />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">카테고리</label>
                <input type="text" class="form-control" readonly placeholder="카테고리 선택"
                       @click="openCategoryModal" :value="selectedCategoryName">
              </div>
              <div class="form-group mb-3">
                <label class="form-label">지출액</label>
                <input type="text" class="form-control" placeholder="금액을 입력하세요" v-model="formData.amount" />
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

    <!-- 카테고리 선택 모달 -->
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
                <div class="col-3" v-for="category in categories" :key="category.id">
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

    <!-- 카테고리별 정렬 모달 -->
    <div class="modal fade" id="categorySelectModal" tabindex="-1" aria-labelledby="categorySelectModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="categorySelectModalLabel">카테고리 선택</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <select class="form-select" aria-label="카테고리 선택" v-model="selectedCategory">
              <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" class="btn btn-primary" @click="applyCategoryFilter">적용</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
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
    const calendarApi = ref([])
    const userId = localStorage.getItem('userId') || "1"
    const type = ref([])
    const categories = ref([])
    const selectedCategoryName = ref('')
    const formData = reactive({
      start: '',
      title: '',
      category: '',
      amount: '',
      typeId: '',
      memo: ''
    })
    const calendarOptions = reactive({
      plugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      headerToolbar: {
        left: 'categoryButton prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      customButtons: {
        categoryButton: {
          text: '카테고리 보기',
          click: function() {
            openCategoryModal();
          }
        }
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
      const tmpType = await fetchType()
      categories.value = await fetchCategories()
      type.value = tmpType
      console.log(tmpType)
      calendarOptions.events = transactions;
      console.log(transactions)
      currentEvents.value = transactions
    })

    async function fetchType() {
      try {
        const response = await axios.get(`http://localhost:3000/type`)
        return response.data
      } catch (error) {
        console.error("type 가져오기 실패", error)
        return []
      }
    }

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
      formData.typeId = ''
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

    function saveTransaction() {
      if (calendarApi.value) {
        const newEvent = {
          id: userId + "+" + String(currentEvents.value.length + 1),
          title: formData.title,
          start: formData.start,
          end: formData.start,
          memo: formData.memo,
          allDay: true
        }
        calendarApi.value.addEvent(newEvent)

      axios.post('http://localhost:3000/transactions', { 
        id : newEvent.id,
        userId : userId,
        title : formData.title,
        start : formData.start,
        categoryId : formData.categoryId,
        amount : formData.amount,
        memo : formData.memo,
        typeId : formData.typeId
      })
      .then(response => {
        console.log('Event added:', response.data)
      })
      .catch(error => {
        console.error('Error adding event:', error)
      })
      } else {
        alert("거래 내역 저장에 실패했습니다")
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'))
      modal.hide()
      resetFormData()
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
      if (confirm(`${clickInfo.event.startStr}의 '${clickInfo.event.title}' 거래내역을 삭제하시겠습니까?`)) {
        axios.delete(`http://localhost:3000/transactions/${clickInfo.event.id}`)
          .then(response => {
            console.log('Event deleted:', response.data)
            clickInfo.event.remove() 
          })
          .catch(error => {
            console.error('Error deleting event:', error)
          })
      }
    }

    function handleEvents(events) {
      currentEvents.value = events
    }

    return {
      type,
      categories,
      calendarOptions,
      currentEvents,
      handleWeekendsToggle,
      formData,
      saveTransaction,
      openCategoryModal,
      selectCategory,
      selectedCategoryName
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
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
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
</style>
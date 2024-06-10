<template>
  <div class="container custom-container">
    <Sidebar />
    <div class="content container-fluid">
      <div class="content-header d-flex align-items-center">
        <div class="account-title flex-grow-1 d-flex align-items-center">
          <p class="account-text">Account</p>
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          preserveAspectRatio="xMidYMid meet"
        >
          <g clip-path="url(#clip0_1_984)">
            <path
              d="M11 7H13V9H11V7ZM12 17C12.55 17 13 16.55 13 16V12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12V16C11 16.55 11.45 17 12 17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="#84919A"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_1_984"><rect width="24" height="24" fill="white"></rect></clipPath>
          </defs>
        </svg>
      </div>
      <div class="tabs d-flex justify-content-start">
        <div class="tab selected">
          <div class="tab-content">
            <p class="tab-text selected-text">Privacy</p>
          </div>
        </div>
        <div class="tab">
          <div class="tab-content">
            <p class="tab-text">Preference</p>
          </div>
        </div>
      </div>
      <div class="form row">
        <div class="input-group col-md-6">
          <p class="input-label">이름</p>
          <input type="text" class="input-field" v-model="name" placeholder="이름을 입력하세요" />
        </div>
        <div class="input-group col-md-6">
          <p class="input-label">지출액</p>
          <input type="text" class="input-field" v-model="expense1" placeholder="금액을 입력하세요" />
        </div>
        <div class="input-group col-md-6">
          <p class="input-label">지출액</p>
          <input type="text" class="input-field" v-model="expense2" placeholder="을 입력하세요" />
        </div>
        <div class="input-group col-md-6">
          <p class="input-label">지출액</p>
          <input type="text" class="input-field" v-model="expense3" placeholder="금액을 입력하세요" />
        </div>
      </div>
      <div class="button-container d-flex justify-content-center mt-auto">
        <div class="button">
          <p class="button-text">수정</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../components/SideBar.vue'

const name = ref('')
const expense1 = ref('')
const expense2 = ref('')
const expense3 = ref('')
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background: #fff; 
}

.custom-container {
  max-width: 1400px; /* Increase this value to make the container wider */
  margin: 0px 0px 0px 0px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start; /* Align items to the start to keep the title on the left */
  flex-grow: 1;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: -6px 10px 40px 0 rgba(52, 52, 52, 0.08);
  overflow-y: auto;
  box-sizing: border-box;
  width: calc(100% - 40px); /* Adjust width to account for margin */
  margin: 20px; /* Add margin */
  max-width: 1400px; /* Limit the maximum width */
}

.content-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.account-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  position: relative;
  gap: 10px;
}

.account-text {
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  color: #6b7280;
}

.tabs {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%; /* Make tabs take the full width */
  gap: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1; /* Make tabs grow equally */
  flex-shrink: 0;
  gap: 16px;
}

.tab-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  position: relative;
  gap: 8px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 6px;
  padding-bottom: 6px;
  border-radius: 20px;
}

.tab-text {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: #6b7280;
}

.selected {
  border-bottom: 2px solid #656ce1;
}

.selected-text {
  color: #656ce1;
}

.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns layout */
  gap: 16px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%; /* Make input groups take the full width */
}

.input-label {
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: #000;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.button-container {
  width: 100%;
  padding: 0 16px; /* Add padding for the left and right margins */
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  gap: 8px;
  padding: 4px; /* Add padding to the button */
  border-radius: 8px;
  background: #000;
  box-shadow: 0px 1px 2px 0 rgba(0, 0, 0, 0.05);
  width: 100%; /* Make button width full */
  max-width: 500px; /* Limit the button's maximum width */
  margin: 20px auto 0 auto; /* Center the button and add top margin */
}

.button-text {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 20px; /* Smaller font size */
  font-weight: 500;
  text-align: center; /* Center align text */
  color: #fff;
}
</style>

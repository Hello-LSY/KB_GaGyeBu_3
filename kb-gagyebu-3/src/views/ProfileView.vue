<template>
  <div class="container">
    <div class="custom-container">
      <div class="content container-fluid">
        <div class="content-header d-flex align-items-center">
          <div class="account-title flex-grow-1 d-flex align-items-center">
            <p class="account-text">{{ $t('account') }}</p>
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
          <div class="tab" :class="{ selected: currentTab === 'privacy' }" @click="selectTab('privacy')">
            <div class="tab-content">
              <p class="tab-text" :class="{ 'selected-text': currentTab === 'privacy' }">{{ $t('privacy') }}</p>
            </div>
          </div>
          <div class="tab" :class="{ selected: currentTab === 'preference' }" @click="selectTab('preference')">
            <div class="tab-content">
              <p class="tab-text" :class="{ 'selected-text': currentTab === 'preference' }">{{ $t('preference') }}</p>
            </div>
          </div>
        </div>
        <div class="form row">
          <div v-if="currentTab === 'privacy'">
            <div class="input-group">
              <p class="input-label">{{ $t('userId') }}</p>
              <input type="text" class="input-field" v-model="userId" :placeholder="$t('userId')" disabled />
            </div>
            <div class="input-group">
              <p class="input-label">{{ $t('name') }}</p>
              <input type="text" class="input-field" v-model="name" :placeholder="$t('name')" />
            </div>
            <div class="input-group">
              <p class="input-label">{{ $t('email') }}</p>
              <input type="text" class="input-field" v-model="email" :placeholder="$t('email')" />
            </div>
            <div class="input-group">
              <p class="input-label">{{ $t('changePassword') }}</p>
              <input type="password" class="input-field" v-model="password" :placeholder="$t('changePassword')" />
            </div>
            <div class="input-group">
              <p class="input-label">{{ $t('confirmPassword') }}</p>
              <input type="password" class="input-field" v-model="confirmPassword" :placeholder="$t('confirmPassword')" />
            </div>
          </div>
          <div v-if="currentTab === 'preference'">
            <div class="input-group">
              <p class="input-label">{{ $t('notifications') }}</p>
              <input type="checkbox" class="input-field" v-model="notifications" />
            </div>
            <div class="input-group">
              <p class="input-label">{{ $t('language') }}</p>
              <select class="input-field" v-model="language" @change="changeLanguage">
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </div>
            <div class="input-group">
              <p class="input-label">{{ $t('theme') }}</p>
              <select class="input-field" v-model="theme" @input="changeTheme">
                <option value="light">{{ $t('light') }}</option>
                <option value="dark">{{ $t('dark') }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="button-container d-flex justify-content-center mt-auto">
          <div class="button" @click="currentTab === 'privacy' ? updatePassword() : updateSettings()">
            <p class="button-text">{{ $t('modify') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useSettingsStore } from '@/stores/setting';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const currentTab = ref('privacy');
const userId = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const notifications = ref(false);
const language = ref('ko');
const theme = ref('light');

const themeStore = useThemeStore();
theme.value = themeStore.theme;

const settingsStore = useSettingsStore();
notifications.value = settingsStore.notifications;


const changeTheme = () => {
  themeStore.setTheme(theme.value);
};

const changeLanguage = () => {
  locale.value = language.value;
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userId.value = user.id;
    name.value = user.name;
    email.value = user.email;
  }
});

const selectTab = async (tab) => {
  currentTab.value = tab;
  if (tab === 'preference') {
    try {
      const response = await axios.get(`http://localhost:3000/settings?userId=${userId.value}`);
      const settings = response.data[0];
      notifications.value = settings.notifications;
      language.value = settings.language;
      theme.value = settings.theme;
    } catch (error) {
      console.error(error);
    }
  }
};

const updatePassword = async () => {
  if (password.value !== confirmPassword.value) {
    alert(t('passwordMismatch'));
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    user.password = password.value;

    // 로컬 스토리지 업데이트
    localStorage.setItem('user', JSON.stringify(user));

    // JSON 서버 업데이트
    await axios.put(`http://localhost:3000/users/${userId.value}`, { password: password.value });

    alert(t('passwordChangeSuccess'));
  } catch (error) {
    console.error(error);
    alert(t('passwordChangeError'));
  }
};

const updateSettings = async () => {
  try {
    console.log("세팅 변경");
    const response = await axios.get(`http://localhost:3000/settings?userId=${userId.value}`);
    const existingSettings = response.data[0];

    if (existingSettings) {
      const settings = {
        userId: userId.value,
        notifications: notifications.value,
        language: language.value,
        theme: theme.value,
      };

      // JSON 서버 업데이트
      await axios.put(`http://localhost:3000/settings/${existingSettings.id}`, settings);

      // Pinia store 업데이트
      themeStore.setTheme(settings.theme);
      settingsStore.setLanguage(settings.language);
      settingsStore.setNotifications(settings.notifications);

      alert(t('settingsChangeSuccess'));
    } else {
      alert(t('settingsNotFound'));
    }
  } catch (error) {
    console.error(error);
    alert(t('settingsChangeError'));
  }
};

</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  padding: 0;
  background: var(--background-color);
  margin: 0;
  width: 100%;
  max-width: 100vw;
}

.custom-container {
  display: flex;
  flex-grow: 1;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
  align-items: center; /* Center content horizontally */
  flex-grow: 1;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: var(--content-background);
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
  color: var(--link-color);
}

.tabs {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%; /* Make tabs take the full width */
  gap: 16px;
  border-bottom: 1px solid var(--border-color);
}

.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1; /* Make tabs grow equally */
  flex-shrink: 0;
  gap: 16px;
  cursor: pointer; /* Add cursor pointer */
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
  color: var(--text-color);
}

.selected {
  border-bottom: 2px solid var(--selected-tab-color);
}

.selected-text {
  color: var(--selected-tab-color);
}

.form {
  display: flex;
  flex-direction: column; /* Arrange items in a column */
  gap: 32px; /* Increase gap between input groups */
  align-items: center; /* Center form items horizontally */
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px; /* Reduce gap between label and input */
  width: 60%; /* Adjust width as needed */
  margin: 10px auto;
}

.input-label {
  margin-bottom: 2px;
  font-size: 15px; /* Increase font size for better readability */
  font-weight: 600; /* Make font weight bolder */
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Use a more modern and readable font */
  text-align: left;
  color: var(--text-color);
}

.input-field {
  width: 100%;
  padding: 3px 12px; /* Adjust padding for better appearance */
  margin: 0;
  border-radius: 8px;
  background: var(--input-background);
  border: 1px solid var(--input-border-color);
  box-shadow: 0px 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 16px; /* Adjust font size for input fields */
  height: auto;
  color: var(--text-color);
}

.button-container {
  width: 100%;
  padding: 0 16px;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  gap: 8px;
  padding: 12px 0 0 0; /* Increase padding for better appearance */
  border-radius: 30px; /* Make the button more rounded */
  background: var(--button-background); /* 파스텔톤의 파란 그라데이션 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Add a box shadow */
  width: 100%; /* Make button width full */
  max-width: 600px; /* Limit the button's maximum width */
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
}

.button:hover {
  background: var(--button-hover-background); /* Hover gradient background */
}

.button:active {
  transform: scale(0.95);
}

.button-text {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 18px; /* Font size */
  font-weight: 600; /* Font weight */
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Use a modern, readable font */
  text-align: center;
  color: var(--button-text-color); /* Text color */
  line-height: 1; /* Ensure the text is vertically centered */
}

</style>

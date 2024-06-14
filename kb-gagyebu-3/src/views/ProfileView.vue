<template>
  <div class="container">
    <div class="custom-container">
      <div class="content container-fluid">
        <div v-if="!isPasswordChecked" class="password-check-container">
          <div class="input-group">
            <p class="input-label">{{ $t('비밀번호 입력') }}</p>
            <input type="password" class="input-field" v-model="passwordCheck" :placeholder="$t('password')" />
          </div>
          <div class="button-container d-flex justify-content-center mt-auto">
            <div class="button" @click="checkPassword">
              <p class="button-text">{{ $t('confirm') }}</p>
            </div>
          </div>
        </div>
        <div v-else class="password-check-container"">
          <div class="header-wrapper"> <!-- 추가된 부분 -->
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
                <div class="custom-checkbox">
                  <input type="checkbox" id="notifications" class="input-checkbox" v-model="notifications" />
                  <label for="notifications" class="checkbox-label">{{ notifications ? $t('enabled') : $t('disabled') }}</label>
                </div>
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
            <div class="button-container d-flex justify-content-center mt-auto">
              <div class="button" @click="currentTab === 'privacy' ? updatePassword() : updateSettings()">
                <p class="button-text">{{ $t('modify') }}</p>
              </div>
            </div>
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
const passwordCheck = ref('');
const isPasswordChecked = ref(false);

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

const checkPassword = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.password === passwordCheck.value) {
    isPasswordChecked.value = true;
  } else {
    alert(t('passwordIncorrect'));
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
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  gap: 24px;
  padding: 24px;
  border-radius: 12px;
  background: var(--content-background);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  box-sizing: border-box;
  width: calc(100% - 48px);
  margin: 24px;
  max-width: 1200px;
}

.password-check-container {
  width: 80%; /* 기존 양식과 동일한 너비 */
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.header-wrapper {
  position: sticky; /* 추가된 부분 */
  top: 0; /* 추가된 부분 */
  background: var(--content-background); /* 추가된 부분 */
  z-index: 10; /* 추가된 부분 */
  width: 100%; /* 추가된 부분 */
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

.account-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.account-text {
  font-size: 26px;
  font-weight: bold;
  text-align: left;
  color: var(--link-color);
}

.tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 24px;
  border-bottom: 1px solid var(--border-color);
  padding-top: 10px;
}

.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.tab:hover {
  background-color: var(--hover-background-color);
}

.tab-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.selected {
  background-color: var(--selected-tab-background);
}

.selected-text {
  color: var(--selected-tab-color);
}

.form {
  display: flex;
  flex-direction: row; /* 변경된 부분 */
  flex-wrap: wrap; /* 추가된 부분: 행이 너무 길어지지 않도록 */
  gap: 24px;
  align-items: center;
  width: 100%;
  justify-content: center; /* 변경된 부분: 가운데 정렬 */
  /* 위쪽에 마진 추가 */
  margin-top: 120px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0px;
  width: 80%;
  margin: 20px auto;
}

.input-label {
  font-size: 15px;
  font-weight: 600;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  text-align: left;
  color: var(--text-color);
}

.input-field {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--input-background);
  border: 1px solid var(--input-border-color);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 16px;
  color: var(--text-color);
}

.input-field:focus {
  border-color: var(--input-focus-border-color);
  outline: none;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-checkbox {
  width: 20px;
  height: 20px;
  margin: 0;
  cursor: pointer;
}

.checkbox-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);
}

.button-container {
  padding: 24px 0; /* 변경된 부분: 상하 패딩 추가 */
  display: flex; /* 추가된 부분 */
  justify-content: center; /* 추가된 부분 */
  width: 100%; /* 추가된 부분 */
  max-width: 300px; /* 추가된 부분 */
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 20px;
  border-radius: 30px;
  background: var(--button-background);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
  position: relative; /* 추가된 부분 */
  line-height: normal; /* 추가된 부분 */
}

.button:hover {
  background: var(--button-hover-background);
}

.button:active {
  transform: scale(0.95);
}

.button-text {
  font-size: 22px;
  font-weight: bold;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  text-align: center;
  color: var(--button-text-color);
  line-height: 1.2;
  position: absolute; /* 추가된 부분 */
  top: 50%; /* 추가된 부분 */
  left: 50%; /* 추가된 부분 */
  transform: translate(-50%, -50%); /* 추가된 부분 */
}

.icon {
  fill: var(--icon-color);
  transition: fill 0.3s;
}

.icon:hover {
  fill: var(--icon-hover-color);
}

</style>

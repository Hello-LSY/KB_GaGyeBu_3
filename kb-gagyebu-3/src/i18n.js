import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    account: 'Account',
    privacy: 'Privacy',
    preference: 'Preference',
    userId: 'User ID',
    name: 'Name',
    email: 'Email',
    changePassword: 'Change Password',
    confirmPassword: 'Confirm Password',
    notifications: 'Notifications',
    language: 'Language',
    theme: 'Theme',
    modify: 'Modify',
    light: 'Light',
    dark: 'Dark',
    passwordMismatch: 'Passwords do not match.',
    passwordChangeSuccess: 'Password has been successfully changed.',
    passwordChangeError: 'An error occurred while changing the password.',
    settingsChangeSuccess: 'Settings have been successfully changed.',
    settingsChangeError: 'An error occurred while changing the settings.',
    settingsNotFound: 'Settings not found.',
    enabled: 'Enabled',
    disabled: 'Disabled',
  },
  ko: {
    account: '계정',
    privacy: '개인 정보',
    preference: '선호 설정',
    userId: '아이디',
    name: '이름',
    email: '이메일',
    changePassword: '비밀번호 수정',
    confirmPassword: '비밀번호 확인',
    notifications: '알림 설정',
    language: '언어',
    theme: '테마',
    modify: '수정하기',
    light: '라이트',
    dark: '다크',
    passwordMismatch: '비밀번호가 일치하지 않습니다.',
    passwordChangeSuccess: '비밀번호가 성공적으로 변경되었습니다.',
    passwordChangeError: '비밀번호 변경 중 오류가 발생했습니다.',
    settingsChangeSuccess: '설정이 성공적으로 변경되었습니다.',
    settingsChangeError: '설정 변경 중 오류가 발생했습니다.',
    settingsNotFound: '설정을 찾을 수 없습니다.',
    enabled: '활성화됨',
    disabled: '비활성화됨',
  },
};


const i18n = createI18n({
  locale: 'ko', // 기본 언어 설정
  fallbackLocale: 'en',
  messages,
});

export default i18n;

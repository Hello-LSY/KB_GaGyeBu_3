import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    language: localStorage.getItem('language') || 'ko',
    notifications: JSON.parse(localStorage.getItem('notifications')) || false,
  }),
  actions: {
    setLanguage(language) {
      this.language = language;
      localStorage.setItem('language', language);
    },
    setNotifications(notifications) {
      this.notifications = notifications;
      localStorage.setItem('notifications', JSON.stringify(notifications));
    },
  },
});

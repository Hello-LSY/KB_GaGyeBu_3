import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light',
  }),
  actions: {
    setTheme(newTheme) {
      this.theme = newTheme;
      console.log(this.theme);
      console.log(newTheme);
      console.log("theme ")
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    },
  },
});

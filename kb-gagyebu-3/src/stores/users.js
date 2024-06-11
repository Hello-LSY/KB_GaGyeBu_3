import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    async fetchUsers() {
      const response = await axios.get('http://localhost:3000/users');
      this.users = response.data;
    }
  }
});

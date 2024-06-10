import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user ? state.user.name : ''
  },
  actions: {
    async register(name, email, password) {
      try {
        const response = await axios.post('http://localhost:3000/users', {
          name,
          email,
          password
        });

        if (response.status === 201) {
          alert('Registration successful');
        } else {
          throw new Error('Registration failed');
        }
      } catch (error) {
        console.error('Error registering:', error);
        throw error;
      }
    },
    async login(email, password) {
      try {
        const response = await axios.get(`http://localhost:3000/users?email=${email}&password=${password}`);
        
        if (response.data.length > 0) {
          const user = response.data[0];
          this.user = user;
          this.token = btoa(`${user.email}:${user.password}`); // Base64 암호화
          localStorage.setItem('token', this.token);
          localStorage.setItem('user', JSON.stringify(user)); // 사용자 정보도 저장
          alert('Login successful');
        } else {
          throw new Error('Incorrect email or password');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('Logged out');
    },
    loadUserFromStorage() {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user);
        this.token = localStorage.getItem('token');
      }
    }
  }
});

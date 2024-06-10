import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || ''
  }),
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
          this.token = btoa(`${user.email}:${user.password}`); // Base64 encoding email and password as a token
          localStorage.setItem('token', this.token);
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
      alert('Logged out');
    }
  }
});

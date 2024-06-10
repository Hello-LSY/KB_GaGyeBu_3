<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="formData.name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="formData.email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="formData.password" required />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const formData = reactive({
      name: '',
      email: '',
      password: ''
    });

    const register = async () => {
      try {
        await authStore.register(formData.name, formData.email, formData.password);
        router.push('/login');
      } catch (error) {
        alert(error.message);
      }
    };

    return {
      formData,
      register
    };
  }
};
</script>

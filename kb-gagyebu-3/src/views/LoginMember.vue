<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="formData.email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="formData.password" required />
      </div>
      <button type="submit">Login</button>
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
      email: '',
      password: ''
    });

    const login = async () => {
      try {
        await authStore.login(formData.email, formData.password);
        router.push('/');
      } catch (error) {
        alert(error.message);
      }
    };

    return {
      formData,
      login
    };
  }
};
</script>

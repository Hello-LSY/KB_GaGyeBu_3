<template>
  <div class="login p-3">
    <h2>Login</h2>

      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input type="email" class="form-control" v-model="formData.email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" class="form-control" v-model="formData.password" required />
      </div>
      <button type="button" class="btn btn-primary w-100" @click="login">Login</button>
  </div>
</template>

<script setup>
import { reactive, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close-modal']);
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
    // 로그인 성공 시 모달 닫기 이벤트 트리거
    emit('close-modal');
  } catch (error) {
    alert(error.message);
  }
};
</script>

<style scoped>
.login {
  max-width: 600px;
  margin: auto;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>

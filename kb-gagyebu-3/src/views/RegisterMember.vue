<template>
  <div class="register p-3">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input type="text" class="form-control" v-model="formData.name" required />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input type="email" class="form-control" v-model="formData.email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" class="form-control" v-model="formData.password" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Register</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { defineEmits } from 'vue';

const emit = defineEmits(['close-modal']);
const authStore = useAuthStore();
const router = useRouter();
const formData = reactive({
  name: '',
  email: '',
  password: ''
});

const register = async () => {
  try {
    // 이메일 중복 검사
    const response = await axios.get(`http://localhost:3000/users?email=${formData.email}`);
    if (response.data.length > 0) {
      alert('이미 사용중인 이메일입니다.');
      return;
    }

    // 회원가입 처리
    await authStore.register(formData.name, formData.email, formData.password);
    router.push('/login');
    // 회원가입 성공 시 모달 닫기 이벤트 트리거
    emit('close-modal');
  } catch (error) {
    alert(error.message);
  }
};
</script>

<style scoped>
.register {
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

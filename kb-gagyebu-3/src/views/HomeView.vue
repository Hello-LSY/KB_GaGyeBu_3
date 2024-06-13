<template>
  <div id="wrapper">
    <header id="header">
      <div class="content">
        <h1>적고 가계</h1>
        <p class="h5 mb-2">사용자의 소비를 분석해주는 나만의 가계부</p>
        <p class="h6">거기 자네👈 적고 가게😎</p>
        <ul class="actions">
          <li><button class="button primary icon solid bi-box-arrow-in-right" @click="openModal('loginModal')">로그인</button></li>
          <li><button class="button icon solid fa-chevron-down scrolly" @click="openModal('registerModal')">시작하기</button></li>
        </ul>
      </div>
      <div class="image phone">
        <div class="inner"><img :src="myImage" alt="My Image" /></div>
      </div>
    </header>

    <section id="one" class="wrapper style2 special">
      <header class="major">
        <h2>저희의 개발 스택을 확인하세요!</h2>
      </header>
      <ul class="icons major">
        <li><span class="icon solid fa-database"><span class="label">Database</span></span></li>
        <li><span class="icon brands fa-vuejs"><span class="label">Vue</span></span></li>
        <li><span class="icon solid fa-code"><span class="label">HTML</span></span></li>
        <li><span class="icon solid fa-paint-brush"><span class="label">CSS</span></span></li>
      </ul>
    </section>

    <section id="two" class="wrapper">
      <div class="inner alt">
        <section class="spotlight" v-for="(spotlight, index) in spotlights" :key="index">
          <div class="image"><img :src="spotlight.image" alt="" /></div>
          <div class="content">
            <h3>{{ spotlight.title }}</h3>
            <p>{{ spotlight.description }}</p>
          </div>
        </section>
        <section class="special">
          <ul class="icons labeled">
            <li><span class="icon solid fa-globe"><span class="label">어디서나 접근 가능!</span></span></li>
            <li><span class="icon solid fa-sync-alt"><span class="label">데이터가 자동으로 업데이트!</span></span></li>
            <li><span class="icon solid fa-pen"><span class="label">쉽고 빠른 장부 등록!</span></span></li>
            <li><span class="icon solid fa-chart-line"><span class="label">사용자화된 데이터 분석!</span></span></li>
            <li><span class="icon solid fa-lock"><span class="label">안전한 보안!</span></span></li>
          </ul>
        </section>
      </div>
    </section>

    <!-- 로그인 모달 -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
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
              <button type="button" class="btn btn-primary w-100" @click="login('loginModal')">Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 회원가입 모달 -->
    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="register p-3">
              <h2>Register</h2>
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
              <button type="button" class="btn btn-primary w-100" @click="register('registerModal')">Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer id="footer">
      <ul class="icons">
        <li><a href="#" class="icon brands fa-facebook-f"><span class="label">Facebook</span></a></li>
        <li><a href="#" class="icon brands fa-twitter"><span class="label">Twitter</span></a></li>
        <li><a href="#" class="icon brands fa-instagram"><span class="label">Instagram</span></a></li>
      </ul>
      <p class="copyright">&copy; Untitled. Credits: <a href="http://html5up.net">HTML5 UP</a></p>
    </footer>
  </div>
</template>

<script setup>
import {reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';

// 이미지 경로를 직접 import
import pic01 from '../assets/Home/images/alertImage.png';
import pic02 from '../assets/Home/images/pic02.jpg';
import pic03 from '../assets/Home/images/pic03.jpg';
import pic04 from '../assets/Home/images/alertImage.png';
import myImageFile from '../assets/logo_l.png';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

// 이미지 파일 경로를 ref로 설정
const formData = reactive({
  name: '',
  email: '',
  password: ''
});
const authStore = useAuthStore();
const router = useRouter();
const myImage = ref(myImageFile);
// spotlight 데이터 정의
const spotlights = ref([
  {
    image: pic01,
    title: '설명 1',
    description: '내용 설명',
  },
  {
    image: pic02,
    title: '설명 2',
    description: '내용 설명 2',
  },
  {
    image: pic03,
    title: '설명 3',
    description: '내용 설명 3',
  },  
  {
    image: pic04,
    title: '사용자화된 알림!',
    description: '당신의 알림을 확인해보세요!',
  }
]);

const login = async (modalId) => {
  try {
    await authStore.login(formData.email, formData.password);
    closeModal(modalId)
    router.push('/');
    // 로그인 성공 시 모달 닫기 이벤트 트리거
  } catch (error) {
    alert(error.message);
  }
};

const register = async (modalId) => {
  try {
    // 이메일 중복 검사
    const response = await axios.get(`http://localhost:3000/users?email=${formData.email}`);
    if (response.data.length > 0) {
      alert('이미 사용중인 이메일입니다.');
      return;
    }

    // 회원가입 처리
    await authStore.register(formData.name, formData.email, formData.password);
    closeModal(modalId);
    router.push('/login');
    // 회원가입 성공 시 모달 닫기 이벤트 트리거
  } catch (error) {
    alert(error.message);
  }

};

const resetFormData = () => {
  formData.name = '';
  formData.email = '';
  formData.password = '';
}

const openModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  const modal = new bootstrap.Modal(modalElement, {
    backdrop: 'static' 
  });
  modal.show();
  modalElement.addEventListener('hide.bs.modal', resetFormData)
};

const closeModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
};

// jQuery를 먼저 로드한 후에 다른 스크립트를 로드
const scripts = [
  '/src/assets/Home/js/jquery.min.js',
  '/src/assets/Home/js/jquery.scrolly.min.js',
  '/src/assets/Home/js/browser.min.js',
  '/src/assets/Home/js/breakpoints.min.js',
  '/src/assets/Home/js/util.js',
  '/src/assets/Home/js/main.js',
];

const loadScriptsSequentially = async (urls) => {
  for (const url of urls) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = false; // 순차적으로 로드
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
};

loadScriptsSequentially(scripts);
</script>

<style scoped>
@import url('../assets/Home/css/main.css');

html, body {
  overflow-x: hidden;
}

#wrapper {
  width: 100%;
  overflow-x: hidden;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
}

.modal-content {
  margin: auto;
  width: 50%;
}

@media (max-width: 450px) {
  .modal-content {
    width: 90%;
    margin: auto;
    margin-right: 0;
  }
}

@media (max-width: 300px) {
  .modal-content {
    width: 100%;
    margin: auto;
    margin-right: 0;
  }
}
</style>

<template>
    <div class="home">
        <h1 class="mb-4">가계부는? 적고 가계</h1>
        <p class="mb-5">나의 소비를 분석해주는 가계부</p>
        <div class="d-flex justify-content-center mb-5">
            <router-link to="/login" class="btn btn-outline-primary me-2">로그인</router-link>
            <router-link to="/register" class="btn btn-primary">시작하기</router-link>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  }
  </script>
  
  <style scoped>
  </style>
  
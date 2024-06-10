<template>
  <div class="container mt-5">
    <div class="header mb-4">
      <h1 class="title">거래 등록</h1>
      <p class="subtitle">오늘의 지출을 등록하세요!</p>
    </div>
    <!-- 추후 캘린더로 추가 예정 -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#transactionModal">
      거래 등록하기(임시)
    </button>

    <!-- 부트스트랩 모달 -->
    <div class="modal fade" id="transactionModal" tabindex="-1" aria-labelledby="transactionModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="transactionModalLabel">거래 등록</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-container">
              <div class="form-group mb-3">
                <label class="form-label">지출명</label>
                <input type="text" class="form-control" placeholder="지출명을 입력하세요" />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">날짜</label>
                <input type="date" class="form-control" />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">카테고리</label>
                <input type="text" class="form-control" placeholder="카테고리" />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">지출액</label>
                <input type="text" class="form-control" placeholder="금액을 입력하세요" />
              </div>
              <div class="form-group mb-4">
                <label class="form-label">메모</label>
                <textarea class="form-control" rows="3" placeholder="메모를 적어주세요"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" class="btn btn-primary">저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  max-width: 700px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.title {
  font-size: 64px;
  font-weight: 700;
}
.subtitle {
  font-size: 20px;
  color: #828282;
}
</style>

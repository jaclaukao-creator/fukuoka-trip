// 切換分頁功能
function switchTab(tabId, element) {
  // 隱藏所有分頁
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // 移除所有按鈕的亮燈狀態
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
  });

  // 顯示選取的分頁並設定按鈕亮燈
  document.getElementById(tabId).classList.add('active');
  element.classList.add('active');

  // 切換時自動捲動回頁首
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 一鍵複製文字到剪貼簿
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`已複製：${text}`);
  }).catch(err => {
    console.error('複製失敗:', err);
  });
}

// 顯示 Toast 提示視窗
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}
// 切換頁籤
function switchTab(tabId, element) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  element.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 一鍵複製
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`已複製: ${text}`);
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// 行程彈窗控制
function openModal(title, desc, loc) {
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-desc').innerText = desc;
  document.getElementById('modal-loc').innerText = loc;
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// ---------------- 分帳系統邏輯 ----------------
let expenses = [];

function addExpense() {
  const title = document.getElementById('expense-title').value.trim();
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const payer = document.getElementById('expense-payer').value.trim();

  if (!title || !amount || !payer) {
    alert('請完整填寫消費項目、金額與付款人！');
    return;
  }

  expenses.push({ title, amount, payer });

  // 清空輸入欄
  document.getElementById('expense-title').value = '';
  document.getElementById('expense-amount').value = '';
  document.getElementById('expense-payer').value = '';

  renderExpenses();
  calculateSettlement();
}

function renderExpenses() {
  const listEl = document.getElementById('expense-list');
  if (expenses.length === 0) {
    listEl.innerHTML = '<div class="empty-text">尚無任何消費記錄</div>';
    return;
  }

  listEl.innerHTML = expenses.map(exp => `
    <div class="expense-item">
      <span><strong>${exp.title}</strong> (${exp.payer} 付款)</span>
      <span>¥${exp.amount.toLocaleString()}</span>
    </div>
  `).join('');
}

function calculateSettlement() {
  if (expenses.length === 0) {
    document.getElementById('settlement-result').innerHTML = '目前無須轉帳結算';
    return;
  }

  // 統計每個人墊付的總金額
  let totals = {};
  let totalAmount = 0;

  expenses.forEach(exp => {
    totals[exp.payer] = (totals[exp.payer] || 0) + exp.amount;
    totalAmount += exp.amount;
  });

  const people = Object.keys(totals);
  if (people.length < 2) {
    document.getElementById('settlement-result').innerHTML = '目前僅一人付款，無法平攤';
    return;
  }

  const avg = totalAmount / people.length;
  let balances = {};

  people.forEach(p => {
    balances[p] = totals[p] - avg;
  });

  // 計算誰該給誰多少錢
  let debtors = [];
  let creditors = [];

  for (let p in balances) {
    if (balances[p] < -0.01) debtors.push({ name: p, amount: -balances[p] });
    if (balances[p] > 0.01) creditors.push({ name: p, amount: balances[p] });
  }

  let results = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    let pay = Math.min(debtors[i].amount, creditors[j].amount);
    results.push(`<strong>${debtors[i].name}</strong> 應轉帳給 <strong>${creditors[j].name}</strong>: <strong>¥${Math.round(pay).toLocaleString()} JPY</strong>`);

    debtors[i].amount -= pay;
    creditors[j].amount -= pay;

    if (debtors[i].amount < 1) i++;
    if (creditors[j].amount < 1) j++;
  }

  document.getElementById('settlement-result').innerHTML = results.join('<br>') || '大家都已平攤，無須再轉帳';
}

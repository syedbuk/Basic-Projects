/* ============================================================
   TipSplit – Calculator Logic
   ============================================================ */

'use strict';

// ── DOM References ──────────────────────────────────────────
const billInput       = document.getElementById('bill-amount');
const numPeopleInput  = document.getElementById('num-people');
const customTipInput  = document.getElementById('custom-tip');
const customTipWrapper= document.getElementById('custom-tip-wrapper');
const tipButtons      = document.querySelectorAll('.tip-btn');
const resetBtn        = document.getElementById('reset-btn');
const decreaseBtn     = document.getElementById('decrease-people');
const increaseBtn     = document.getElementById('increase-people');

const tipPerPersonEl  = document.getElementById('tip-per-person');
const totalPerPersonEl= document.getElementById('total-per-person');
const totalBillEl     = document.getElementById('total-bill');
const billErrorEl     = document.getElementById('bill-error');
const peopleErrorEl   = document.getElementById('people-error');
const resultSubtotal  = document.getElementById('result-subtotal');
const resultTipTotal  = document.getElementById('result-tip-total');
const resultPeople    = document.getElementById('result-people');
const resultTipPct    = document.getElementById('result-tip-pct');

// ── State ────────────────────────────────────────────────────
let selectedTip = 15; // default tip %

// ── Helpers ──────────────────────────────────────────────────
const fmt = (val) =>
  `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function setError(el, msg) {
  el.textContent = msg;
}

function clearError(el) {
  el.textContent = '';
}

function popAnimate(el) {
  el.classList.remove('pop');
  // Force reflow
  void el.offsetWidth;
  el.classList.add('pop');
  el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
}

// ── Core Calculation ─────────────────────────────────────────
function calculate() {
  clearError(billErrorEl);
  clearError(peopleErrorEl);

  const bill   = parseFloat(billInput.value);
  const people = parseInt(numPeopleInput.value, 10);
  const tip    = parseFloat(selectedTip);

  // Validation
  let valid = true;

  if (billInput.value === '' || isNaN(bill) || bill < 0) {
    if (billInput.value !== '') {
      setError(billErrorEl, 'Enter a valid bill amount.');
      valid = false;
    }
  }

  if (isNaN(people) || people < 1) {
    setError(peopleErrorEl, 'At least 1 person required.');
    valid = false;
  }

  if (!valid || billInput.value === '' || isNaN(bill)) {
    resetDisplayValues();
    return;
  }

  const tipAmount   = bill * (tip / 100);
  const totalBill   = bill + tipAmount;
  const tipPerPerson   = tipAmount / people;
  const totalPerPerson = totalBill / people;

  // Update results with pop animation
  updateValue(tipPerPersonEl,   fmt(tipPerPerson));
  updateValue(totalPerPersonEl, fmt(totalPerPerson));
  updateValue(totalBillEl,      fmt(totalBill));

  // Update breakdown
  resultSubtotal.textContent = fmt(bill);
  resultTipTotal.textContent = fmt(tipAmount);
  resultPeople.textContent   = people === 1 ? '1 person' : `${people} people`;
  resultTipPct.textContent   = tip;
}

function updateValue(el, newText) {
  if (el.textContent !== newText) {
    el.textContent = newText;
    popAnimate(el);
  }
}

function resetDisplayValues() {
  tipPerPersonEl.textContent   = '$0.00';
  totalPerPersonEl.textContent = '$0.00';
  totalBillEl.textContent      = '$0.00';
  resultSubtotal.textContent   = '$0.00';
  resultTipTotal.textContent   = '$0.00';
  resultPeople.textContent     = numPeopleInput.value === '1' ? '1 person' : `${numPeopleInput.value} people`;
}

// ── Tip Button Selection ─────────────────────────────────────
function selectTipButton(btn) {
  tipButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

tipButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.tip === 'custom') {
      // Show custom input
      customTipWrapper.hidden = false;
      customTipInput.focus();
      selectedTip = parseFloat(customTipInput.value) || 0;
      resultTipPct.textContent = selectedTip;
      selectTipButton(btn);
    } else {
      customTipWrapper.hidden = true;
      selectedTip = parseFloat(btn.dataset.tip);
      resultTipPct.textContent = selectedTip;
      selectTipButton(btn);
    }
    calculate();
  });
});

customTipInput.addEventListener('input', () => {
  const val = parseFloat(customTipInput.value);
  if (!isNaN(val) && val >= 0 && val <= 100) {
    selectedTip = val;
    resultTipPct.textContent = val;
    calculate();
  }
});

// ── Bill & People Inputs ─────────────────────────────────────
billInput.addEventListener('input', calculate);
numPeopleInput.addEventListener('input', () => {
  const v = parseInt(numPeopleInput.value, 10);
  if (!isNaN(v) && v < 1) numPeopleInput.value = 1;
  if (!isNaN(v) && v > 99) numPeopleInput.value = 99;
  calculate();
});

// ── Stepper Buttons ──────────────────────────────────────────
decreaseBtn.addEventListener('click', () => {
  const current = parseInt(numPeopleInput.value, 10) || 1;
  if (current > 1) {
    numPeopleInput.value = current - 1;
    calculate();
  }
});

increaseBtn.addEventListener('click', () => {
  const current = parseInt(numPeopleInput.value, 10) || 1;
  if (current < 99) {
    numPeopleInput.value = current + 1;
    calculate();
  }
});

// ── Reset ─────────────────────────────────────────────────────
resetBtn.addEventListener('click', () => {
  billInput.value       = '';
  numPeopleInput.value  = '1';
  customTipInput.value  = '';
  customTipWrapper.hidden = true;
  selectedTip = 15;
  resultTipPct.textContent = 15;

  // Re-activate default tip button
  tipButtons.forEach(b => b.classList.remove('active'));
  document.getElementById('tip-15').classList.add('active');

  clearError(billErrorEl);
  clearError(peopleErrorEl);
  resetDisplayValues();

  // Animate reset
  billInput.focus();
});

// ── Initial Render ───────────────────────────────────────────
calculate();

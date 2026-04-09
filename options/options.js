// options/options.js
import { DEFAULT_RULES } from '../rules/default-rules.js';

let customRules = [];

async function init() {
  const storage = await chrome.storage.sync.get('customRules');
  customRules = storage.customRules || [];
  renderCustomRules();
  renderBuiltinRules();
}

function makeCell(text, extraClass) {
  const td = document.createElement('td');
  if (extraClass) td.className = extraClass;
  td.textContent = text;  // textContent — safe
  return td;
}

function renderCustomRules() {
  const tbody = document.getElementById('rules-list');
  tbody.textContent = '';  // safe clear

  if (customRules.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.className = 'empty-note';
    td.textContent = 'No custom rules yet. Add one below.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  customRules.forEach((rule, i) => {
    const tr = document.createElement('tr');

    tr.appendChild(makeCell(rule.match === 'url' ? 'URL contains' : 'Title contains'));
    tr.appendChild(makeCell(rule.pattern));   // textContent — safe
    tr.appendChild(makeCell(rule.category));  // textContent — safe

    const actionTd = document.createElement('td');
    const delBtn   = document.createElement('button');
    delBtn.className = 'btn-delete';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', async () => {
      customRules.splice(i, 1);
      await saveRules();
      renderCustomRules();
    });
    actionTd.appendChild(delBtn);
    tr.appendChild(actionTd);

    tbody.appendChild(tr);
  });
}

function renderBuiltinRules() {
  const tbody = document.getElementById('builtin-list');
  tbody.textContent = '';  // safe clear

  for (const rule of DEFAULT_RULES) {
    const tr = document.createElement('tr');
    tr.appendChild(makeCell(rule.match === 'url' ? 'URL contains' : 'Title contains', 'muted'));
    tr.appendChild(makeCell(rule.pattern,  'muted'));  // textContent — safe
    tr.appendChild(makeCell(rule.category, 'muted'));  // textContent — safe
    tbody.appendChild(tr);
  }
}

async function saveRules() {
  await chrome.storage.sync.set({ customRules });
  const msg = document.getElementById('saved-msg');
  msg.style.display = 'inline';
  setTimeout(() => { msg.style.display = 'none'; }, 2000);
}

document.getElementById('btn-add').addEventListener('click', async () => {
  const match    = document.getElementById('new-match').value;
  const pattern  = document.getElementById('new-pattern').value.trim();
  const category = document.getElementById('new-category').value.trim();
  if (!pattern || !category) return;

  customRules.unshift({ match, pattern, category });
  await saveRules();
  renderCustomRules();

  document.getElementById('new-pattern').value  = '';
  document.getElementById('new-category').value = '';
});

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

init();

// popup/popup.js
import { DEFAULT_RULES, CATEGORY_COLORS } from '../rules/default-rules.js';
import { categorizeTab, filterTabs } from '../rules/tab-logic.js';

// ── State ─────────────────────────────────────────────────────────────────────
let categorizedTabs = [];
let customRules     = [];
let activeCategory  = null;   // null = All
let searchQuery     = '';
let recentlyClosed  = [];

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function init() {
  const [tabs, storage, sessions] = await Promise.all([
    chrome.tabs.query({}),
    chrome.storage.sync.get('customRules'),
    chrome.sessions.getRecentlyClosed({ maxResults: 25 }),
  ]);

  customRules = storage.customRules || [];

  categorizedTabs = tabs.map(tab => ({
    ...tab,
    category: categorizeTab(tab.url, tab.title, customRules),
  }));

  recentlyClosed = sessions
    .filter(s => s.tab)
    .map(s => s.tab);

  render();
}

// ── Derived view ──────────────────────────────────────────────────────────────
function getVisibleTabs() {
  let tabs = categorizedTabs;
  if (activeCategory) tabs = tabs.filter(t => t.category === activeCategory);
  if (searchQuery)    tabs = filterTabs(tabs, searchQuery);
  return tabs;
}

// ── Render orchestrator ───────────────────────────────────────────────────────
function render() {
  renderPills();
  renderTabList();
  renderRecentlyClosed();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function hostname(url) {
  try { return new URL(url).hostname; } catch { return url || ''; }
}

function timeAgo(lastModifiedSeconds) {
  if (!lastModifiedSeconds) return '';
  const s = Math.floor(Date.now() / 1000 - lastModifiedSeconds);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  return `${Math.floor(s / 86400)} day ago`;
}

// ── Pills ─────────────────────────────────────────────────────────────────────
function renderPills() {
  const counts = {};
  for (const t of categorizedTabs) counts[t.category] = (counts[t.category] || 0) + 1;

  const container = document.getElementById('pills');
  container.textContent = '';  // safe clear

  const allBtn = makePill('All', categorizedTabs.length, activeCategory === null);
  allBtn.addEventListener('click', () => { activeCategory = null; render(); });
  container.appendChild(allBtn);

  for (const [cat, count] of Object.entries(counts)) {
    const btn = makePill(cat, count, activeCategory === cat);
    btn.addEventListener('click', () => {
      activeCategory = activeCategory === cat ? null : cat;
      render();
    });
    container.appendChild(btn);
  }
}

function makePill(label, count, active) {
  const btn = document.createElement('button');
  btn.className = 'pill' + (active ? ' pill--active' : '');
  btn.textContent = `${label} ${count}`;  // textContent — safe
  return btn;
}

// ── Tab list ──────────────────────────────────────────────────────────────────
function renderTabList() {
  const list = document.getElementById('tab-list');
  list.textContent = '';  // safe clear

  const tabs = getVisibleTabs();
  if (tabs.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No tabs found';
    list.appendChild(p);
    return;
  }

  for (const tab of tabs) list.appendChild(makeTabRow(tab));
}

function makeTabRow(tab) {
  const colorHex = (CATEGORY_COLORS[tab.category] || CATEGORY_COLORS.Other).hex;
  const domain   = hostname(tab.url);

  const row = document.createElement('div');
  row.className = 'tab-row';
  row.tabIndex  = 0;
  row.dataset.tabId = String(tab.id);

  const bar = document.createElement('div');
  bar.className = 'tab-row__bar';
  bar.style.background = colorHex;  // constant hex from CATEGORY_COLORS — safe

  const info = document.createElement('div');
  info.className = 'tab-row__info';

  const titleEl = document.createElement('div');
  titleEl.className = 'tab-row__title';
  titleEl.textContent = tab.title || 'Untitled';  // textContent — safe

  const metaEl = document.createElement('div');
  metaEl.className = 'tab-row__meta';
  metaEl.textContent = `${domain} \u00B7 ${tab.category}`;  // textContent — safe

  info.appendChild(titleEl);
  info.appendChild(metaEl);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'tab-row__close';
  closeBtn.title = 'Close tab';
  closeBtn.textContent = '\u2715';  // ✕

  row.appendChild(bar);
  row.appendChild(info);
  row.appendChild(closeBtn);

  row.addEventListener('click', e => {
    if (e.target === closeBtn) return;
    chrome.tabs.update(tab.id, { active: true });
    chrome.windows.update(tab.windowId, { focused: true });
    window.close();
  });

  closeBtn.addEventListener('click', async e => {
    e.stopPropagation();
    await chrome.tabs.remove(tab.id);
    categorizedTabs = categorizedTabs.filter(t => t.id !== tab.id);
    render();
  });

  return row;
}

// ── Recently closed ───────────────────────────────────────────────────────────
function renderRecentlyClosed() {
  const section = document.getElementById('recently-closed');
  section.textContent = '';  // safe clear
  if (recentlyClosed.length === 0) return;

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = 'Recently Closed';
  section.appendChild(label);

  for (const tab of recentlyClosed) section.appendChild(makeClosedRow(tab));
}

function makeClosedRow(tab) {
  const domain = hostname(tab.url);
  const ago    = timeAgo(tab.lastModified);

  const row = document.createElement('div');
  row.className = 'tab-row tab-row--closed';

  const bar = document.createElement('div');
  bar.className = 'tab-row__bar';
  bar.style.background = '#45475a';

  const info = document.createElement('div');
  info.className = 'tab-row__info';

  const titleEl = document.createElement('div');
  titleEl.className = 'tab-row__title';
  titleEl.textContent = tab.title || 'Untitled';  // textContent — safe

  const metaEl = document.createElement('div');
  metaEl.className = 'tab-row__meta';
  metaEl.textContent = ago ? `${domain} \u00B7 ${ago}` : domain;  // textContent — safe

  info.appendChild(titleEl);
  info.appendChild(metaEl);

  const reopenBtn = document.createElement('button');
  reopenBtn.className = 'tab-row__reopen';
  reopenBtn.textContent = '\u21A9 Reopen';  // ↩ Reopen — textContent — safe

  row.appendChild(bar);
  row.appendChild(info);
  row.appendChild(reopenBtn);

  reopenBtn.addEventListener('click', () => {
    chrome.sessions.restore(tab.sessionId);
    window.close();
  });

  return row;
}

// ── Group tabs button ─────────────────────────────────────────────────────────
document.getElementById('btn-group').addEventListener('click', async () => {
  // Group per window — chrome.tabs.group requires tabs in the same window
  const byWindowCategory = {};
  for (const tab of categorizedTabs) {
    if (tab.category === 'Other') continue;
    const key = `${tab.windowId}::${tab.category}`;
    (byWindowCategory[key] = byWindowCategory[key] || []).push(tab.id);
  }

  for (const [key, tabIds] of Object.entries(byWindowCategory)) {
    const category  = key.split('::')[1];
    const colorInfo = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
    const groupId   = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, { title: category, color: colorInfo.color });
  }
});

// ── Close duplicate tabs ──────────────────────────────────────────────────────
document.getElementById('btn-dedup').addEventListener('click', async () => {
  // Group tabs by exact URL; keep the first occurrence (lowest tab id), close the rest
  const seen = new Map();   // url → first tab id encountered
  const toClose = [];

  for (const tab of categorizedTabs) {
    const url = tab.url;
    if (!url || url === 'chrome://newtab/') continue;  // skip blank/new-tab pages
    if (seen.has(url)) {
      toClose.push(tab.id);
    } else {
      seen.set(url, tab.id);
    }
  }

  if (toClose.length === 0) return;  // nothing to do

  await chrome.tabs.remove(toClose);
  categorizedTabs = categorizedTabs.filter(t => !toClose.includes(t.id));
  render();
});

// ── Rules button ──────────────────────────────────────────────────────────────
document.getElementById('btn-rules').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

// ── Search ────────────────────────────────────────────────────────────────────
document.getElementById('search').addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

// ── Keyboard navigation ───────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const rows    = [...document.querySelectorAll('.tab-row:not(.tab-row--closed)')];
  const focused = document.activeElement;
  const idx     = rows.indexOf(focused);
  const search  = document.getElementById('search');

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    (rows[idx + 1] ?? rows[0])?.focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    (rows[idx - 1] ?? rows[rows.length - 1])?.focus();
  } else if (e.key === 'Enter' && idx !== -1) {
    focused.click();
  } else if ((e.key === 'Delete' || e.key === 'Backspace') && idx !== -1 && focused !== search) {
    e.preventDefault();
    focused.querySelector('.tab-row__close')?.click();
  } else if (e.key === 'Escape') {
    window.close();
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
init();

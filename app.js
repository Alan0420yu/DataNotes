'use strict';
const CATEGORIES = ['全部', 'SQL', 'Python', '統計學', '資料分析'];
const LEVELS = ['入門', '中階', '進階'];
const state = { notes: [], category: '全部', query: '', sort: 'newest', selectedId: null };
const $ = (selector) => document.querySelector(selector);
const grid = $('#note-grid');
const detail = $('#note-detail');

function isValidNote(note) {
  return note && typeof note === 'object' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note.id) &&
    typeof note.title === 'string' && note.title.trim() && CATEGORIES.includes(note.category) && note.category !== '全部' &&
    LEVELS.includes(note.level) && typeof note.summary === 'string' && note.summary.trim() &&
    Array.isArray(note.content) && note.content.length > 0 && note.content.every(s => typeof s === 'string' && s.trim()) &&
    note.example && typeof note.example.language === 'string' && typeof note.example.code === 'string' &&
    Array.isArray(note.tags) && note.tags.length > 0 && note.tags.every(t => typeof t === 'string' && t.trim()) &&
    /^\d{4}-\d{2}-\d{2}$/.test(note.updatedAt) && !Number.isNaN(Date.parse(note.updatedAt));
}
function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function badgeClass(category) {
  return category === 'Python' ? 'python' : category === '統計學' ? 'stats' : category === '資料分析' ? 'analytics' : '';
}
function updateCounts() {
  $('#stat-total').textContent = String(state.notes.length);
  $('#stat-categories').textContent = String(new Set(state.notes.map(n => n.category)).size);
  const ids = { '全部': 'count-all', 'SQL': 'count-sql', 'Python': 'count-python', '統計學': 'count-stats', '資料分析': 'count-analytics' };
  CATEGORIES.forEach(c => { document.getElementById(ids[c]).textContent = String(c === '全部' ? state.notes.length : state.notes.filter(n => n.category === c).length); });
}
function visibleNotes() {
  const q = state.query.trim().toLocaleLowerCase();
  const notes = state.notes.filter(note => (state.category === '全部' || note.category === state.category) &&
    [note.title, note.summary, note.category, ...note.tags, ...note.content].join(' ').toLocaleLowerCase().includes(q));
  return notes.sort((a, b) => state.sort === 'title' ? a.title.localeCompare(b.title, 'zh-Hant') :
    state.sort === 'category' ? a.category.localeCompare(b.category, 'zh-Hant') || a.title.localeCompare(b.title, 'zh-Hant') :
    b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title, 'zh-Hant'));
}
function renderCard(note) {
  const card = make('article', 'note-card');
  const top = make('div', 'card-top');
  top.append(make('span', `category-badge ${badgeClass(note.category)}`, note.category), make('span', 'level', note.level));
  card.append(top, make('h3', '', note.title), make('p', '', note.summary));
  const bottom = make('div', 'card-bottom');
  const tags = make('div', 'card-tags');
  note.tags.slice(0, 2).forEach(t => tags.append(make('span', 'tag', `# ${t}`)));
  const button = make('button', 'read-button', '閱讀筆記 ↗');
  button.type = 'button';
  button.setAttribute('aria-label', `閱讀 ${note.title}`);
  button.addEventListener('click', () => { location.hash = `#/note/${note.id}`; });
  bottom.append(tags, button); card.append(bottom);
  return card;
}
function renderList() {
  state.selectedId = null;
  detail.classList.add('hidden');
  grid.classList.remove('hidden');
  grid.replaceChildren();
  const notes = visibleNotes();
  $('#result-count').textContent = `${notes.length} 篇`;
  if (!notes.length) grid.append(make('p', 'feedback', '找不到符合條件的筆記，請嘗試其他關鍵字或分類。'));
  else notes.forEach(note => grid.append(renderCard(note)));
  grid.setAttribute('aria-busy', 'false');
}
function showDetail(id) {
  const note = state.notes.find(n => n.id === id);
  if (!note) return;
  state.selectedId = id;
  grid.classList.add('hidden'); detail.classList.remove('hidden'); detail.replaceChildren();
  const back = make('button', 'back-button', '← 返回筆記列表');
  back.type = 'button';
  back.addEventListener('click', () => { location.hash = state.category === '全部' ? '#/' : `#/category/${encodeURIComponent(state.category)}`; $('#notes-heading').focus(); });
  const meta = make('div', 'detail-meta');
  meta.append(make('span', `category-badge ${badgeClass(note.category)}`, note.category), make('span', 'level', note.level), make('span', 'detail-date', `更新於 ${note.updatedAt}`));
  const content = make('div', 'detail-content');
  note.content.forEach(p => content.append(make('p', '', p)));
  const exampleHeading = make('h3', '', `實作範例 · ${note.example.language}`);
  const codeWrap = make('div', 'code-wrap');
  const pre = make('pre'); const code = make('code', '', note.example.code); pre.append(code);
  const copy = make('button', 'copy-button', '複製程式碼'); copy.type = 'button';
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(note.example.code); copy.textContent = '已複製 ✓'; }
    catch { copy.textContent = '無法複製，請手動選取'; }
  });
  codeWrap.append(pre, copy);
  detail.append(back, meta, make('h2', '', note.title), make('p', 'detail-summary', note.summary), content, exampleHeading, codeWrap);
  detail.focus({ preventScroll: true });
  $('#notes').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function setCategory(category, updateHash = false) {
  if (!CATEGORIES.includes(category)) return;
  state.category = category;
  document.querySelectorAll('[data-category]').forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('active', active);
    if (button.classList.contains('nav-link')) button.setAttribute('aria-current', active ? 'page' : 'false');
    if (button.classList.contains('chip')) button.setAttribute('aria-pressed', String(active));
  });
  renderList();
  if (updateHash) location.hash = category === '全部' ? '#/' : `#/category/${encodeURIComponent(category)}`;
}
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => setCategory(button.dataset.category, true))); 
$('#search-input').addEventListener('input', e => { state.query = e.target.value; renderList(); });
$('#sort-select').addEventListener('change', e => { state.sort = e.target.value; renderList(); });
$('#notes-heading').setAttribute('tabindex', '-1');
setCategory('全部');
function applyRoute() {
  const hash = decodeURIComponent(location.hash || '#/');
  if (hash.startsWith('#/note/')) {
    const id = hash.slice('#/note/'.length);
    if (state.notes.some(n => n.id === id)) showDetail(id);
    else { setCategory('全部'); grid.replaceChildren(make('p', 'feedback', '找不到這篇筆記，請返回首頁選擇其他內容。')); }
  } else if (hash.startsWith('#/category/')) {
    const category = hash.slice('#/category/'.length);
    if (CATEGORIES.includes(category)) setCategory(category);
    else setCategory('全部');
  } else if (hash === '#/' || hash === '' || hash === '#notes') {
    setCategory('全部');
  } else {
    setCategory('全部');
  }
}
window.addEventListener('hashchange', applyRoute);
async function init() {
  try {
    const response = await fetch('./data/notes.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('資料格式應為陣列');
    const ids = new Set();
    const invalid = data.find(note => !isValidNote(note) || ids.has(note.id) || (ids.add(note.id), false));
    if (invalid) throw new Error('筆記資料欄位錯誤或 ID 重複');
    state.notes = data;
    updateCounts(); applyRoute();
  } catch (error) {
    console.error('載入筆記失敗：', error);
    grid.replaceChildren(make('p', 'feedback', '無法載入筆記資料。請確認透過 HTTP 網站開啟，且 data/notes.json 存在並符合格式。'));
    grid.setAttribute('aria-busy', 'false');
  }
}
init();

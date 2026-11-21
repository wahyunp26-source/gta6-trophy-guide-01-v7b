// Leonida 100% — the tracker: loads the trophies and sources, renders the
// checklist with filters and a spoiler setting, saves progress in the
// browser, and opens a trophy's cited guide on demand.
import { showDetail } from './detail.js';
import { renderRoadmap, renderMissables, renderSources } from './tabs.js';

const KEY = 'leonida-100-progress';
const rows = document.getElementById('rows');
const progress = document.getElementById('progress');
const search = document.getElementById('search');
const kind = document.getElementById('kind');
const grade = document.getElementById('grade');
const spoiler = document.getElementById('spoiler');
const detail = document.getElementById('detail');

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let trophies = [];
let sources = [];
let sourceByNum = new Map();

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;
const srcDoc = await (await fetch('data/sources.json')).json();
sources = srcDoc.sources;
for (const s of sources) sourceByNum.set(s.n, s);

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function isHidden(t) {
  return t.hidden && !earned.has(t.id) && spoiler.checked;
}

function flagBadges(t) {
  const out = [];
  if ((t.flags ?? []).includes('missable')) out.push('<span class="flag missable">MISSABLE</span>');
  if ((t.flags ?? []).includes('at-risk')) out.push('<span class="flag atrisk">AT RISK</span>');
  if ((t.flags ?? []).includes('unconfirmed')) out.push('<span class="flag unconfirmed">UNCONFIRMED</span>');
  if ((t.disputes ?? []).length > 0) out.push('<span class="flag dispute">SOURCES DIFFER</span>');
  return out.join('');
}

function render() {
  const q = search.value.trim().toLowerCase();
  rows.replaceChildren();
  for (const t of trophies) {
    if (kind.value !== 'all' && t.kind !== kind.value) continue;
    if (grade.value !== 'all' && t.grade !== grade.value) continue;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) continue;
    const tr = document.createElement('tr');
    if (earned.has(t.id)) tr.classList.add('earned');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Earned ${t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      save();
      render();
    });
    const hidden = isHidden(t);
    const nameCell = document.createElement('td');
    nameCell.innerHTML = hidden
      ? '<strong>Hidden trophy</strong><br><span>Story trophy — hidden until earned.</span>'
      : `<strong>${t.name}</strong><br><span>${t.description}</span>${flagBadges(t)}`;
    const gradeCell = document.createElement('td');
    gradeCell.innerHTML = `<span class="badge ${t.grade}">${t.grade}</span>`;
    const kindCell = document.createElement('td');
    kindCell.textContent = t.kind;
    const guideCell = document.createElement('td');
    guideCell.textContent = hidden ? 'Earn it to reveal the guide.' : t.guide;
    const boxCell = document.createElement('td');
    boxCell.append(box);
    tr.append(boxCell, nameCell, gradeCell, kindCell, guideCell);
    tr.addEventListener('click', (event) => {
      if (event.target === box) return;
      showDetail(t, sourceByNum, detail);
    });
    rows.append(tr);
  }
  progress.textContent = `${earned.size} of ${trophies.length} earned`;
}

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify([...earned])], { type: 'application/json' }));
  a.download = 'leonida-100-progress.json';
  a.click();
});
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const ids = JSON.parse(await file.text());
  earned = new Set(ids.filter((id) => trophies.some((t) => t.id === id)));
  save();
  render();
});
search.addEventListener('input', render);
kind.addEventListener('change', render);
grade.addEventListener('change', render);
spoiler.addEventListener('change', render);

document.getElementById('tabs').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-tab]');
  if (!button) return;
  for (const b of document.querySelectorAll('#tabs button')) b.classList.toggle('on', b === button);
  const tab = button.dataset.tab;
  for (const name of ['tracker', 'roadmap', 'missables', 'sources']) {
    document.getElementById(`view-${name}`).hidden = name !== tab;
  }
  document.getElementById('controls').style.display = tab === 'tracker' ? '' : 'none';
  detail.hidden = true;
  if (tab === 'roadmap') renderRoadmap(trophies, document.getElementById('view-roadmap'));
  if (tab === 'missables') renderMissables(trophies, document.getElementById('view-missables'));
  if (tab === 'sources') renderSources(sources, trophies, document.getElementById('view-sources'));
});

// Deep-link a tab from the URL hash (e.g. #roadmap), so a screenshot or a
// shared link can open the guide on a specific view.
const hashTab = location.hash.replace('#', '');
if (['tracker', 'roadmap', 'missables', 'sources'].includes(hashTab)) {
  document.querySelector(`#tabs button[data-tab="${hashTab}"]`)?.click();
} else if (hashTab.startsWith('trophy-')) {
  const t = trophies.find((x) => x.id === Number(hashTab.slice(7)));
  if (t) showDetail(t, sourceByNum, detail);
}

render();

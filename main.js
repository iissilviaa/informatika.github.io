const $ = id => document.getElementById(id);
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem('pc_' + k)) ?? d; } catch { return d; } },
  set(k, v){ try { localStorage.setItem('pc_' + k, JSON.stringify(v)); } catch {} }
};
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = store.get('state', {xp:0, badges:[], done:[]});
const save = () => store.set('state', state);
const level = () => Math.floor(state.xp / 100) + 1;

/* ===== Toast, XP, badge ===== */
let toastT;
function toast(msg){
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
}
function renderXP(){
  $('lvl').textContent = 'Lv ' + level();
  $('xpFill').style.width = (state.xp % 100) + '%';
  $('xpTxt').textContent = state.xp + ' XP';
}
function addXP(n){
  const before = level();
  state.xp += n; save(); renderXP();
  toast('+' + n + ' XP');
  if (before !== level()){ setTimeout(() => toast('Naik ke Level ' + level() + '! 🎉'), 900); confetti(); }
  giveBadge('mulai');
  if (level() >= 5) giveBadge('lv5');
}
function renderBadges(newId){
  $('badges').innerHTML = '';
  BADGES.forEach(b => {
    const d = document.createElement('div');
    d.className = 'bd' + (state.badges.includes(b.id) ? ' got' : '') + (b.id === newId ? ' new' : '');
    d.innerHTML = `<span class="e">${b.emoji}</span><b>${b.nama}</b><br><small>${b.desk}</small>`;
    $('badges').appendChild(d);
  });
}
function giveBadge(id){
  if (state.badges.includes(id)) return;
  state.badges.push(id); save(); renderBadges(id);
  setTimeout(() => toast('Badge baru: ' + BADGES.find(b => b.id === id).nama + ' 🏅'), 400);
  confetti();
}

/* ===== Confetti ===== */
function confetti(){
  if (reduce) return;
  const c = $('fx'), g = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const cols = ['#ff4f93','#8b6cf0','#ffc857','#19b37d','#ffc2d9'];
  const ps = Array.from({length:120}, () => ({
    x:innerWidth / 2, y:innerHeight * .6, vx:(Math.random() - .5) * 16, vy:-Math.random() * 16 - 4,
    s:5 + Math.random() * 6, r:Math.random() * 6, c:cols[Math.random() * 5 | 0]
  }));
  let f = 0;
  (function tick(){
    g.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => {
      p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .2;
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); g.restore();
    });
    if (++f < 110) requestAnimationFrame(tick); else g.clearRect(0, 0, c.width, c.height);
  })();
}

/* ===== Tema ===== */
const root = document.documentElement;
function setTheme(t){ root.dataset.theme = t; $('theme').textContent = t === 'dark' ? '☀️' : '🌙'; store.set('theme', t); }
setTheme(store.get('theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
$('theme').onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');

/* ===== Kartu materi ===== */
function matProgress(){
  $('matBar').style.width = state.done.length / MATERI.length * 100 + '%';
  $('matTxt').textContent = `${state.done.length}/${MATERI.length} dipahami`;
}
MATERI.forEach((m, k) => {
  const c = document.createElement('article');
  c.className = 'card reveal' + (state.done.includes(k) ? ' ok' : '');
  c.innerHTML = `<button class="head" aria-expanded="false"><span class="emoji">${m.emoji}</span><h3>${m.judul}</h3></button>
    <div class="more"><div><p>${m.isi}</p><pre></pre><button class="btn mini"></button></div></div>`;
  c.querySelector('pre').textContent = m.kode;
  const head = c.querySelector('.head'), ok = c.querySelector('.mini');
  const paintOk = () => { const d = state.done.includes(k); ok.textContent = d ? 'Sudah paham ✓' : 'Saya paham +10 XP'; ok.classList.toggle('done', d); c.classList.toggle('ok', d); };
  head.onclick = () => { const o = c.classList.toggle('open'); head.setAttribute('aria-expanded', o); };
  ok.onclick = () => {
    if (state.done.includes(k)) return;
    state.done.push(k); save(); paintOk(); matProgress(); addXP(10);
    if (state.done.length === MATERI.length) giveBadge('baca');
  };
  paintOk(); $('cards').appendChild(c);
});
matProgress();

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ===== Animasi mengetik di hero (Python, JS, HTML) ===== */
(function typing(){
  const el = $('typed'), out = $('typedOut'); let n = 0, i = 0;
  const run = () => {
    const h = HERO[n % HERO.length]; $('lang').textContent = h.bahasa;
    el.textContent = h.kode.slice(0, ++i);
    if (i < h.kode.length) return setTimeout(run, 60);
    out.textContent = h.out;
    setTimeout(() => { i = 0; n++; out.textContent = ''; run(); }, 3000);
  };
  run();
})();

/* ===== Tab game ===== */
const tabs = document.querySelectorAll('[data-tab]');
tabs.forEach(t => t.onclick = () => {
  tabs.forEach(x => x.classList.toggle('active', x === t));
  tabs.forEach(x => $('panel-' + x.dataset.tab).hidden = x !== t);
});

/* ===== Lab kode ===== */
let labI = 0, labRan = false;
const labRun = () => {
  $('labOut').srcdoc = $('labCode').value;
  if (!labRan){ labRan = true; if (!state.badges.includes('lab')){ addXP(15); giveBadge('lab'); } }
};
function labLoad(k){
  labI = k;
  $('labCode').value = LAB[k].kode; $('labGoal').textContent = LAB[k].tujuan;
  [...$('chal').children].forEach((b, j) => b.classList.toggle('active', j === k));
  $('labOut').srcdoc = LAB[k].kode;
}
LAB.forEach((l, k) => {
  const b = document.createElement('button'); b.className = 'tab'; b.textContent = l.nama;
  b.onclick = () => labLoad(k); $('chal').appendChild(b);
});
$('labRun').onclick = labRun;
$('labCode').addEventListener('keydown', e => {
  if (e.key === 'Tab'){ e.preventDefault(); const t = e.target, s = t.selectionStart; t.setRangeText('  ', s, t.selectionEnd, 'end'); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') labRun();
});
labLoad(0);

/* ===== Badge & reset ===== */
$('resetAll').onclick = () => { if (confirm('Hapus semua XP dan badge?')){ store.set('state', {xp:0, badges:[], done:[]}); location.reload(); } };
renderXP(); renderBadges();

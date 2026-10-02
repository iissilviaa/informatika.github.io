const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
// elemen yang bisa diklik dan juga bisa dioperasikan dengan keyboard
function mk(tag, cls, text, fn){
  const e = document.createElement(tag); e.className = cls; e.textContent = text;
  e.tabIndex = 0; e.setAttribute('role', 'button'); e.onclick = fn;
  e.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); fn(); } };
  return e;
}

/* ===== Game 1: Tebak Output Python (timer 20 detik + streak) ===== */
const py = {q:[], i:0, score:0, lives:3, streak:0, wrong:0, locked:false, over:false, t:null, left:0, opts:[]};

function pyHud(){
  $('pyScore').textContent = py.score; $('pyStreak').textContent = py.streak;
  $('pyLives').textContent = '❤️'.repeat(py.lives) || '💔';
}
function pyStart(){
  clearInterval(py.t);
  Object.assign(py, {q:shuffle(SOAL_PYTHON), i:0, score:0, lives:3, streak:0, wrong:0, over:false});
  $('pyTotal').textContent = py.q.length; pyHud(); pyRender();
}
function pyRender(){
  const s = py.q[py.i]; py.locked = false;
  py.opts = shuffle(s.opsi.map((t, k) => ({t, ok:k === s.benar})));
  $('pyCode').textContent = s.kode; $('pyNo').textContent = py.i + 1;
  $('pyBar').style.width = py.i / py.q.length * 100 + '%';
  $('pyFb').textContent = ''; $('pyFb').className = 'feedback';
  $('pyNext').hidden = true; $('pyOpts').innerHTML = '';
  py.opts.forEach((o, k) => {
    const b = document.createElement('button'); b.className = 'opt'; b.textContent = o.t;
    b.onclick = () => pyAnswer(k); $('pyOpts').appendChild(b);
  });
  py.left = 20; $('pyTime').style.width = '100%'; clearInterval(py.t);
  py.t = setInterval(() => {
    py.left -= .1; $('pyTime').style.width = py.left / 20 * 100 + '%';
    if (py.left <= 0) pyAnswer(-1);
  }, 100);
}
function pyAnswer(k){
  if (py.locked) return;
  py.locked = true; clearInterval(py.t);
  const all = [...$('pyOpts').children], s = py.q[py.i], fb = $('pyFb');
  all.forEach(b => b.disabled = true);
  if (k >= 0 && py.opts[k].ok){
    const bonus = py.streak >= 2 ? 5 : 0;
    py.score += 10 + bonus; py.streak++; all[k].classList.add('right');
    fb.className = 'feedback ok'; fb.textContent = `Benar! ${bonus ? '+5 bonus streak 🔥 ' : ''}${s.info}`;
    addXP(10);
  } else {
    py.lives--; py.streak = 0; py.wrong++;
    if (k >= 0) all[k].classList.add('wrong');
    all[py.opts.findIndex(o => o.ok)].classList.add('right');
    fb.className = 'feedback no'; fb.textContent = (k < 0 ? 'Waktu habis. ' : 'Belum tepat. ') + s.info;
  }
  pyHud();
  const last = py.lives <= 0 || py.i === py.q.length - 1;
  $('pyNext').textContent = last ? 'Lihat hasil' : 'Lanjut'; $('pyNext').hidden = false;
}
function pyEnd(){
  const win = py.lives > 0;
  $('pyBar').style.width = '100%'; $('pyTime').style.width = '0';
  $('pyCode').textContent = win ? 'selesai = True' : 'nyawa = 0';
  $('pyOpts').innerHTML = '';
  $('pyFb').className = 'feedback ' + (win ? 'ok' : 'no');
  $('pyFb').textContent = `${win ? 'Kamu berhasil!' : 'Nyawa habis.'} Skor akhir: ${py.score}.`;
  $('pyNext').textContent = 'Main lagi'; py.over = true;
  if (win && py.wrong === 0) giveBadge('python');
}
$('pyNext').onclick = () => {
  if (py.over) return pyStart();
  if (py.lives <= 0 || py.i >= py.q.length - 1) return pyEnd();
  py.i++; pyRender();
};
pyStart();

/* ===== Game 2: Biner Cepat ===== */
const bn = {round:1, score:0, target:0, bits:Array(8).fill(0), done:false};
const NILAI = [128, 64, 32, 16, 8, 4, 2, 1];
const bnSum = () => bn.bits.reduce((a, v, k) => a + v * NILAI[k], 0);

function bnNew(){
  bn.target = 1 + Math.floor(Math.random() * 255); bn.bits = Array(8).fill(0);
  $('bnTarget').textContent = bn.target; $('bnRound').textContent = bn.round;
  $('bnFb').textContent = ''; $('bnFb').className = 'feedback';
  $('bnCheck').textContent = 'Cek jawaban'; bnDraw();
}
function bnDraw(){
  $('bnBits').innerHTML = '';
  bn.bits.forEach((v, k) => {
    const b = document.createElement('button');
    b.className = 'bit' + (v ? ' on' : ''); b.innerHTML = `${v}<small>${NILAI[k]}</small>`;
    b.setAttribute('aria-label', `Bit bernilai ${NILAI[k]}, saat ini ${v}`);
    b.onclick = () => { if (bn.done) return; bn.bits[k] ^= 1; bnDraw(); };
    $('bnBits').appendChild(b);
  });
  $('bnSum').textContent = bnSum();
}
$('bnCheck').onclick = () => {
  if (bn.done){ Object.assign(bn, {round:1, score:0, done:false}); $('bnScore').textContent = 0; return bnNew(); }
  if (bnSum() === bn.target){
    bn.score += 20; $('bnFb').className = 'feedback ok'; $('bnFb').textContent = 'Tepat! +20 poin'; addXP(15);
  } else {
    $('bnFb').className = 'feedback no';
    $('bnFb').textContent = `Belum tepat. Jawabannya ${bn.target.toString(2).padStart(8, '0')}.`;
  }
  $('bnScore').textContent = bn.score;
  if (bn.round >= 5){
    bn.done = true; $('bnCheck').textContent = 'Main lagi';
    $('bnFb').textContent += ` Selesai, skor ${bn.score}/100.`;
    if (bn.score === 100) giveBadge('biner');
  } else { bn.round++; setTimeout(bnNew, 1400); }
};
bnNew();

/* ===== Game 3: Susun Kode ===== */
const su = {i:0, board:[], pool:[], ok:false};
function suRender(){
  const p = SUSUN[su.i]; su.ok = false;
  su.pool = shuffle(p.baris.map((t, k) => ({t, k}))); su.board = [];
  $('suNo').textContent = su.i + 1; $('suTotal').textContent = SUSUN.length; $('suTitle').textContent = p.judul;
  $('suFb').textContent = ''; $('suFb').className = 'feedback'; $('suCheck').textContent = 'Cek susunan';
  suDraw();
}
function suDraw(){
  $('suBoard').innerHTML = ''; $('suPool').innerHTML = '';
  su.board.forEach((it, x) => $('suBoard').appendChild(mk('span', '', it.t, () => {
    if (su.ok) return; su.pool.push(...su.board.splice(x, 1)); suDraw();
  })));
  su.pool.forEach((it, x) => $('suPool').appendChild(mk('button', 'chip', it.t, () => {
    if (su.ok) return; su.board.push(...su.pool.splice(x, 1)); suDraw();
  })));
}
$('suCheck').onclick = () => {
  const fb = $('suFb'), n = SUSUN[su.i].baris.length;
  if (su.ok){
    if (su.i >= SUSUN.length - 1){ su.i = 0; } else su.i++;
    return suRender();
  }
  const bad = su.board.findIndex((it, x) => it.k !== x);
  if (su.board.length === n && bad < 0){
    su.ok = true; fb.className = 'feedback ok'; fb.textContent = 'Urutan tepat! +20 XP'; addXP(20);
    const last = su.i >= SUSUN.length - 1;
    $('suCheck').textContent = last ? 'Main lagi' : 'Puzzle berikutnya';
    if (last) giveBadge('susun');
  } else {
    fb.className = 'feedback no';
    fb.textContent = su.board.length < n ? 'Masih ada baris yang belum dipasang.' : `Baris ke-${bad + 1} belum tepat. Coba tukar posisinya.`;
  }
};
suRender();

/* ===== Game 4: Memori Kode ===== */
const me = {open:[], moves:0, pairs:0, lock:false};
function meStart(){
  Object.assign(me, {open:[], moves:0, pairs:0, lock:false});
  $('meMoves').textContent = 0; $('mePairs').textContent = 0; $('meFb').textContent = '';
  $('meGrid').innerHTML = '';
  shuffle(MEMORI.flatMap(([a, b], k) => [{k, t:a}, {k, t:b}])).forEach(c => {
    const b = document.createElement('button'); b.className = 'mc';
    b.innerHTML = '<div><span class="f">?</span><span class="b"></span></div>';
    b.querySelector('.b').textContent = c.t;
    b.setAttribute('aria-label', 'Kartu memori');
    b.onclick = () => {
      if (me.lock || b.classList.contains('flip') || b.classList.contains('match')) return;
      b.classList.add('flip'); me.open.push({b, k:c.k});
      if (me.open.length < 2) return;
      me.moves++; $('meMoves').textContent = me.moves;
      const [x, y] = me.open; me.open = [];
      if (x.k === y.k){
        [x.b, y.b].forEach(e => { e.classList.remove('flip'); e.classList.add('match'); });
        $('mePairs').textContent = ++me.pairs; addXP(5);
        if (me.pairs === MEMORI.length){
          $('meFb').className = 'feedback ok'; $('meFb').textContent = `Semua cocok dalam ${me.moves} langkah! +30 XP`;
          addXP(30); giveBadge('memori');
        }
      } else {
        me.lock = true;
        setTimeout(() => { x.b.classList.remove('flip'); y.b.classList.remove('flip'); me.lock = false; }, 900);
      }
    };
    $('meGrid').appendChild(b);
  });
}
$('meReset').onclick = meStart;
meStart();

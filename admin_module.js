/* ═══════════════════════════════════════════════════════════
   ADMIN PANEL — gate, tabs, CRUD, duplicate question detector
═══════════════════════════════════════════════════════════ */

/* ── PIN gate ─────────────────────────────────────────── */
function submitAdminPin() {
  const entered = document.getElementById('adminPinInput').value.trim();
  const pin = (function(){ try { return localStorage.getItem(ER_PIN_KEY) || '2026'; } catch(e){ return '2026'; } })();
  if (entered === pin) {
    document.getElementById('gateScreen').style.display = 'none';
    document.getElementById('adminShell').style.display = 'block';
    renderAdminTabs();
    switchAdminTab('banners');
  } else {
    document.getElementById('adminPinErr').style.display = 'block';
  }
}
window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('adminPinInput');
  if (input) setTimeout(()=>input.focus(), 200);
});
function openAdminPinChange() {
  showAdminForm('Change Admin PIN', `
    <div class="adm-fgroup">
      <label class="adm-flabel">New PIN (4–6 digits)</label>
      <input type="password" inputmode="numeric" maxlength="6" class="std-input adm-pin-input" id="af-newpin" placeholder="••••">
    </div>`, () => {
    const v = document.getElementById('af-newpin').value.trim();
    if (!/^\d{4,6}$/.test(v)) { showToast('PIN must be 4–6 digits'); return; }
    localStorage.setItem(ER_PIN_KEY, v);
    closeModal('adminItemModal');
    showToast('Admin PIN updated');
  });
}
function adminResetDefaults() {
  if (!confirm('Reset ALL content (banners, subjects, questions, books, courses, institutions, FAQs) back to the original defaults? This cannot be undone.')) return;
  try { localStorage.removeItem(ER_STORE_KEY); } catch(e) {}
  loadAdminStore();
  saveAdminStore();
  showToast('Content reset to defaults');
  switchAdminTab(adminActiveTab || 'banners');
}

/* ── Generic item-editor modal ───────────────────────────── */
function showAdminForm(title, bodyHtml, saveFn) {
  document.getElementById('adminItemModalTitle').textContent = title;
  document.getElementById('adminItemModalBody').innerHTML = bodyHtml;
  const btn = document.getElementById('adminItemModalSaveBtn');
  btn.onclick = saveFn;
  openModal('adminItemModal');
}
function esc(s) { return String(s == null ? '' : s).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

/* ── Tabs ─────────────────────────────────────────────────── */
const ADMIN_TABS = [
  {id:'banners', label:'Banners', icon:'view_carousel'},
  {id:'subjects', label:'Subjects', icon:'science'},
  {id:'questions', label:'Questions', icon:'quiz'},
  {id:'books', label:'Books', icon:'menu_book'},
  {id:'courses', label:'Courses', icon:'school'},
  {id:'institutions', label:'Institutions', icon:'account_balance'},
  {id:'faqs', label:'FAQs', icon:'help'},
];
let adminActiveTab = 'banners';
function renderAdminTabs() {
  document.getElementById('adminTabs').innerHTML = ADMIN_TABS.map(t =>
    `<div class="adm-tab ${t.id===adminActiveTab?'active':''}" onclick="switchAdminTab('${t.id}')">${t.label}</div>`
  ).join('');
}
function switchAdminTab(id) {
  adminActiveTab = id;
  renderAdminTabs();
  const renderers = {
    banners: renderAdminBanners, subjects: renderAdminSubjects, questions: renderAdminQuestions,
    books: renderAdminBooks, courses: renderAdminCourses, institutions: renderAdminInstitutions, faqs: renderAdminFaqs
  };
  renderers[id]();
}

/* ═══════════════════════════════════════
   BANNERS
═══════════════════════════════════════ */
const BANNER_PRESET_GRADIENTS = [
  'linear-gradient(135deg,#1a1a2e,#16213e)','linear-gradient(135deg,#0f3443,#34e89e)',
  'linear-gradient(135deg,#4b134f,#c94b4b)','linear-gradient(135deg,#f7971e,#ffd200)',
  'linear-gradient(135deg,#1d2671,#c33764)','linear-gradient(135deg,#134e5e,#71b280)',
  'linear-gradient(135deg,#2d1b69,#44182b)','linear-gradient(135deg,#0c1445,#1a1a4d)',
];
function renderAdminBanners() {
  const html = `
    <div class="adm-toolbar">
      <span class="adm-count">${BANNERS.length} banner${BANNERS.length===1?'':'s'}</span>
      <button class="adm-add-btn" onclick="adminEditBanner(-1)"><span class="mi material-icons-round">add</span>Add Banner</button>
    </div>
    <div class="card">
      ${BANNERS.length ? BANNERS.map((b,i)=>`
        <div class="adm-row">
          <div class="adm-row-ico" style="background:${b.bg}">${b.emoji}</div>
          <div class="adm-row-info"><div class="adm-row-nm">${esc(b.lbl)}</div><div class="adm-row-sub">Banner ${i+1}</div></div>
          <div class="adm-row-acts">
            <button class="adm-mini-btn" onclick="adminEditBanner(${i})"><span class="mi material-icons-round">edit</span></button>
            <button class="adm-mini-btn danger" onclick="adminDeleteBanner(${i})"><span class="mi material-icons-round">delete</span></button>
          </div>
        </div>`).join('') : `<div class="adm-empty">No banners yet. Add one to feature it on Home.</div>`}
    </div>`;
  document.getElementById('adminTabContent').innerHTML = html;
}
function adminEditBanner(i) {
  const b = i >= 0 ? BANNERS[i] : {bg:BANNER_PRESET_GRADIENTS[0],emoji:'📢',lbl:''};
  showAdminForm(i >= 0 ? 'Edit Banner' : 'Add Banner', `
    <div class="adm-fgroup"><label class="adm-flabel">Label / Message</label>
      <input class="std-input" id="af-lbl" value="${esc(b.lbl)}" placeholder="e.g. 📢 New model test live now"></div>
    <div class="adm-frow">
      <div class="adm-fgroup"><label class="adm-flabel">Emoji</label>
        <input class="std-input" id="af-emoji" maxlength="4" value="${esc(b.emoji)}" placeholder="🎯"></div>
      <div class="adm-fgroup"><label class="adm-flabel">Color Style</label>
        <select class="std-select" id="af-bg">
          ${BANNER_PRESET_GRADIENTS.map((g,gi)=>`<option value="${g}" ${b.bg===g?'selected':''}>Preset ${gi+1}</option>`).join('')}
          <option value="__custom" ${!BANNER_PRESET_GRADIENTS.includes(b.bg)?'selected':''}>Custom CSS…</option>
        </select></div>
    </div>
    <div class="adm-fgroup" id="af-bgcustom-wrap" style="${BANNER_PRESET_GRADIENTS.includes(b.bg)?'display:none':''}">
      <label class="adm-flabel">Custom background (CSS)</label>
      <input class="std-input" id="af-bgcustom" value="${!BANNER_PRESET_GRADIENTS.includes(b.bg)?esc(b.bg):''}" placeholder="linear-gradient(135deg,#000,#333)"></div>
  `, () => {
    const lbl = document.getElementById('af-lbl').value.trim();
    if (!lbl) { showToast('Label is required'); return; }
    const bgSel = document.getElementById('af-bg').value;
    const bg = bgSel === '__custom' ? (document.getElementById('af-bgcustom').value.trim() || BANNER_PRESET_GRADIENTS[0]) : bgSel;
    const item = { lbl, emoji: document.getElementById('af-emoji').value.trim() || '📢', bg };
    if (i >= 0) BANNERS[i] = item; else BANNERS.push(item);
    saveAdminStore();
    closeModal('adminItemModal');
    renderAdminBanners();
    showToast(i >= 0 ? 'Banner updated' : 'Banner added');
  });
  const bgSelectEl = document.getElementById('af-bg');
  if (bgSelectEl) bgSelectEl.addEventListener('change', function(){
    document.getElementById('af-bgcustom-wrap').style.display = this.value === '__custom' ? 'block' : 'none';
  });
}
function adminDeleteBanner(i) {
  if (!confirm('Delete this banner?')) return;
  BANNERS.splice(i,1);
  saveAdminStore();
  renderAdminBanners();
  showToast('Banner deleted');
}

/* ═══════════════════════════════════════
   SUBJECTS
═══════════════════════════════════════ */
function renderAdminSubjects() {
  const html = `
    <div class="adm-toolbar">
      <span class="adm-count">${SUBJECTS.length} subject${SUBJECTS.length===1?'':'s'}</span>
      <button class="adm-add-btn" onclick="adminEditSubject(-1)"><span class="mi material-icons-round">add</span>Add Subject</button>
    </div>
    <div class="card">
      ${SUBJECTS.map((s,i)=>`
        <div class="adm-row">
          <div class="adm-row-ico" style="background:${s.color}">${s.emoji}</div>
          <div class="adm-row-info"><div class="adm-row-nm">${esc(s.name)}</div><div class="adm-row-sub">${s.chapters.length} chapters · ${s.mcqBank} MCQs · ${s.pct}% done</div></div>
          <div class="adm-row-acts">
            <button class="adm-mini-btn" onclick="adminManageChapters(${i})" title="Chapters"><span class="mi material-icons-round">list</span></button>
            <button class="adm-mini-btn" onclick="adminEditSubject(${i})"><span class="mi material-icons-round">edit</span></button>
            <button class="adm-mini-btn danger" onclick="adminDeleteSubject(${i})"><span class="mi material-icons-round">delete</span></button>
          </div>
        </div>`).join('')}
    </div>`;
  document.getElementById('adminTabContent').innerHTML = html;
}
function adminEditSubject(i) {
  const s = i >= 0 ? SUBJECTS[i] : {name:'',emoji:'📘',color:'#1a1a2e',pct:0,chapters:[]};
  showAdminForm(i >= 0 ? 'Edit Subject' : 'Add Subject', `
    <div class="adm-fgroup"><label class="adm-flabel">Subject Name</label>
      <input class="std-input" id="af-name" value="${esc(s.name)}" placeholder="e.g. Physics"></div>
    <div class="adm-frow">
      <div class="adm-fgroup"><label class="adm-flabel">Emoji</label>
        <input class="std-input" id="af-emoji" maxlength="4" value="${esc(s.emoji)}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">Card Color (hex)</label>
        <input class="std-input" id="af-color" value="${esc(s.color)}" placeholder="#1a1a2e"></div>
    </div>
    <div class="adm-fgroup"><label class="adm-flabel">Progress % (0–100)</label>
      <input class="std-input" type="number" min="0" max="100" id="af-pct" value="${s.pct}"></div>
    ${i < 0 ? `<div style="font-size:11.5px;color:var(--tm)">Chapters can be added afterward from the list icon.</div>` : ''}
  `, () => {
    const name = document.getElementById('af-name').value.trim();
    if (!name) { showToast('Subject name is required'); return; }
    if (i >= 0) {
      const oldName = s.name;
      s.name = name; s.emoji = document.getElementById('af-emoji').value.trim() || '📘';
      s.color = document.getElementById('af-color').value.trim() || '#1a1a2e';
      s.pct = Math.max(0, Math.min(100, +document.getElementById('af-pct').value || 0));
      if (oldName !== name && QBANK[oldName]) { QBANK[name] = QBANK[oldName]; delete QBANK[oldName]; }
    } else {
      const item = { name, emoji: document.getElementById('af-emoji').value.trim() || '📘',
        color: document.getElementById('af-color').value.trim() || '#1a1a2e',
        pct: Math.max(0, Math.min(100, +document.getElementById('af-pct').value || 0)), chapters: [] };
      SUBJECTS.push(item);
      QBANK[name] = QBANK[name] || {};
    }
    recomputeMcqBank();
    saveAdminStore();
    closeModal('adminItemModal');
    renderAdminSubjects();
    showToast(i >= 0 ? 'Subject updated' : 'Subject added');
  });
}
function adminDeleteSubject(i) {
  const s = SUBJECTS[i];
  if (!confirm(`Delete "${s.name}" and all its chapters + questions? This cannot be undone.`)) return;
  delete QBANK[s.name];
  SUBJECTS.splice(i,1);
  recomputeMcqBank();
  saveAdminStore();
  renderAdminSubjects();
  showToast('Subject deleted');
}
function adminManageChapters(si) {
  const s = SUBJECTS[si];
  const rows = s.chapters.map((ch,ci) => {
    const counts = QBANK[s.name] && QBANK[s.name][ch] ? QBANK[s.name][ch] : {mcq:[],cq:[],sq:[]};
    return `<div class="adm-row">
      <div class="adm-row-ico"><span class="mi material-icons-round" style="font-size:18px">bookmark</span></div>
      <div class="adm-row-info"><div class="adm-row-nm">${esc(ch)}</div><div class="adm-row-sub">${counts.mcq.length} MCQ · ${counts.cq.length} CQ · ${counts.sq.length} SQ</div></div>
      <div class="adm-row-acts">
        <button class="adm-mini-btn" onclick="adminRenameChapter(${si},${ci})"><span class="mi material-icons-round">edit</span></button>
        <button class="adm-mini-btn danger" onclick="adminDeleteChapter(${si},${ci})"><span class="mi material-icons-round">delete</span></button>
      </div>
    </div>`;
  }).join('') || `<div class="adm-empty">No chapters yet.</div>`;
  showAdminForm(`${s.name} — Chapters`, `
    <div class="card" style="margin-bottom:14px">${rows}</div>
    <div class="adm-fgroup"><label class="adm-flabel">New Chapter Name</label>
      <input class="std-input" id="af-newchapter" placeholder="e.g. Modern Physics"></div>
  `, () => {
    const name = document.getElementById('af-newchapter').value.trim();
    if (!name) { showToast('Enter a chapter name'); return; }
    if (s.chapters.includes(name)) { showToast('Chapter already exists'); return; }
    s.chapters.push(name);
    QBANK[s.name] = QBANK[s.name] || {};
    QBANK[s.name][name] = { mcq: [], cq: [], sq: [] };
    recomputeMcqBank();
    saveAdminStore();
    closeModal('adminItemModal');
    renderAdminSubjects();
    showToast('Chapter added');
  });
}
function adminRenameChapter(si, ci) {
  const s = SUBJECTS[si];
  const oldName = s.chapters[ci];
  showAdminForm('Rename Chapter', `
    <div class="adm-fgroup"><label class="adm-flabel">Chapter Name</label>
      <input class="std-input" id="af-chname" value="${esc(oldName)}"></div>
  `, () => {
    const newName = document.getElementById('af-chname').value.trim();
    if (!newName) { showToast('Name required'); return; }
    s.chapters[ci] = newName;
    if (QBANK[s.name] && QBANK[s.name][oldName] && newName !== oldName) {
      QBANK[s.name][newName] = QBANK[s.name][oldName];
      delete QBANK[s.name][oldName];
    }
    recomputeMcqBank();
    saveAdminStore();
    closeModal('adminItemModal');
    adminManageChapters(si);
    showToast('Chapter renamed');
  });
}
function adminDeleteChapter(si, ci) {
  const s = SUBJECTS[si];
  const name = s.chapters[ci];
  if (!confirm(`Delete chapter "${name}" and all its questions?`)) return;
  s.chapters.splice(ci,1);
  if (QBANK[s.name]) delete QBANK[s.name][name];
  recomputeMcqBank();
  saveAdminStore();
  adminManageChapters(si);
  showToast('Chapter deleted');
}

/* ═══════════════════════════════════════
   QUESTIONS  (with duplicate detector)
═══════════════════════════════════════ */
let qbSubject = null, qbChapter = null, qbType = 'mcq';
function renderAdminQuestions() {
  if (!qbSubject || !SUBJECTS.find(s=>s.name===qbSubject)) qbSubject = SUBJECTS[0] ? SUBJECTS[0].name : null;
  const subj = SUBJECTS.find(s=>s.name===qbSubject);
  if (subj && (!qbChapter || !subj.chapters.includes(qbChapter))) qbChapter = subj.chapters[0] || null;

  let html = `<div class="adm-chip-row">` +
    SUBJECTS.map(s=>`<div class="adm-chip ${s.name===qbSubject?'active':''}" onclick="qbSetSubject('${esc(s.name)}')">${s.emoji} ${esc(s.name)}</div>`).join('') +
    `</div>`;

  if (!subj) { html += `<div class="adm-empty">Add a subject first.</div>`; document.getElementById('adminTabContent').innerHTML = html; return; }

  html += `<div class="adm-chip-row">` +
    subj.chapters.map(ch=>`<div class="adm-chip ${ch===qbChapter?'active':''}" onclick="qbSetChapter('${esc(ch)}')">${esc(ch)}</div>`).join('') +
    `</div>`;

  if (!qbChapter) { html += `<div class="adm-empty">This subject has no chapters yet — add one in the Subjects tab.</div>`; document.getElementById('adminTabContent').innerHTML = html; return; }

  const types = [['mcq','MCQ'],['cq','CQ'],['sq','SQ']];
  html += `<div class="adm-tabs" style="padding-top:0">` +
    types.map(([id,lb])=>`<div class="adm-tab ${id===qbType?'active':''}" onclick="qbSetType('${id}')">${lb}</div>`).join('') +
    `</div>`;

  const list = (QBANK[qbSubject] && QBANK[qbSubject][qbChapter] && QBANK[qbSubject][qbChapter][qbType]) || [];
  html += `<div class="adm-toolbar">
      <span class="adm-count">${list.length} ${qbType.toUpperCase()} question${list.length===1?'':'s'}</span>
      <button class="adm-add-btn" onclick="adminEditQuestion(-1)"><span class="mi material-icons-round">add</span>Add Question</button>
    </div>`;
  html += `<div class="card">${list.length ? list.map((q,i)=>{
    const title = qbType==='mcq' ? q.q : qbType==='cq' ? q.stem : q.q;
    const sub = qbType==='mcq' ? `Answer: ${q.opts && q.opts[q.ans] ? q.opts[q.ans] : '—'}` : qbType==='cq' ? 'Creative Question (ক/খ/গ/ঘ)' : (q.ans || '');
    return `<div class="adm-row">
      <div class="adm-row-ico"><span class="mi material-icons-round" style="font-size:18px">${qbType==='mcq'?'checklist':qbType==='cq'?'edit_note':'short_text'}</span></div>
      <div class="adm-row-info"><div class="adm-row-nm">${esc(title)}</div><div class="adm-row-sub">${esc(sub)}</div></div>
      <div class="adm-row-acts">
        <button class="adm-mini-btn" onclick="adminEditQuestion(${i})"><span class="mi material-icons-round">edit</span></button>
        <button class="adm-mini-btn danger" onclick="adminDeleteQuestion(${i})"><span class="mi material-icons-round">delete</span></button>
      </div>
    </div>`;
  }).join('') : `<div class="adm-empty">No ${qbType.toUpperCase()} questions in this chapter yet.</div>`}</div>`;

  document.getElementById('adminTabContent').innerHTML = html;
}
function qbSetSubject(name) { qbSubject = name; qbChapter = null; renderAdminQuestions(); }
function qbSetChapter(name) { qbChapter = name; renderAdminQuestions(); }
function qbSetType(t) { qbType = t; renderAdminQuestions(); }

function ensureBucket() {
  QBANK[qbSubject] = QBANK[qbSubject] || {};
  QBANK[qbSubject][qbChapter] = QBANK[qbSubject][qbChapter] || {mcq:[],cq:[],sq:[]};
  return QBANK[qbSubject][qbChapter];
}
function questionKeyText(q, type) {
  if (type === 'mcq') return q.q + ' ' + (q.opts||[]).join(' ');
  if (type === 'cq') return [q.stem,q.ka,q.kha,q.ga,q.gha].join(' ');
  return q.q + ' ' + (q.ans||'');
}
// Simple word-overlap (Jaccard) similarity — good enough to flag likely duplicates
// without needing a server-side text-similarity service.
function textSimilarity(a, b) {
  const norm = s => (s||'').toLowerCase().replace(/[^\w\s\u0980-\u09FF]/g,' ').split(/\s+/).filter(w=>w.length>2);
  const wa = new Set(norm(a)), wb = new Set(norm(b));
  if (!wa.size || !wb.size) return 0;
  let inter = 0;
  wa.forEach(w => { if (wb.has(w)) inter++; });
  const union = new Set([...wa,...wb]).size;
  return union ? inter / union : 0;
}
function findDuplicates(text, type, excludeIdx) {
  const bucket = ensureBucket()[type];
  const matches = [];
  bucket.forEach((q,i) => {
    if (i === excludeIdx) return;
    const sim = textSimilarity(text, questionKeyText(q, type));
    if (sim >= 0.5) matches.push({ i, sim, text: questionKeyText(q,type) });
  });
  return matches.sort((a,b)=>b.sim-a.sim);
}

function adminEditQuestion(i) {
  const bucket = ensureBucket()[qbType];
  const q = i >= 0 ? bucket[i] : null;
  let body = '';
  if (qbType === 'mcq') {
    const opts = q ? q.opts : ['','','',''];
    const ans = q ? q.ans : 0;
    body = `
      <div class="adm-fgroup"><label class="adm-flabel">Question</label>
        <textarea class="std-textarea" id="af-q">${esc(q ? q.q : '')}</textarea></div>
      <label class="adm-flabel">Options (select the correct one)</label>
      ${[0,1,2,3].map(oi=>`
        <div class="adm-mcq-opt">
          <input type="radio" name="af-ans" value="${oi}" ${ans===oi?'checked':''}>
          <input type="text" class="std-input" id="af-opt${oi}" value="${esc(opts[oi]||'')}" placeholder="Option ${String.fromCharCode(65+oi)}">
        </div>`).join('')}`;
  } else if (qbType === 'cq') {
    body = `
      <div class="adm-fgroup"><label class="adm-flabel">Stimulus / Passage</label>
        <textarea class="std-textarea" id="af-stem">${esc(q ? q.stem : '')}</textarea></div>
      <div class="adm-fgroup"><label class="adm-flabel">ক (Knowledge — 1 mark)</label><input class="std-input" id="af-ka" value="${esc(q?q.ka:'')}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">খ (Comprehension — 2 marks)</label><input class="std-input" id="af-kha" value="${esc(q?q.kha:'')}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">গ (Application — 3 marks)</label><input class="std-input" id="af-ga" value="${esc(q?q.ga:'')}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">ঘ (Higher-order — 4 marks)</label><input class="std-input" id="af-gha" value="${esc(q?q.gha:'')}"></div>`;
  } else {
    body = `
      <div class="adm-fgroup"><label class="adm-flabel">Question</label>
        <textarea class="std-textarea" id="af-q">${esc(q ? q.q : '')}</textarea></div>
      <div class="adm-fgroup"><label class="adm-flabel">Model Answer</label>
        <textarea class="std-textarea" id="af-ans">${esc(q ? q.ans : '')}</textarea></div>`;
  }
  showAdminForm(i >= 0 ? `Edit ${qbType.toUpperCase()}` : `Add ${qbType.toUpperCase()}`, body, () => attemptSaveQuestion(i));
}

function collectQuestionFromForm() {
  if (qbType === 'mcq') {
    const q = document.getElementById('af-q').value.trim();
    const opts = [0,1,2,3].map(oi=>document.getElementById('af-opt'+oi).value.trim());
    const ansEl = document.querySelector('input[name="af-ans"]:checked');
    if (!q || opts.some(o=>!o) || !ansEl) return null;
    return { q, opts, ans: +ansEl.value };
  }
  if (qbType === 'cq') {
    const stem = document.getElementById('af-stem').value.trim();
    const ka = document.getElementById('af-ka').value.trim();
    const kha = document.getElementById('af-kha').value.trim();
    const ga = document.getElementById('af-ga').value.trim();
    const gha = document.getElementById('af-gha').value.trim();
    if (!stem || !ka || !kha || !ga || !gha) return null;
    return { stem, ka, kha, ga, gha };
  }
  const q = document.getElementById('af-q').value.trim();
  const ans = document.getElementById('af-ans').value.trim();
  if (!q || !ans) return null;
  return { q, ans };
}

function attemptSaveQuestion(i) {
  const data = collectQuestionFromForm();
  if (!data) { showToast('Please fill in all fields'); return; }
  const checkText = questionKeyText(data, qbType);
  const matches = findDuplicates(checkText, qbType, i >= 0 ? i : -1);
  if (matches.length) {
    showDuplicateReview(matches, () => { finalizeSaveQuestion(i, data); });
  } else {
    finalizeSaveQuestion(i, data);
  }
}
function showDuplicateReview(matches, onSaveAnyway) {
  document.getElementById('dupMatchList').innerHTML = matches.slice(0,5).map(m =>
    `<div class="dup-match-item"><span class="dup-match-pct">${Math.round(m.sim*100)}% similar</span>${esc(m.text.slice(0,140))}${m.text.length>140?'…':''}</div>`
  ).join('');
  openModal('dupWarnModal');
  document.getElementById('dupSaveAnywayBtn').onclick = () => {
    closeModal('dupWarnModal');
    onSaveAnyway();
  };
}
function finalizeSaveQuestion(i, data) {
  const bucket = ensureBucket()[qbType];
  const prefix = qbType + '_' + qbSubject.slice(0,3).toLowerCase() + '_' + qbChapter.replace(/\W+/g,'').slice(0,6).toLowerCase() + '_';
  if (i >= 0) { data.id = bucket[i].id; bucket[i] = data; }
  else { data.id = prefix + (bucket.length + 1) + '_' + Date.now().toString(36).slice(-4); bucket.push(data); }
  recomputeMcqBank();
  saveAdminStore();
  closeModal('adminItemModal');
  renderAdminQuestions();
  showToast(i >= 0 ? 'Question updated' : 'Question added');
}
function adminDeleteQuestion(i) {
  if (!confirm('Delete this question?')) return;
  ensureBucket()[qbType].splice(i,1);
  recomputeMcqBank();
  saveAdminStore();
  renderAdminQuestions();
  showToast('Question deleted');
}

/* ═══════════════════════════════════════
   BOOKS
═══════════════════════════════════════ */
function renderAdminBooks() {
  const html = `
    <div class="adm-toolbar"><span class="adm-count">${BOOKS.length} books</span>
      <button class="adm-add-btn" onclick="adminEditBook(-1)"><span class="mi material-icons-round">add</span>Add Book</button></div>
    <div class="card">${BOOKS.map((b,i)=>`
      <div class="adm-row">
        <div class="adm-row-ico" style="background:${b.color}">${b.emoji}</div>
        <div class="adm-row-info"><div class="adm-row-nm">${esc(b.name)}</div><div class="adm-row-sub">${esc(b.sub)} · ${b.isFree?'Free':'Paid'}${b.isNew?' · New':''}</div></div>
        <div class="adm-row-acts">
          <button class="adm-mini-btn" onclick="adminEditBook(${i})"><span class="mi material-icons-round">edit</span></button>
          <button class="adm-mini-btn danger" onclick="adminDeleteItem('books',${i},renderAdminBooks)"><span class="mi material-icons-round">delete</span></button>
        </div>
      </div>`).join('') || `<div class="adm-empty">No books yet.</div>`}</div>`;
  document.getElementById('adminTabContent').innerHTML = html;
}
function adminEditBook(i) {
  const b = i >= 0 ? BOOKS[i] : {name:'',sub:'',emoji:'📘',color:'#1a1a2e',isNew:false,isFree:true};
  showAdminForm(i >= 0 ? 'Edit Book' : 'Add Book', `
    <div class="adm-fgroup"><label class="adm-flabel">Title</label><input class="std-input" id="af-name" value="${esc(b.name)}"></div>
    <div class="adm-fgroup"><label class="adm-flabel">Subtitle</label><input class="std-input" id="af-sub" value="${esc(b.sub)}"></div>
    <div class="adm-frow">
      <div class="adm-fgroup"><label class="adm-flabel">Emoji</label><input class="std-input" id="af-emoji" maxlength="4" value="${esc(b.emoji)}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">Color (hex)</label><input class="std-input" id="af-color" value="${esc(b.color)}"></div>
    </div>
    <div class="adm-frow">
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600"><input type="checkbox" id="af-new" ${b.isNew?'checked':''}> Mark as New</label>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600"><input type="checkbox" id="af-free" ${b.isFree?'checked':''}> Free</label>
    </div>`, () => {
    const name = document.getElementById('af-name').value.trim();
    if (!name) { showToast('Title is required'); return; }
    const item = { name, sub: document.getElementById('af-sub').value.trim(),
      emoji: document.getElementById('af-emoji').value.trim() || '📘',
      color: document.getElementById('af-color').value.trim() || '#1a1a2e',
      isNew: document.getElementById('af-new').checked, isFree: document.getElementById('af-free').checked };
    if (i >= 0) BOOKS[i] = item; else BOOKS.push(item);
    saveAdminStore(); closeModal('adminItemModal'); renderAdminBooks();
    showToast(i >= 0 ? 'Book updated' : 'Book added');
  });
}

/* ═══════════════════════════════════════
   COURSES
═══════════════════════════════════════ */
function renderAdminCourses() {
  const html = `
    <div class="adm-toolbar"><span class="adm-count">${COURSES.length} courses</span>
      <button class="adm-add-btn" onclick="adminEditCourse(-1)"><span class="mi material-icons-round">add</span>Add Course</button></div>
    <div class="card">${COURSES.map((c,i)=>`
      <div class="adm-row">
        <div class="adm-row-ico" style="background:${c.color}">${c.emoji}</div>
        <div class="adm-row-info"><div class="adm-row-nm">${esc(c.name)}</div><div class="adm-row-sub">${esc(c.teacher)} · ${c.price===0?'Free':'৳'+c.price}${c.isPremium?' · Premium':''}</div></div>
        <div class="adm-row-acts">
          <button class="adm-mini-btn" onclick="adminEditCourse(${i})"><span class="mi material-icons-round">edit</span></button>
          <button class="adm-mini-btn danger" onclick="adminDeleteItem('courses',${i},renderAdminCourses)"><span class="mi material-icons-round">delete</span></button>
        </div>
      </div>`).join('') || `<div class="adm-empty">No courses yet.</div>`}</div>`;
  document.getElementById('adminTabContent').innerHTML = html;
}
function adminEditCourse(i) {
  const c = i >= 0 ? COURSES[i] : {name:'',sub:'',teacher:'',emoji:'🎓',color:'#1a1a2e',lessons:1,price:0,orig:null,isPremium:false,isFeature:false};
  showAdminForm(i >= 0 ? 'Edit Course' : 'Add Course', `
    <div class="adm-fgroup"><label class="adm-flabel">Course Name</label><input class="std-input" id="af-name" value="${esc(c.name)}"></div>
    <div class="adm-fgroup"><label class="adm-flabel">Subtitle</label><input class="std-input" id="af-sub" value="${esc(c.sub)}"></div>
    <div class="adm-fgroup"><label class="adm-flabel">Teacher</label><input class="std-input" id="af-teacher" value="${esc(c.teacher)}"></div>
    <div class="adm-frow">
      <div class="adm-fgroup"><label class="adm-flabel">Emoji</label><input class="std-input" id="af-emoji" maxlength="4" value="${esc(c.emoji)}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">Color (hex)</label><input class="std-input" id="af-color" value="${esc(c.color)}"></div>
    </div>
    <div class="adm-frow">
      <div class="adm-fgroup"><label class="adm-flabel">Lessons</label><input class="std-input" type="number" min="0" id="af-lessons" value="${c.lessons}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">Price (৳, 0 = free)</label><input class="std-input" type="number" min="0" id="af-price" value="${c.price}"></div>
    </div>
    <div class="adm-frow">
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600"><input type="checkbox" id="af-prem" ${c.isPremium?'checked':''}> Premium</label>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600"><input type="checkbox" id="af-feat" ${c.isFeature?'checked':''}> Featured</label>
    </div>`, () => {
    const name = document.getElementById('af-name').value.trim();
    if (!name) { showToast('Course name is required'); return; }
    const item = { name, sub: document.getElementById('af-sub').value.trim(), teacher: document.getElementById('af-teacher').value.trim(),
      emoji: document.getElementById('af-emoji').value.trim() || '🎓', color: document.getElementById('af-color').value.trim() || '#1a1a2e',
      lessons: +document.getElementById('af-lessons').value || 0, price: +document.getElementById('af-price').value || 0,
      isPremium: document.getElementById('af-prem').checked, isFeature: document.getElementById('af-feat').checked };
    if (i >= 0) COURSES[i] = item; else COURSES.push(item);
    saveAdminStore(); closeModal('adminItemModal'); renderAdminCourses();
    showToast(i >= 0 ? 'Course updated' : 'Course added');
  });
}

/* ═══════════════════════════════════════
   INSTITUTIONS
═══════════════════════════════════════ */
function renderAdminInstitutions() {
  const html = `
    <div class="adm-toolbar"><span class="adm-count">${INSTS.length} institutions</span>
      <button class="adm-add-btn" onclick="adminEditInst(-1)"><span class="mi material-icons-round">add</span>Add Institution</button></div>
    <div class="card">${INSTS.map((n,i)=>`
      <div class="adm-row">
        <div class="adm-row-ico" style="background:${n.color}">${n.emoji}</div>
        <div class="adm-row-info"><div class="adm-row-nm">${esc(n.name)}</div><div class="adm-row-sub">${esc(n.sub)} · ${n.students.toLocaleString()} students</div></div>
        <div class="adm-row-acts">
          <button class="adm-mini-btn" onclick="adminEditInst(${i})"><span class="mi material-icons-round">edit</span></button>
          <button class="adm-mini-btn danger" onclick="adminDeleteItem('insts',${i},renderAdminInstitutions)"><span class="mi material-icons-round">delete</span></button>
        </div>
      </div>`).join('') || `<div class="adm-empty">No institutions yet.</div>`}</div>`;
  document.getElementById('adminTabContent').innerHTML = html;
}
function adminEditInst(i) {
  const n = i >= 0 ? INSTS[i] : {name:'',sub:'',emoji:'🏫',color:'#1a1a2e',following:false,students:0,exams:0,announcements:0};
  showAdminForm(i >= 0 ? 'Edit Institution' : 'Add Institution', `
    <div class="adm-fgroup"><label class="adm-flabel">Name</label><input class="std-input" id="af-name" value="${esc(n.name)}"></div>
    <div class="adm-fgroup"><label class="adm-flabel">Location / Type</label><input class="std-input" id="af-sub" value="${esc(n.sub)}"></div>
    <div class="adm-frow">
      <div class="adm-fgroup"><label class="adm-flabel">Emoji</label><input class="std-input" id="af-emoji" maxlength="4" value="${esc(n.emoji)}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">Color (hex)</label><input class="std-input" id="af-color" value="${esc(n.color)}"></div>
    </div>
    <div class="adm-frow" style="grid-template-columns:1fr 1fr 1fr">
      <div class="adm-fgroup"><label class="adm-flabel">Students</label><input class="std-input" type="number" min="0" id="af-students" value="${n.students}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">Exams</label><input class="std-input" type="number" min="0" id="af-exams" value="${n.exams}"></div>
      <div class="adm-fgroup"><label class="adm-flabel">Posts</label><input class="std-input" type="number" min="0" id="af-posts" value="${n.announcements}"></div>
    </div>`, () => {
    const name = document.getElementById('af-name').value.trim();
    if (!name) { showToast('Name is required'); return; }
    const item = { name, sub: document.getElementById('af-sub').value.trim(), emoji: document.getElementById('af-emoji').value.trim() || '🏫',
      color: document.getElementById('af-color').value.trim() || '#1a1a2e', following: n.following,
      students: +document.getElementById('af-students').value || 0, exams: +document.getElementById('af-exams').value || 0,
      announcements: +document.getElementById('af-posts').value || 0 };
    if (i >= 0) INSTS[i] = item; else INSTS.push(item);
    saveAdminStore(); closeModal('adminItemModal'); renderAdminInstitutions();
    showToast(i >= 0 ? 'Institution updated' : 'Institution added');
  });
}

/* ═══════════════════════════════════════
   FAQS
═══════════════════════════════════════ */
function renderAdminFaqs() {
  const html = `
    <div class="adm-toolbar"><span class="adm-count">${FAQS.length} FAQs</span>
      <button class="adm-add-btn" onclick="adminEditFaq(-1)"><span class="mi material-icons-round">add</span>Add FAQ</button></div>
    <div class="card">${FAQS.map((f,i)=>`
      <div class="adm-row">
        <div class="adm-row-ico"><span class="mi material-icons-round" style="font-size:18px">help</span></div>
        <div class="adm-row-info"><div class="adm-row-nm">${esc(f.q)}</div><div class="adm-row-sub">${esc(f.a.slice(0,70))}${f.a.length>70?'…':''}</div></div>
        <div class="adm-row-acts">
          <button class="adm-mini-btn" onclick="adminEditFaq(${i})"><span class="mi material-icons-round">edit</span></button>
          <button class="adm-mini-btn danger" onclick="adminDeleteItem('faqs',${i},renderAdminFaqs)"><span class="mi material-icons-round">delete</span></button>
        </div>
      </div>`).join('') || `<div class="adm-empty">No FAQs yet.</div>`}</div>`;
  document.getElementById('adminTabContent').innerHTML = html;
}
function adminEditFaq(i) {
  const f = i >= 0 ? FAQS[i] : {q:'',a:''};
  showAdminForm(i >= 0 ? 'Edit FAQ' : 'Add FAQ', `
    <div class="adm-fgroup"><label class="adm-flabel">Question</label><input class="std-input" id="af-q" value="${esc(f.q)}"></div>
    <div class="adm-fgroup"><label class="adm-flabel">Answer</label><textarea class="std-textarea" id="af-a">${esc(f.a)}</textarea></div>`, () => {
    const q = document.getElementById('af-q').value.trim(), a = document.getElementById('af-a').value.trim();
    if (!q || !a) { showToast('Both fields are required'); return; }
    if (i >= 0) FAQS[i] = {q,a}; else FAQS.push({q,a});
    saveAdminStore(); closeModal('adminItemModal'); renderAdminFaqs();
    showToast(i >= 0 ? 'FAQ updated' : 'FAQ added');
  });
}

/* ── Shared delete helper for the simple list sections ─────── */
const ADMIN_ARRAY_MAP = { books: () => BOOKS, courses: () => COURSES, insts: () => INSTS, faqs: () => FAQS };
function adminDeleteItem(key, i, rerenderFn) {
  if (!confirm('Delete this item?')) return;
  ADMIN_ARRAY_MAP[key]().splice(i,1);
  saveAdminStore();
  rerenderFn();
  showToast('Deleted');
}

/* ═══════════════════════════════════════
   DATA (persisted, admin-editable)
═══════════════════════════════════════ */
const ER_STORE_KEY = 'er_admin_store_v1';
const ER_PIN_KEY = 'er_admin_pin';

const DEFAULT_SUBJECTS = [
  {name:'Physics',emoji:'⚛️',color:'#1a1a2e',pct:78,chapters:['Vectors & Motion','Newton\'s Laws','Work & Energy','Electricity','Waves','Optics','Modern Physics']},
  {name:'Chemistry',emoji:'🧪',color:'#0f3443',pct:62,chapters:['Atomic Structure','Periodic Table','Chemical Bonds','Thermodynamics','Organic I','Organic II','Electrochemistry']},
  {name:'Biology',emoji:'🧬',color:'#14532d',pct:85,chapters:['Cell Biology','Genetics','Photosynthesis','Respiration','Ecology','Human Anatomy','Evolution']},
  {name:'Mathematics',emoji:'📐',color:'#2d1b69',pct:54,chapters:['Sets & Functions','Algebra','Trigonometry','Calculus I','Calculus II','Statistics','Complex Numbers']},
  {name:'English',emoji:'📖',color:'#44182b',pct:71,chapters:['Grammar','Reading','Writing','Vocabulary','Comprehension','Literature I','Literature II']},
  {name:'ICT',emoji:'💻',color:'#0c1445',pct:90,chapters:['Computer Basics','Networking','Programming','Database','HTML/CSS','Problem Solving','Security']},
];
const DEFAULT_NAMES = ['Tanjim H.','Raihan K.','Nusrat F.','Sakib A.','Mim R.','Fahim U.','Sadia I.','Riyad H.','Tanvir M.','Priya D.','Emon B.','Lina C.','Sajid R.','Tamal K.','Rifa T.','Sumon G.','Disha P.','Arif J.','Riya S.','Habib W.'];
const DEFAULT_SCORES = [10450,9820,9610,9200,8950,8810,8700,8540,8300,8100,7900,7700,7500,7350,7200,7050,6900,6750,6600,6450];
const DEFAULT_BANNERS = [
  {bg:'linear-gradient(135deg,#1a1a2e,#16213e)',emoji:'🔬',lbl:'📢 HSC Physics Live Exam — 7 PM Tonight'},
  {bg:'linear-gradient(135deg,#0f3443,#34e89e)',emoji:'📚',lbl:'📖 New: Chemistry 2026 Board Edition'},
  {bg:'linear-gradient(135deg,#4b134f,#c94b4b)',emoji:'🏆',lbl:'🏆 Season 3 Leaderboard — Now Live!'},
  {bg:'linear-gradient(135deg,#f7971e,#ffd200)',emoji:'⚡',lbl:'⚡ Flash MCQ Sprint — 30 min only'},
  {bg:'linear-gradient(135deg,#1d2671,#c33764)',emoji:'🎓',lbl:'🎓 Batch A Registration Open'},
  {bg:'linear-gradient(135deg,#134e5e,#71b280)',emoji:'🧬',lbl:'🧬 Biology Model Test — Free'},
];
const DEFAULT_BOOKS = [
  {name:'HSC Physics 2026',sub:'Class 11–12',emoji:'⚛️',color:'#1a1a2e',isNew:true,isFree:true},
  {name:'Chemistry Master',sub:'HSC Board',emoji:'🧪',color:'#0f3443',isNew:false,isFree:false},
  {name:'Biology Digest',sub:'Full Syllabus',emoji:'🧬',color:'#14532d',isNew:true,isFree:true},
  {name:'Math Solutions',sub:'Chapter-wise',emoji:'📐',color:'#2d1b69',isNew:false,isFree:false},
  {name:'English Grammar',sub:'Advanced C1',emoji:'📖',color:'#44182b',isNew:false,isFree:true},
  {name:'ICT Handbook',sub:'HSC Edition',emoji:'💻',color:'#0c1445',isNew:true,isFree:false},
  {name:'Past Papers',sub:'2015–2025',emoji:'📋',color:'#3d1515',isNew:false,isFree:true},
  {name:'Biology Lab',sub:'Practicals',emoji:'🔬',color:'#1a3d1a',isNew:false,isFree:false},
  {name:'Math Shortcuts',sub:'Competitive',emoji:'🧮',color:'#1a1a4d',isNew:true,isFree:false},
];
const DEFAULT_COURSES = [
  {name:'Physics Complete Batch',sub:'Chapter 1–12',teacher:'Md. Riaz Sir',emoji:'⚛️',color:'#1a1a2e',lessons:42,price:0,isPremium:false,isFeature:true},
  {name:'Chemistry Masterclass',sub:'Organic Focus',teacher:'Nadia Ma\'am',emoji:'🧪',color:'#0f3443',lessons:36,price:299,orig:599,isPremium:true,isFeature:true},
  {name:'Math Problem Solving',sub:'Board + Creative',teacher:'Alam Sir',emoji:'📐',color:'#2d1b69',lessons:28,price:0,isPremium:false,isFeature:false},
  {name:'Biology Crash Course',sub:'7-day sprint',teacher:'Ritu Ma\'am',emoji:'🧬',color:'#14532d',lessons:18,price:0,isPremium:false,isFeature:false},
  {name:'ICT Full Course',sub:'Code to Exam',teacher:'Tanvir Sir',emoji:'💻',color:'#0c1445',lessons:55,price:499,orig:999,isPremium:true,isFeature:false},
  {name:'English Communication',sub:'C1 Level',teacher:'Sara Ma\'am',emoji:'📖',color:'#44182b',lessons:24,price:199,orig:399,isPremium:true,isFeature:true},
];
const DEFAULT_INSTS = [
  {name:'Tejgaon Govt. High School',sub:'Dhaka · Public School',emoji:'🏫',color:'#1a2e1a',following:true,students:1240,exams:86,announcements:14},
  {name:'Milestone College',sub:'Uttara, Dhaka',emoji:'🎓',color:'#1a1a2e',following:false,students:3800,exams:214,announcements:42},
  {name:'Dhaka Residential Model',sub:'DRMC · Elite Institution',emoji:'🏛️',color:'#2d1b00',following:true,students:2100,exams:178,announcements:29},
  {name:'Srijon Coaching Center',sub:'Farmgate, Dhaka',emoji:'📚',color:'#0f3443',following:false,students:920,exams:64,announcements:18},
  {name:'BCS & HSC Academy',sub:'Online Platform',emoji:'🌐',color:'#14532d',following:false,students:15000,exams:480,announcements:62},
];
const RECENT_EXAMS = [
  {name:'HSC Physics MCQ Mock',sub:'Physics',date:'Jun 27',score:82,cls:'sc-g',icon:'science'},
  {name:'Chemistry Board Model',sub:'Chemistry',date:'Jun 24',score:61,cls:'sc-m',icon:'biotech'},
  {name:'Math Full CQ Set',sub:'Math',date:'Jun 21',score:44,cls:'sc-b',icon:'calculate'},
];
const DEFAULT_FAQS = [
  {q:'How does the streak work?',a:'Study at least one topic or take at least one exam per day to maintain your streak. Missing a day resets it.'},
  {q:'Can I retake a live exam later?',a:'Live exams are not available for retake once the window closes. However, the same exam may appear in your practice bank.'},
  {q:'How is my rank calculated?',a:'Your rank is based on total points earned across all completed exams in the current season, updated every 30 minutes.'},
  {q:'What is the difference between MCQ and CQ?',a:'MCQ (Multiple Choice Questions) are single-answer questions. CQ (Creative Questions) require written structured answers in 4 parts.'},
  {q:'How do I follow a teacher or institution?',a:'Go to the Institutions or Teacher Profiles tab, find them, and tap Follow. Their exams and announcements will appear in your feed.'},
];

// ── Question bank seed generator ──────────────────────────
// Produces placeholder MCQ/CQ/SQ entries per subject/chapter so the
// app has real, editable question data instead of an empty bank.
// Replace these through Admin Panel → Questions.
function buildDefaultQBank() {
  const qb = {};
  DEFAULT_SUBJECTS.forEach(s => {
    qb[s.name] = {};
    s.chapters.forEach(ch => {
      const mcq = [], cq = [], sq = [];
      for (let i = 1; i <= 5; i++) {
        mcq.push({
          id: 'mcq_' + s.name.slice(0,3).toLowerCase() + '_' + ch.replace(/\W+/g,'').slice(0,6).toLowerCase() + '_' + i,
          q: `[Sample] ${ch} — question ${i}: which statement best describes this topic?`,
          opts: [`Option A for ${ch} Q${i}`, `Option B for ${ch} Q${i}`, `Option C for ${ch} Q${i}`, `Option D for ${ch} Q${i}`],
          ans: 0,
        });
      }
      for (let i = 1; i <= 2; i++) {
        cq.push({
          id: 'cq_' + s.name.slice(0,3).toLowerCase() + '_' + ch.replace(/\W+/g,'').slice(0,6).toLowerCase() + '_' + i,
          stem: `[Sample] ${ch} — stimulus/passage ${i} goes here.`,
          ka: `State a key term related to ${ch}.`,
          kha: `Explain a concept from ${ch} in your own words.`,
          ga: `Analyse how a principle of ${ch} applies to a given scenario.`,
          gha: `Evaluate/judge the significance of ${ch} using the stimulus above.`,
        });
      }
      for (let i = 1; i <= 3; i++) {
        sq.push({
          id: 'sq_' + s.name.slice(0,3).toLowerCase() + '_' + ch.replace(/\W+/g,'').slice(0,6).toLowerCase() + '_' + i,
          q: `[Sample] Briefly answer: a short question about ${ch} (#${i}).`,
          ans: `Sample short answer for ${ch} #${i}.`,
        });
      }
      qb[s.name][ch] = { mcq, cq, sq };
    });
  });
  return qb;
}

// ── Store load / save ─────────────────────────────────────
let SUBJECTS, NAMES, SCORES, BANNERS, BOOKS, COURSES, INSTS, FAQS, QBANK;

function loadAdminStore() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(ER_STORE_KEY) || 'null'); } catch(e) { raw = null; }
  SUBJECTS = (raw && raw.subjects) || JSON.parse(JSON.stringify(DEFAULT_SUBJECTS));
  NAMES    = (raw && raw.names)    || DEFAULT_NAMES.slice();
  SCORES   = (raw && raw.scores)   || DEFAULT_SCORES.slice();
  BANNERS  = (raw && raw.banners)  || JSON.parse(JSON.stringify(DEFAULT_BANNERS));
  BOOKS    = (raw && raw.books)    || JSON.parse(JSON.stringify(DEFAULT_BOOKS));
  COURSES  = (raw && raw.courses)  || JSON.parse(JSON.stringify(DEFAULT_COURSES));
  INSTS    = (raw && raw.insts)    || JSON.parse(JSON.stringify(DEFAULT_INSTS));
  FAQS     = (raw && raw.faqs)     || JSON.parse(JSON.stringify(DEFAULT_FAQS));
  QBANK    = (raw && raw.qbank)    || buildDefaultQBank();
  recomputeMcqBank();
  if (!raw) saveAdminStore(false);
}
function saveAdminStore(doRerender) {
  try {
    localStorage.setItem(ER_STORE_KEY, JSON.stringify({
      subjects: SUBJECTS, names: NAMES, scores: SCORES, banners: BANNERS,
      books: BOOKS, courses: COURSES, insts: INSTS, faqs: FAQS, qbank: QBANK
    }));
  } catch(e) { /* storage unavailable — edits stay in-memory for this session */ }
  if (doRerender !== false) rerenderAllData();
}
// Total MCQ count per subject, drawn from the live question bank —
// this is what feeds the exam setup screens and subject cards.
function recomputeMcqBank() {
  SUBJECTS.forEach(s => {
    let total = 0;
    const chMap = QBANK[s.name] || {};
    (s.chapters || []).forEach(ch => { total += (chMap[ch] && chMap[ch].mcq ? chMap[ch].mcq.length : 0); });
    s.mcqBank = total;
  });
}
// In the standalone admin panel there's no app UI to re-render —
// this just refreshes whichever admin tab is currently open.
function rerenderAllData() {
  if (typeof switchAdminTab === 'function' && typeof adminActiveTab !== 'undefined') {
    switchAdminTab(adminActiveTab);
  }
}
loadAdminStore();

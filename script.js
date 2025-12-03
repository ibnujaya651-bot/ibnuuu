// Simple quiz to discover preferences & desired partner traits.
// Data stored only in localStorage. Invite mode creates a url fragment so the person can open and fill.
// No server, no tracking.

const QUESTIONS = [
  { q: "Apa aktivitas yang paling kamu suka lakukan di waktu senggang?", opts: ["Nonton/Streaming", "Olahraga/Outdoor", "Main game", "Baca/Belajar"] },
  { q: "kamu lebih suka healing dimana", opts: ["Santai di kafe", "Petualangan/Travel", "Di rumah aja", "Mendaki"] },
  { q: "Tipe humor yang kamu suka?", opts: ["Garing/Deadpan", "Gokil/Slapstick", "Cerdas/satire", "Romantis"] },
  { q: "Prioritas dalam pasangan?", opts: ["Setia & perhatian", "Lucu & Santai", "Santai & asyik", "Rapi & terencana"] },
  { q: "Lebih suka hadiah apa ...", opts: ["Berguna/praktis", "Mewah/berkelas", "Effort lucu", "Bagus Rapi"] },
  { q: "Media komunikasi favorit?", opts: ["Chat Whatsaap", "Voice call", "Video call", "Tatap muka langsung"] },
  { q: "Seberapa sosial kamu?", opts: ["Extrovert", "Ambivret", "Introvert"] },
  { q: "Dalam konflik kamu cenderung apa ...", opts: ["Tenang", "Butuh waktu sendiri", "Langsung marah marah😡", "Minta maaf duluan","NGAMBEK"] }
];

// --- Elements
const modeSelect = document.getElementById('mode-select');
const btnSelf = document.getElementById('btn-self');
const btnInvite = document.getElementById('btn-invite');
const quizCard = document.getElementById('quiz-card');
const qnum = document.getElementById('qnum');
const qtotal = document.getElementById('qtotal');
const qtext = document.getElementById('qtext');
const optionsEl = document.getElementById('options');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const resultCard = document.getElementById('result-card');
const resultSummary = document.getElementById('result-summary');
const resultSuggestion = document.getElementById('result-suggestion');
const btnSave = document.getElementById('btn-save');
const btnCopy = document.getElementById('btn-copy');
const btnNew = document.getElementById('btn-new');
const inviteCard = document.getElementById('invite-card');
const btnGenerate = document.getElementById('btn-generate');
const inviteUrlEl = document.getElementById('invite-url');

let answers = new Array(QUESTIONS.length).fill(null);
let current = 0;
let mode = 'self'; // or 'invite'

// init totals
qtotal.textContent = QUESTIONS.length;

// ---------- UI helpers ----------
function show(el){ el.classList.remove('hidden') }
function hide(el){ el.classList.add('hidden') }

function startQuiz(selectedMode){
  mode = selectedMode;
  hide(modeSelect);
  hide(inviteCard);
  hide(resultCard);
  show(quizCard);
  answers = new Array(QUESTIONS.length).fill(null);
  current = 0;
  renderQuestion();
}

btnSelf.addEventListener('click', ()=> startQuiz('self'));
btnInvite.addEventListener('click', ()=> { show(inviteCard); hide(modeSelect); });

function renderQuestion(){
  qnum.textContent = current + 1;
  const data = QUESTIONS[current];
  qtext.textContent = data.q;
  optionsEl.innerHTML = '';
  data.opts.forEach((o, i) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = o;
    if (answers[current] === i) div.classList.add('selected');
    div.addEventListener('click', () => {
      answers[current] = i;
      renderQuestion();
    });
    optionsEl.appendChild(div);
  });
  btnPrev.disabled = current === 0;
  btnNext.textContent = (current === QUESTIONS.length - 1) ? 'Selesai' : 'Selanjutnya ➡';
}

btnPrev.addEventListener('click', ()=>{
  if(current>0){ current--; renderQuestion(); }
});

btnNext.addEventListener('click', ()=>{
  if (answers[current] === null) {
    alert('Pilih salah satu jawaban dulu ya 🙂');
    return;
  }
  if (current < QUESTIONS.length - 1){
    current++; renderQuestion();
  } else {
    finishQuiz();
  }
});

// Finish -> analyse
function finishQuiz(){
  hide(quizCard);
  show(resultCard);
  // simple scoring: map answers to trait buckets
  const tally = { Romantis:0, Santuy:0, Petualang:0, Serius:0, Sosial:0 };
  // mapping heuristic (just sample)
  answers.forEach((a, idx) => {
    if (idx === 0){ // hobby
      if (a===0) tally.Santuy++;
      if (a===1) tally.Petualang++;
      if (a===2) tally.Santuy++;
      if (a===3) tally.Serius++;
    } else if (idx ===1) {
      if (a===0) tally.Santuy++;
      if (a===1) tally.Petualang++;
      if (a===2) tally.Romantis++;
      if (a===3) tally.Serius++;
    } else if (idx===2) {
      if (a===0) tally.Santuy++;
      if (a===1) tally.Santuy++;
      if (a===2) tally.Serius++;
      if (a===3) tally.Romantis++;
    } else if (idx===3) {
      if (a===0) tally.Romantis++;
      if (a===1) tally.Serius++;
      if (a===2) tally.Santuy++;
      if (a===3) tally.Serius++;
    } else if (idx===4) {
      if (a===0) tally.Serius++;
      if (a===1) tally.Petualang++;
      if (a===2) tally.Romantis++;
      if (a===3) tally.Petualang++;
    } else if (idx===5) {
      if (a===0) tally.Santuy++;
      if (a===1) tally.Romantis++;
      if (a===2) tally.Romantis++;
      if (a===3) tally.Santuy++;
    } else if (idx===6) {
      if (a===0) tally.Sosial++;
      if (a===1) tally.Santuy++;
      if (a===2) tally.Serius++;
      if (a===3) tally.Santuy++;
    } else if (idx===7) {
      if (a===0) tally.Romantis++;
      if (a===1) tally.Santuy++;
      if (a===2) tally.Santuy++;
      if (a===3) tally.Romantis++;
    }
  });

  // find top traits
  const sorted = Object.entries(tally).sort((a,b)=>b[1]-a[1]);
  const top = sorted.slice(0,2).map(s=>s[0]);

  resultSummary.innerHTML = `<strong>Tipe dominan:</strong> ${top.join(' & ')}<br/><br/>
  <strong>Detail tally:</strong><br/>
  ${Object.entries(tally).map(kv=>`${kv[0]}: ${kv[1]}`).join('<br/>')}`;

  // suggestions based on top traits
  let suggestions = [];
  if (top.includes('Romantis')) suggestions.push("Suka hal-hal personal & perhatian. Kado personal atau momen berdua dihargai.");
  if (top.includes('Santuy')) suggestions.push("Suka suasana santai. Ajak ngopi, nonton, atau main bareng lebih cocok daripada acara formal.");
  if (top.includes('Petualang')) suggestions.push("Suka pengalaman. Suggest aktivitas outdoor / trip singkat.");
  if (top.includes('Serius')) suggestions.push("Menghargai stabilitas & rencana. Tunjukkan komitmen & konsistensi.");
  if (top.includes('Sosial')) suggestions.push("Suka kumpul & temenan banyak. Kenalkan ke circlenya dengan santai.");

  resultSuggestion.innerHTML = `<strong>Rekomendasi singkat:</strong><ul>${suggestions.map(s=>`<li>${s}</li>`).join('')}</ul>`;

  // save result temporarily in variable for copy/save
  window.LAST_RESULT = { answers, tally, top, suggestions, mode, ts: new Date().toISOString() };

  // if mode invite, store result under a key so inviter can ask them to share screenshot or paste it
  if (mode === 'invite'){
    // store under localStorage key "quiz_invite_result_v1" + timestamp
    const key = 'quiz_invite_result_v1_' + Date.now();
    localStorage.setItem(key, JSON.stringify(window.LAST_RESULT));
    // show key to user so they can share (optionally)
    inviteUrlEl.textContent = `Hasil tersimpan di browser (key: ${key}). Jika mau berbagi, minta mereka salin isi localStorage dan kirim ke kamu.`;
  }
}

// Save local (for the person who filled)
btnSave.addEventListener('click', ()=>{
  const key = 'quiz_saved_' + Date.now();
  localStorage.setItem(key, JSON.stringify(window.LAST_RESULT));
  alert('Hasil tersimpan secara lokal di browser (key: ' + key + ').');
});

// copy result text
btnCopy.addEventListener('click', ()=>{
  if (!window.LAST_RESULT) return;
  const text = `Hasil Quiz (${new Date().toLocaleString()}):\nTipe: ${window.LAST_RESULT.top.join(' & ')}\nRekomendasi: ${window.LAST_RESULT.suggestions.join(' | ')}`;
  navigator.clipboard?.writeText(text).then(()=> alert('Hasil disalin ke clipboard.'), ()=> alert('Gagal menyalin.'));
});

btnNew.addEventListener('click', ()=>{
  hide(resultCard);
  show(modeSelect);
  hide(inviteCard);
});

// Invite generator: produce a URL with #invite marker (no personal data)
btnGenerate.addEventListener('click', ()=>{
  const url = location.origin + location.pathname + '#invite';
  inviteUrlEl.textContent = url;
  // copy to clipboard
  navigator.clipboard?.writeText(url).then(()=> { alert('Link invite disalin. Kirim ke orang yang kamu minta isikan.'); }, ()=>{});
});

// If someone open with #invite, show mode invite instructions
function checkHash(){
  if (location.hash === '#invite'){
    // directly start quiz in invite mode
    startQuiz('invite');
  }
}

window.addEventListener('load', checkHash);

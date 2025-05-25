// app.js

// Cookie helpers
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {
  document.cookie = name+'=; Max-Age=-99999999;';
}

// LocalStorage-based session state
function getInitialSessionState() {
  try {
    const s = localStorage.getItem('qna_sessionState');
    if(s) return JSON.parse(s);
  } catch(e) {}
  return { subjectId: null, chapterId: null, qnaMode: false };
}
function saveSessionState() {
  localStorage.setItem('qna_sessionState', JSON.stringify(sessionState));
}
let sessionState = getInitialSessionState();

// Profile information (stored in localStorage)
function getProfileInfo() {
  const prof = localStorage.getItem('qna_profileInfo');
  if(prof) return JSON.parse(prof);
  // Default profile
  return {
    department: "CSE",
    examSession: "২০২৩-২৪",
    admissionSession: "২০২১-২২"
  };
}
function setProfileInfo(info) {
  localStorage.setItem('qna_profileInfo', JSON.stringify(info));
}

const demoUser = { username: "student", password: "1234", email: "student@email.com" , session :"",clsyear:"",exam:""};
let isLoggedIn = false;

const subjectData = [
  // ... আগের মতোই ...
  {
    id: "math",
    title: "গণিত",
    icon: "fas fa-calculator",
    chapters: [
      { id: "math_ch1", title: "সংখ্যা", qna: [
        { q: "প্রাকৃতিক সংখ্যা কী?", a: "১, ২, ৩, ৪,... কে প্রাকৃতিক সংখ্যা বলে।" },
        { q: "শূন্য কি প্রাকৃতিক সংখ্যা?", a: "না, শূন্য প্রাকৃতিক সংখ্যা নয়।" }
      ] },
      { id: "math_ch2", title: "জ্যামিতি", qna: [
        { q: "ত্রিভুজের বাহুর সমষ্টি কত?", a: "ত্রিভুজের তিন বাহু থাকে।" }
      ] }
    ]
  },
  {
    id: "science",
    title: "বিজ্ঞান",
    icon: "fas fa-flask",
    chapters: [
      { id: "science_ch1", title: "কোষ", qna: [
        { q: "কোষ কী?", a: "কোষ জীবের মৌলিক একক।" }
      ] },
      { id: "science_ch2", title: "জীবজগৎ", qna: [
        { q: "প্রাণীজগৎ কী?", a: "সব জীবিত প্রাণীকে প্রাণীজগৎ বলে।" }
      ] }
    ]
  },
  {
    id: "history",
    title: "ইতিহাস",
    icon: "fas fa-landmark",
    chapters: [
      { id: "history_ch1", title: "প্রাচীন যুগ", qna: [
        { q: "প্রাচীন যুগ কী?", a: "অতীতের প্রাথমিক সময়কে প্রাচীন যুগ বলে।" }
      ] },
      { id: "history_ch2", title: "মধ্যযুগ", qna: [
        { q: "মধ্যযুগ কবে শুরু?", a: "প্রায় ৫ম শতাব্দী থেকে।" }
      ] }
    ]
  }
];

const qnaData = {
  ch1: [
    { q: "HTML কী?", a: "HTML অর্থ HyperText Markup Language, যা ওয়েব পেজের কাঠামো তৈরি করে।" },
    { q: "CSS কী কাজ করে?", a: "CSS ওয়েবপেজের ডিজাইন ও স্টাইলিং-এর জন্য ব্যবহৃত হয়।" }
  ],
  ch2: [
    { q: "JavaScript কী?", a: "JavaScript ওয়েবপেজে ইন্টারেকটিভিটি যোগ করে।" },
    { q: "API কী?", a: "API (Application Programming Interface) সফটওয়্যারের মধ্যে যোগাযোগের মাধ্যম।" }
  ]
};

// Elements
const loginDiv = document.getElementById('login');
const mainAppDiv = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const dashboardUsername = document.getElementById('dashboardUsername');
const profileUsername = document.getElementById('profileUsername');
const profileAvatar = document.getElementById('profileAvatar');
const profileEmail = document.getElementById('profileEmail');
const profileDepartment = document.getElementById('profileDepartment');
const profileExamSession = document.getElementById('profileExamSession');
const profileAdmissionSession = document.getElementById('profileAdmissionSession');
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileForm = document.getElementById('editProfileForm');
const logoutBtn = document.getElementById('logoutBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const bottomNav = document.getElementById('bottomNav');
const navs = Array.from(document.querySelectorAll('.android-bottom-nav .nav-btn'));
const activities = [
  document.getElementById('dashboard'),
  document.getElementById('profile'),
  document.getElementById('subject'),
  document.getElementById('capter'),
  document.getElementById('chapterQna')
];
const openDrawerBtn = document.getElementById("openDrawerBtn");
const drawer = document.getElementById("androidDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerMenuBtns = Array.from(document.querySelectorAll(".drawer-menu-btn-link"));
const authAlert = document.getElementById('authAlert');
const appBar = document.getElementById('appBar');

const subjectList = document.getElementById('subjectList');
const chapterSection = document.getElementById('chapterSection');
const chapterBackBtn = document.getElementById('chapterBackBtn');
const selectedSubjectTitle = document.getElementById('selectedSubjectTitle');
const chapterList = document.getElementById('chapterList');
const chapterQnaActivity = document.getElementById('chapterQna');
const qnaBackBtn = document.getElementById('qnaBackBtn');
const qnaSubjectTitle = document.getElementById('qnaSubjectTitle');
const qnaChapterTitle = document.getElementById('qnaChapterTitle');
const qnaList = document.getElementById('qnaList');
const chapterSelect = document.getElementById('chapterSelect');
const qnaBlock = document.getElementById('qnaBlock');

// Drawer Open/Close, Drawer/BottomNav Clicks...
openDrawerBtn.onclick = function() {
  if (isLoggedIn) {
    drawer.classList.add("active");
    drawerBackdrop.classList.add("active");
  }
};
drawerBackdrop.onclick = function() {
  drawer.classList.remove("active");
  drawerBackdrop.classList.remove("active");
};
drawerMenuBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    drawerMenuBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    navs.forEach(n => {
      if (n.dataset.activity === btn.dataset.activity) n.classList.add('active');
      else n.classList.remove('active');
    });
    tryNavigateActivity(this.dataset.activity, true);
    drawer.classList.remove("active");
    drawerBackdrop.classList.remove("active");
  });
});
navs.forEach(nav => {
  nav.addEventListener('click', function() {
    tryNavigateActivity(this.dataset.activity, true);
  });
});

// Profile rendering
function renderProfileInfo() {
  profileUsername.textContent = demoUser.username;
  profileAvatar.textContent = demoUser.username[0].toUpperCase();
  profileEmail.textContent = demoUser.email;
  const info = getProfileInfo();
  profileDepartment.textContent = info.department;
  profileExamSession.textContent = info.examSession;
  profileAdmissionSession.textContent = info.admissionSession;
  // Fill form values too
  editProfileForm.department.value = info.department;
  editProfileForm.examSession.value = info.examSession;
  editProfileForm.admissionSession.value = info.admissionSession;
}
editProfileBtn.onclick = function() {
  editProfileForm.classList.remove('hidden');
  editProfileBtn.classList.add('hidden');
};
cancelEditBtn.onclick = function() {
  editProfileForm.classList.add('hidden');
  editProfileBtn.classList.remove('hidden');
};
editProfileForm.onsubmit = function(e) {
  e.preventDefault();
  setProfileInfo({
    department: editProfileForm.department.value,
    examSession: editProfileForm.examSession.value,
    admissionSession: editProfileForm.admissionSession.value
  });
  renderProfileInfo();
  editProfileForm.classList.add('hidden');
  editProfileBtn.classList.remove('hidden');
};

function renderSubjectList() {
  subjectList.innerHTML = '';
  subjectData.forEach(subj => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="${subj.icon}"></i> <span class="subject-title">${subj.title}</span>`;
    li.onclick = () => {
      sessionState.subjectId = subj.id;
      sessionState.chapterId = null;
      sessionState.qnaMode = false;
      saveSessionState();
      subjectList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
      li.classList.add('active');
      showChapterList(subj);
    };
    if (sessionState.subjectId === subj.id) li.classList.add('active');
    subjectList.appendChild(li);
  });
}

function showChapterList(subj) {
  subjectList.classList.add('hidden');
  chapterSection.classList.remove('hidden');
  selectedSubjectTitle.textContent = subj.title;
  chapterList.innerHTML = '';
  subj.chapters.forEach(chap => {
    const cli = document.createElement('li');
    cli.innerHTML = `<i class="fas fa-folder-open"></i> <span class="chapter-title">${chap.title}</span>`;
    cli.onclick = () => {
      sessionState.subjectId = subj.id;
      sessionState.chapterId = chap.id;
      sessionState.qnaMode = true;
      saveSessionState();
      chapterList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
      cli.classList.add('active');
      showQnaList(subj, chap);
    };
    if (sessionState.chapterId === chap.id) cli.classList.add('active');
    chapterList.appendChild(cli);
  });
  chapterBackBtn.onclick = function() {
    sessionState.chapterId = null;
    sessionState.qnaMode = false;
    saveSessionState();
    chapterSection.classList.add('hidden');
    subjectList.classList.remove('hidden');
    subjectList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
    chapterList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
  };
  chapterBackBtn.querySelector('i').onclick = function(e) {
    e.stopPropagation();
    chapterBackBtn.click();
  };
}

function showQnaList(subj, chap) {
  sessionState.subjectId = subj.id;
  sessionState.chapterId = chap.id;
  sessionState.qnaMode = true;
  saveSessionState();
  showActivity('chapterQna');
  qnaSubjectTitle.textContent = subj.title;
  qnaChapterTitle.textContent = chap.title;
  qnaList.innerHTML = '';
  if (chap.qna && chap.qna.length) {
    chap.qna.forEach(qa => {
      const div = document.createElement('div');
      div.className = 'qna-card';
      div.innerHTML = `<div class="question"><i class="fas fa-question"></i> ${qa.q}</div><div class="answer"><i class="fas fa-arrow-right"></i> ${qa.a}</div>`;
      qnaList.appendChild(div);
    });
  } else {
    qnaList.innerHTML = '<div style="color:#888;padding:18px;">কোন প্রশ্ন পাওয়া যায়নি</div>';
  }
  qnaBackBtn.onclick = function() {
    sessionState.qnaMode = false;
    saveSessionState();
    showActivity('subject');
    subjectList.classList.add('hidden');
    chapterSection.classList.remove('hidden');
    chapterList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
    if(sessionState.chapterId) {
      let chapIdx = subj.chapters.findIndex(c => c.id === sessionState.chapterId);
      if (chapIdx !== -1) chapterList.children[chapIdx].classList.add('active');
    }
  };
  qnaBackBtn.querySelector('i').onclick = function(e) {
    e.stopPropagation();
    qnaBackBtn.click();
  };
}

function restoreSubjectSession() {
  let subj = subjectData.find(s => s.id === sessionState.subjectId);
  if (!subj) {
    sessionState.subjectId = null;
    sessionState.chapterId = null;
    sessionState.qnaMode = false;
    saveSessionState();
    renderSubjectList();
    subjectList.classList.remove('hidden');
    chapterSection.classList.add('hidden');
    return;
  }
  renderSubjectList();
  if (sessionState.chapterId) {
    let chap = subj.chapters.find(c => c.id === sessionState.chapterId);
    if (sessionState.qnaMode && chap) {
      showQnaList(subj, chap);
    } else {
      showChapterList(subj);
    }
    subjectList.classList.add('hidden');
    chapterSection.classList.remove('hidden');
  } else {
    subjectList.classList.remove('hidden');
    chapterSection.classList.add('hidden');
  }
}

function showActivity(id) {
  activities.forEach(div => {
    if (div.id === id) {
      div.classList.add('active');
      div.classList.remove('hidden');
    } else {
      div.classList.remove('active');
      div.classList.add('hidden');
    }
  });
  if(id === 'profile') {
    renderProfileInfo();
    logoutBtn.classList.add('show');
  } else {
    logoutBtn.classList.remove('show');
  }
  if (id === 'subject') {
    restoreSubjectSession();
  } else {
    chapterSection.classList.add('hidden');
    subjectList.classList.remove('hidden');
  }
  document.querySelectorAll('.list-view li').forEach(el => el.classList.remove('active'));
  if(id === 'subject' && sessionState.subjectId) {
    let subjIdx = subjectData.findIndex(s => s.id === sessionState.subjectId);
    if (subjIdx !== -1) subjectList.children[subjIdx].classList.add('active');
    let subj = subjectData[subjIdx];
    if (sessionState.chapterId && subj) {
      let chapIdx = subj.chapters.findIndex(c => c.id === sessionState.chapterId);
      if (chapIdx !== -1) chapterList.children[chapIdx].classList.add('active');
    }
  }
}

function tryNavigateActivity(id, showAlert) {
  if (!isLoggedIn) {
    if (showAlert) showAuthAlert('আপনি লগইন করেননি। দয়া করে প্রথমে লগইন করুন।');
    showLoginOnly();
    return false;
  }
  navs.forEach(n => {
    if (n.dataset.activity === id) n.classList.add('active');
    else n.classList.remove('active');
  });
  drawerMenuBtns.forEach(b => {
    if (b.dataset.activity === id) b.classList.add('active');
    else b.classList.remove('active');
  });
  showActivity(id);
  hideAuthAlert();
  return true;
}

function showLoginOnly() {
  loginDiv.style.display = 'block';
  loginDiv.classList.add('active');
  mainAppDiv.style.display = 'none';
  bottomNav.style.display = 'none';
  openDrawerBtn.style.display = 'none';
  drawer.classList.remove("active");
  drawerBackdrop.classList.remove("active");
}

function renderQnA(chapter) {
  qnaBlock.innerHTML = '';
  (qnaData[chapter] || []).forEach(qa => {
    const div = document.createElement('div');
    div.className = 'qna-card';
    div.innerHTML = `<div class="question"><i class="fas fa-question"></i> ${qa.q}</div><div class="answer"><i class="fas fa-arrow-right"></i> ${qa.a}</div>`;
    qnaBlock.appendChild(div);
  });
}
chapterSelect.addEventListener('change', () => renderQnA(chapterSelect.value));
renderQnA(chapterSelect.value);

logoutBtn.onclick = function() {
  isLoggedIn = false;
  eraseCookie("onepageapp_loggedin");
  sessionState = { subjectId: null, chapterId: null, qnaMode: false };
  saveSessionState();
  loginDiv.classList.add('active');
  loginDiv.style.display = 'block';
  mainAppDiv.style.display = 'none';
  loginForm.reset();
  bottomNav.style.display = 'none';
  openDrawerBtn.style.display = 'none';
  drawer.classList.remove("active");
  drawerBackdrop.classList.remove("active");
  activities.forEach((div, i) => {
    if (i === 0) div.classList.add('active');
    else div.classList.remove('active');
    div.classList.add('hidden');
  });
  activities[0].classList.remove('hidden');
  navs.forEach(n => n.classList.remove('active'));
  navs[0].classList.add('active');
  drawerMenuBtns.forEach(n => n.classList.remove('active'));
  drawerMenuBtns[0].classList.add('active');
  hideAuthAlert();
  document.querySelectorAll('.list-view li').forEach(el => el.classList.remove('active'));
};

function showAuthAlert(msg) {
  authAlert.textContent = msg;
  authAlert.classList.add('active');
}
function hideAuthAlert() {
  authAlert.textContent = '';
  authAlert.classList.remove('active');
}

loginForm.onsubmit = function(e) {
  e.preventDefault();
  const user = loginForm.username.value.trim();
  const pass = loginForm.password.value;
  if (user === demoUser.username && pass === demoUser.password) {
    isLoggedIn = true;
    setCookie("onepageapp_loggedin", "yes", 7);
    sessionState = { subjectId: null, chapterId: null, qnaMode: false };
    saveSessionState();
    loginDiv.classList.remove('active');
    loginDiv.style.display = 'none';
    mainAppDiv.style.display = 'block';
    bottomNav.style.display = 'flex';
    appBar.querySelector('.drawer-menu-btn').style.display = '';
    drawer.classList.remove("active");
    drawerBackdrop.classList.remove("active");
    dashboardUsername.textContent = demoUser.username;
    renderProfileInfo();
    navs.forEach(n => n.classList.remove('active'));
    navs[0].classList.add('active');
    drawerMenuBtns.forEach(n => n.classList.remove('active'));
    drawerMenuBtns[0].classList.add('active');
    showActivity('dashboard');
    hideAuthAlert();
    renderSubjectList();
    document.querySelectorAll('.list-view li').forEach(el => el.classList.remove('active'));
  } else {
    showAuthAlert('ভুল ইউজারনেম বা পাসওয়ার্ড! (student / 1234)');
  }
};

function autoLoginCheck() {
  if(getCookie("onepageapp_loggedin") === "yes") {
    isLoggedIn = true;
    loginDiv.classList.remove('active');
    loginDiv.style.display = 'none';
    mainAppDiv.style.display = 'block';
    bottomNav.style.display = 'flex';
    appBar.querySelector('.drawer-menu-btn').style.display = '';
    dashboardUsername.textContent = demoUser.username;
    renderProfileInfo();
    navs.forEach(n => n.classList.remove('active'));
    navs[0].classList.add('active');
    drawerMenuBtns.forEach(n => n.classList.remove('active'));
    drawerMenuBtns[0].classList.add('active');
    showActivity('dashboard');
    hideAuthAlert();
    renderSubjectList();
    document.querySelectorAll('.list-view li').forEach(el => el.classList.remove('active'));
  } else {
    isLoggedIn = false;
    showLoginOnly();
  }
}
autoLoginCheck();
renderSubjectList();
/* ===========================
   PSY SUPPORT — app.js
   Фичи:
     1. Тёмная тема (localStorage + prefers-color-scheme)
     2. Модал "Срочно успокоиться" (советы + аудио)
     3. Экспорт дневника в CSV
   =========================== */

// ─────────────────────────────────────────
// ДАННЫЕ
// ─────────────────────────────────────────

const STORAGE_KEYS = {
  user:    'psy_user',      // имя пользователя
  entries: 'psy_entries',  // массив записей дневника
  theme:   'psy_theme',    // 'light' | 'dark'
};

// YouTube-медитации (замените id при необходимости)
const MEDITATIONS_CATEGORIES = [
  {
    categoryTitle: 'Для снятия стресса и понижения тревоги',
    items: [
      { id: 'inpok4MKVLM', title: 'Медитация для снятия стресса', duration: '5 мин' },
      { id: 'ZToicYcHIOU', title: 'Дыхательная практика 4-7-8', duration: '10 мин' }
    ]
  },
  {
    categoryTitle: 'Для улучшения сна',
    items: [
      { id: 'aXItOY0sLRY', title: 'Расслабление перед сном', duration: '10 мин' }
    ]
  },
  {
    categoryTitle: 'Успокайвающие звуки',
    items: [
      { id: 'Zhq_ThHG2gA', title: 'Шум дождя по старой крыше', duration: '10 мин' },
      { id: '1ZYbU82GVz4', title: 'Концентрация и спокойствие', duration: '3 часа' }
    ]
  },
  {
    categoryTitle: 'Быстрые практики',
    items: [
      { id: 'dQw4w9WgXcQ', title: 'Минутка тишины', duration: '3 мин' }
    ]
  }
];

// Плоский массив всех медитаций для случайного выбора
const MEDITATIONS = MEDITATIONS_CATEGORIES.flatMap(category => category.items);

// Варианты для модала "Срочно":
//   type 'tip'   — текстовый совет (content — HTML)
//   type 'audio' — случайное видео из MEDITATIONS
const CALM_OPTIONS = [
  {
    type:    'tip',
    title:   '🫁 Дыхание 4-7-8',
    content: `Вдох через нос — <strong>4 секунды</strong>.<br>
              Задержи дыхание — <strong>7 секунд</strong>.<br>
              Медленный выдох через рот — <strong>8 секунд</strong>.<br><br>
              Повтори 3–4 раза. Активирует парасимпатическую нервную систему.`,
  },
  {
    type:    'tip',
    title:   '👀 Правило 5-4-3-2-1',
    content: `Назови вслух или про себя:<br>
              • <strong>5</strong> вещей, которые ты видишь<br>
              • <strong>4</strong> вещи, которые можешь потрогать<br>
              • <strong>3</strong> звука, которые слышишь<br>
              • <strong>2</strong> запаха (или вспомни любимые)<br>
              • <strong>1</strong> вкус<br><br>
              Это возвращает внимание в настоящий момент.`,
  },
  {
    type:    'tip',
    title:   '✊ Прогрессивное расслабление',
    content: `Сожми кулаки изо всех сил — <strong>5 секунд</strong>, резко разожми.<br>
              Почувствуй тепло и расслабление в руках.<br><br>
              Плечи: подними к ушам — <strong>5 секунд</strong>, резко опусти.<br><br>
              Ноги: напряги мышцы — <strong>5 секунд</strong>, расслабь.<br>
              Напряжение уходит с каждым выдохом.`,
  },
  {
    type:    'tip',
    title:   '❄️ Холодная вода',
    content: `Подержи <strong>запястья под холодной водой</strong> 30–60 секунд.<br><br>
              Или умойся холодной водой.<br><br>
              Это активирует рефлекс ныряльщика: ЧСС снижается,
              уровень тревоги падает буквально за минуту.`,
  },
  {
    type:    'audio', // id выбирается случайно из MEDITATIONS
    title:   '🎧 Медитация',
    id:      null,
  },
];


// ─────────────────────────────────────────
// ТЁМНАЯ ТЕМА
// ─────────────────────────────────────────

/** Определить начальную тему:
 *  1. localStorage → 2. prefers-color-scheme → 3. 'light' */
function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Применить тему: data-theme на <html>, иконка на кнопке */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/** Переключить и сохранить */
function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEYS.theme, next);
  applyTheme(next);
}

// Применяем тему ДО загрузки DOM — убирает "мигание" белого фона
applyTheme(getInitialTheme());


// ─────────────────────────────────────────
// УТИЛИТЫ
// ─────────────────────────────────────────

/** Всплывающее уведомление */
function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function getCurrentUser()  { return localStorage.getItem(STORAGE_KEYS.user); }
function requireAuth()     { if (!getCurrentUser()) window.location.href = 'login.html'; }
function logout()          { localStorage.removeItem(STORAGE_KEYS.user); window.location.href = 'index.html'; }
function escapeHtml(str)   { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/** Подсветить текущую страницу в навигации */
function highlightNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}


// ─────────────────────────────────────────
// АВТОРИЗАЦИЯ
// ─────────────────────────────────────────

function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  // Уже залогинен — сразу на дашборд
  if (getCurrentUser()) { window.location.href = 'dashboard.html'; return; }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('login-name').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    if (name.length < 2 || !pass) { showToast('Введите имя и пароль'); return; }

    localStorage.setItem(STORAGE_KEYS.user, name);
    showToast(`Добро пожаловать, ${name}! 🌿`);
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
  });
}


// ─────────────────────────────────────────
// ДНЕВНИК ЭМОЦИЙ
// ─────────────────────────────────────────

function getEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.entries)) || []; }
  catch { return []; }
}

function saveEntry(text, moodScore) {
  const entries = getEntries();
  entries.unshift({
    id:   Date.now(),
    text,
    moodScore,
    date: new Date().toLocaleString('ru-RU', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
  });
  localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
}

function deleteEntry(id) {
  const entries = getEntries().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
  renderEntries();
}

// Цвет бейджа настроения
function moodColor(m) {
  if (m <= 2) return '#C97D7D';   // плохо
  if (m === 3) return '#D4A857';   // средне
  return '#7A9E7E';               // хорошо
}

// Эмодзи настроения
function getMoodEmoji(m) {
  const emojis = ['☹️', '🙁', '😐', '🙂', '😊'];
  return emojis[m - 1] || '😐';
}

// Конвертация старого mood (1-10) в moodScore (1-5)
function convertMoodToScore(m) {
  if (m <= 2) return 1;
  if (m <= 4) return 2;
  if (m === 5) return 3;
  if (m <= 8) return 4;
  return 5;
}

function renderEntries() {
  const list = document.getElementById('entries-list');
  if (!list) return;

  const entries = getEntries();
  if (!entries.length) {
    list.innerHTML = '<p style="color:var(--muted);text-align:center;padding:24px 0;">Записей пока нет. Напишите первую! 🌱</p>';
    return;
  }

  list.innerHTML = entries.map(e => {
    const moodScore = e.moodScore || convertMoodToScore(e.mood);
    return `
    <div class="entry-card">
      <div class="entry-mood-badge" style="background:${moodColor(moodScore)}">${getMoodEmoji(moodScore)}</div>
      <div class="entry-body">
        <div class="entry-text">${escapeHtml(e.text)}</div>
        <div class="entry-date">${e.date}</div>
      </div>
      <button onclick="deleteEntry(${e.id})" title="Удалить запись"
        style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:1.1rem;padding:4px 8px;flex-shrink:0;">✕</button>
    </div>
  `}).join('');
}

function initDiary() {
  let currentMood = 3; // начальное настроение — средне

  const form = document.getElementById('diary-form');
  if (!form) return;

  // Обработчики для шкалы настроения
  document.querySelectorAll('#mood-selector .mood-emoji').forEach(emoji => {
    emoji.addEventListener('click', () => {
      document.querySelectorAll('#mood-selector .mood-emoji').forEach(e => e.classList.remove('selected'));
      emoji.classList.add('selected');
      currentMood = parseInt(emoji.dataset.mood);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('diary-text').value.trim();
    if (!text) { showToast('Напишите что-нибудь 🙏'); return; }

    saveEntry(text, currentMood);

    // Сброс формы
    document.getElementById('diary-text').value = '';
    // Сброс настроения к среднему
    document.querySelectorAll('#mood-selector .mood-emoji').forEach(e => e.classList.remove('selected'));
    document.querySelector('#mood-selector .mood-emoji[data-mood="3"]').classList.add('selected');
    currentMood = 3;
    showToast('Запись сохранена ✓');
    renderEntries();
  });

  renderEntries();
}


// ─────────────────────────────────────────
// МОДАЛЬНОЕ ОКНО — СРОЧНО УСПОКОИТЬСЯ
// ─────────────────────────────────────────

/** Открыть модал: заполнить заголовок, контент */
function openModal(option) {
  const overlay = document.getElementById('calm-modal');
  if (!overlay) return;

  overlay.querySelector('.modal-title').textContent = option.title;

  const tipBlock   = overlay.querySelector('.modal-tip');
  const videoBlock = overlay.querySelector('.modal-video');

  if (option.type === 'tip') {
    tipBlock.innerHTML     = option.content;
    tipBlock.style.display = 'block';
    videoBlock.style.display = 'none';
    videoBlock.innerHTML   = ''; // очищаем возможный старый iframe

  } else if (option.type === 'audio') {
    // Выбрать случайный YouTube ID
    const videoId = option.id || MEDITATIONS[Math.floor(Math.random() * MEDITATIONS.length)].id;
    videoBlock.innerHTML   = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        title="Медитация">
      </iframe>`;
    videoBlock.style.display = 'block';
    tipBlock.style.display   = 'none';
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // запрет прокрутки фона
}

/** Закрыть модал и остановить видео */
function closeModal() {
  const overlay = document.getElementById('calm-modal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  // Очищаем src iframe, чтобы остановить воспроизведение
  const iframe = overlay.querySelector('iframe');
  if (iframe) iframe.src = '';
}

/** Выбрать случайный вариант и открыть */
function pickAndOpenCalmOption() {
  const option = { ...CALM_OPTIONS[Math.floor(Math.random() * CALM_OPTIONS.length)] };
  if (option.type === 'audio') {
    const med    = MEDITATIONS[Math.floor(Math.random() * MEDITATIONS.length)];
    option.id    = med.id;
    option.title = `🎧 ${med.title}`;
  }
  openModal(option);
}

function initEmergencyButton() {
  // Кнопка на странице
  const btn = document.getElementById('emergency-btn');
  if (btn) btn.addEventListener('click', pickAndOpenCalmOption);

  // Кнопка "Ещё совет" внутри модала
  const nextBtn = document.getElementById('modal-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      closeModal();
      setTimeout(pickAndOpenCalmOption, 200); // небольшая задержка для анимации
    });
  }

  // Кнопка × внутри модала
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Клик на затемнение (вне окна) — закрыть
  const overlay = document.getElementById('calm-modal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Escape — закрыть
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}


// ─────────────────────────────────────────
// ЭКСПОРТ ДНЕВНИКА В CSV
// ─────────────────────────────────────────

function exportDiaryCSV() {
  const entries = getEntries();

  if (!entries.length) {
    showToast('Дневник пуст — нечего экспортировать');
    return;
  }

  // BOM \uFEFF — нужен для корректной кириллицы в Excel
  const BOM  = '\uFEFF';
  const rows = [
    ['Дата', 'Настроение', 'Запись'],  // заголовок
    ...entries.map(e => [
      e.date,
      e.mood,
      // Экранируем кавычки по стандарту CSV
      `"${String(e.text).replace(/"/g, '""')}"`,
    ]),
  ];

  const csv  = BOM + rows.map(row => row.join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const today    = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `diary_emotions_${today}.csv`;

  // Временный элемент <a> для скачивания
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Убираем за собой
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`Экспортировано ${entries.length} зап. → ${filename}`);
}

function initExportButton() {
  const btn = document.getElementById('export-btn');
  if (btn) btn.addEventListener('click', exportDiaryCSV);
}


// ─────────────────────────────────────────
// СТРАНИЦА АУДИО
// ─────────────────────────────────────────

function initAudio() {
  const grid = document.getElementById('audio-grid');
  if (!grid) return;

  grid.innerHTML = MEDITATIONS_CATEGORIES.map(category => `
    <h2 class="category-title">${category.categoryTitle}</h2>
    <div class="category-grid">
      ${category.items.map(item => `
        <div class="audio-card fade-in">
          <iframe class="yt-embed"
            src="https://www.youtube.com/embed/${item.id}?rel=0"
            title="${item.title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
          <div class="audio-card-info">
            <h3>${item.title}</h3>
            <span class="duration">⏱ ${item.duration}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');

  // Автозапуск, если пришли с дашборда
  const params = new URLSearchParams(window.location.search);
  const playId = params.get('play');
  if (playId) {
    grid.querySelectorAll('iframe').forEach(iframe => {
      if (iframe.src.includes(playId)) {
        iframe.src = `https://www.youtube.com/embed/${playId}?autoplay=1&rel=0`;
        iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}


// ─────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────

function initDashboard() {
  requireAuth();
  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = getCurrentUser();

  initDiary();
  initEmergencyButton();
  initExportButton();
}


// ─────────────────────────────────────────
// ТОЧКА ВХОДА
// ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Обновить иконку кнопки после загрузки DOM
  applyTheme(getInitialTheme());

  // Переключатель темы (в nav)
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Кнопка выхода
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });

  highlightNav();

  // Роутинг по имени файла
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'login.html')     initLogin();
  if (page === 'dashboard.html') initDashboard();
  if (page === 'audio.html')     { requireAuth(); initAudio(); }
});

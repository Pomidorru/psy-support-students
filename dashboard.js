/**
 * js/dashboard.js — Psy Support Students
 *
 * ИЗМЕНЕНИЯ:
 * - Добавлена проверка авторизации при загрузке страницы (localStorage 'currentUser')
 * - Фикс переключения login-view / dashboard-view
 * - После показа дашборда вызывается initEmergencyButton() из app.js
 * - Добавлена функция calculateAverageMood() — считает среднее из 'diaryEntries'
 * - Форма diaryForm сохраняет запись и сразу обновляет avgScore
 * - Кнопка logout очищает сессию и показывает экран входа
 *
 * Логика авторизации:
 * - Любое непустое имя + пароль не менее 4 символов → вход (demo-режим)
 * - Для продакшена замените проверку на реальную
 */

(function () {
  'use strict';

  // ------------------------------------------------------------------ helpers
  function showDashboard(username) {
    document.getElementById('login-view').style.display = 'none';
    const dv = document.getElementById('dashboard-view');
    dv.style.display = 'block';

    const wn = document.getElementById('welcome-name');
    if (wn) wn.textContent = 'Привет, ' + username + '!';

    // Инициализируем SOS-кнопку ПОСЛЕ того, как она стала видимой
    if (typeof initEmergencyButton === 'function') {
      initEmergencyButton();
    }

    // Показываем текущий средний балл
    updateAvgScoreDisplay();
  }

  function showLogin() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('login-view').style.display = 'flex';
  }

  // ------------------------------------------------------------------ auth
  function tryLogin(username, password) {
    // Demo-режим: имя непустое + пароль ≥ 4 символа
    if (username.trim().length === 0) return false;
    if (password.length < 4) return false;
    return true;
  }

  // ------------------------------------------------------------------ diary
  function getDiaryEntries() {
    try {
      return JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveDiaryEntry(entry) {
    const entries = getDiaryEntries();
    entries.push(entry);
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }

  function calculateAverageMood() {
    const entries = getDiaryEntries();
    if (entries.length === 0) return null;
    const sum = entries.reduce(function (acc, e) { return acc + Number(e.score); }, 0);
    return (sum / entries.length).toFixed(1);
  }

  function updateAvgScoreDisplay() {
    const el = document.getElementById('avgScore');
    if (!el) return;
    const avg = calculateAverageMood();
    el.textContent = avg !== null ? avg : '—';
  }

  // ------------------------------------------------------------------ init
  document.addEventListener('DOMContentLoaded', function () {

    // 1. Проверка сохранённой сессии
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      showDashboard(savedUser);
    }

    // 2. Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('login-error');

        if (tryLogin(username, password)) {
          localStorage.setItem('currentUser', username.trim());
          if (errorEl) errorEl.style.display = 'none';
          showDashboard(username.trim());
        } else {
          if (errorEl) errorEl.style.display = 'block';
        }
      });
    }

    // 3. Кнопка выхода
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        showLogin();
      });
    }

    // 4. Форма дневника
    const diaryForm = document.getElementById('diaryForm');
    if (diaryForm) {
      diaryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const scoreInput = document.getElementById('moodScore');
        const noteInput  = document.getElementById('diaryNote');
        const score = parseInt(scoreInput.value, 10);

        if (isNaN(score) || score < 1 || score > 10) {
          alert('Введите число от 1 до 10');
          return;
        }

        saveDiaryEntry({
          score: score,
          note: noteInput ? noteInput.value.trim() : '',
          date: new Date().toISOString()
        });

        // Обновить средний балл
        updateAvgScoreDisplay();

        // Сбросить форму
        scoreInput.value = '';
        if (noteInput) noteInput.value = '';

        // Краткое подтверждение
        const btn = diaryForm.querySelector('button[type="submit"]');
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = '✓ Сохранено';
          btn.disabled = true;
          setTimeout(function () {
            btn.textContent = orig;
            btn.disabled = false;
          }, 1500);
        }
      });
    }

  });

})();

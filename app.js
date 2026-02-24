/**
 * app.js — Psy Support Students
 *
 * ИЗМЕНЕНИЯ:
 * - openModal / closeModal управляют и оверлеем (#modal-overlay)
 * - initEmergencyButton: безопасный вызов, проверка на наличие кнопки в DOM
 * - CALM_OPTIONS оставлены, добавлен вариант с медитацией
 */

const CALM_OPTIONS = [
  {
    title: 'Дыхание 4-7-8',
    html: `
      <h3>🌬 Дыхание 4-7-8</h3>
      <p>Это упражнение быстро снижает тревогу:</p>
      <ul>
        <li>Вдох через нос — <strong>4 секунды</strong></li>
        <li>Задержка дыхания — <strong>7 секунд</strong></li>
        <li>Выдох через рот — <strong>8 секунд</strong></li>
      </ul>
      <p>Повторите 3–4 раза. Сосредоточьтесь только на счёте.</p>
    `
  },
  {
    title: 'Медитация 5 минут',
    html: `
      <h3>🧘 Короткая медитация</h3>
      <p>Закройте глаза. Сделайте 3 глубоких вдоха. Почувствуйте своё тело — руки, ноги, спину. Дышите ровно в течение 5 минут, не думая ни о чём конкретном.</p>
    `
  },
  {
    title: 'Техника 5-4-3-2-1',
    html: `
      <h3>👁 Техника заземления 5-4-3-2-1</h3>
      <p>Назовите вслух или про себя:</p>
      <ul>
        <li><strong>5</strong> вещей, которые вы <em>видите</em></li>
        <li><strong>4</strong> вещи, которые вы <em>слышите</em></li>
        <li><strong>3</strong> вещи, которые <em>чувствуете на ощупь</em></li>
        <li><strong>2</strong> запаха вокруг</li>
        <li><strong>1</strong> вкус во рту</li>
      </ul>
    `
  }
];

function openModal(htmlContent) {
  const modal = document.getElementById('calm-modal');
  const overlay = document.getElementById('modal-overlay');
  const body = document.getElementById('modal-body');
  if (!modal || !overlay || !body) { console.error('openModal: элементы не найдены'); return; }
  body.innerHTML = htmlContent;
  overlay.style.display = 'block';
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('calm-modal');
  const overlay = document.getElementById('modal-overlay');
  if (modal) modal.style.display = 'none';
  if (overlay) overlay.style.display = 'none';
}

function pickAndOpenCalmOption() {
  const idx = Math.floor(Math.random() * CALM_OPTIONS.length);
  openModal(CALM_OPTIONS[idx].html);
}

function initEmergencyButton() {
  let btn = document.getElementById('emergency-btn');
  if (!btn) return; // кнопка скрыта или ещё не в DOM
  // Сбрасываем возможные дублирующие обработчики
  const fresh = btn.cloneNode(true);
  btn.parentNode.replaceChild(fresh, btn);
  fresh.addEventListener('click', pickAndOpenCalmOption);
}

document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('close-modal-btn');
  const overlay  = document.getElementById('modal-overlay');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
});

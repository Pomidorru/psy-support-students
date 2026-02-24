// js/dashboard.js — логика для dashboard.html

// Функция для расчёта и обновления среднего настроения
function calculateAverageMood() {
  try {
    // Читаем записи из localStorage (ключ 'psy_entries' как в app.js)
    const entries = JSON.parse(localStorage.getItem('psy_entries') || '[]');
    
    if (entries.length === 0) {
      // Если записей нет — показываем "—"
      document.getElementById('avgScore').textContent = '—';
      document.getElementById('moodMessage').textContent = 'Нет записей. Добавь первую!';
      return;
    }
    
    // Суммируем все moodScale (поле в записях)
    const sum = entries.reduce((acc, entry) => acc + (entry.moodScale || 0), 0);
    // Считаем среднее и округляем до 1 знака
    const avg = (sum / entries.length).toFixed(1);
    
    // Обновляем отображение балла
    const scoreEl = document.getElementById('avgScore');
    scoreEl.textContent = avg;
    
    // Определяем цвет и сообщение
    const messageEl = document.getElementById('moodMessage');
    if (avg >= 8) {
      scoreEl.style.color = 'green';
      messageEl.textContent = 'Отличный вайб 🌟';
    } else if (avg >= 6) {
      scoreEl.style.color = 'orange';
      messageEl.textContent = 'Нормально 😊';
    } else {
      scoreEl.style.color = 'red';
      messageEl.textContent = 'Позаботься о себе ❤️';
    }
  } catch (error) {
    console.error('Ошибка чтения localStorage:', error);
    document.getElementById('avgScore').textContent = 'Ошибка';
    document.getElementById('moodMessage').textContent = 'Ошибка данных';
  }
}

// При загрузке страницы — считаем среднее
document.addEventListener('DOMContentLoaded', function() {
  calculateAverageMood();
});

// После отправки формы дневника — пересчитываем среднее
document.getElementById('diaryForm').addEventListener('submit', function(event) {
  // Предполагаем, что форма обрабатывается отдельно, здесь только обновляем среднее
  // Если нужно, можно добавить задержку setTimeout, но для простоты сразу
  setTimeout(calculateAverageMood, 100); // Небольшая задержка, чтобы localStorage обновился
});
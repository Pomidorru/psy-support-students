/* ===========================
   ТЕСТЫ НА СТРЕСС И ТРЕВОГУ
   =========================== */

// ─────────────────────────────────────────
// ДАННЫЕ ТЕСТОВ
// ─────────────────────────────────────────

// PSS-10: Шкала воспринимаемого стресса
const PSS10_DATA = {
  id: 'pss10',
  title: '📊 Шкала воспринимаемого стресса PSS-10',
  description: '10 вопросов о том, как часто вы испытываете стресс',
  questions: [
    { 
      text: 'В прошедшем месяце, как часто вы чувствовали себя расстроенным или напряженным?',
      reverse: false 
    },
    { 
      text: 'В прошедшем месяце, как часто вы чувствовали, что не можете справиться с необходимыми вам делами?',
      reverse: false 
    },
    { 
      text: 'В прошедшем месяце, как часто вы чувствовали себя нервным и подверженным стрессу?',
      reverse: false 
    },
    { 
      text: 'В прошедшем месяце, как часто вы уверены были в своей способности справиться с личными проблемами?',
      reverse: true  // Обратный пункт
    },
    { 
      text: 'В прошедшем месяце, как часто вы чувствовали, что события развиваются по вашему сценарию?',
      reverse: true  // Обратный пункт
    },
    { 
      text: 'В прошедшем месяце, как часто вы обнаруживали, что не можете справиться со всем, что вам нужно做?',
      reverse: false 
    },
    { 
      text: 'В прошедшем месяце, как часто вы способны были контролировать раздражение в своей жизни?',
      reverse: true  // Обратный пункт
    },
    { 
      text: 'В прошедшем месяце, как часто вы чувствовали, что не в состоянии контролировать важные события в вашей жизни?',
      reverse: false 
    },
    { 
      text: 'В прошедшем месяце, как часто вы раздражались на вещи вне вашего контроля?',
      reverse: false 
    },
    { 
      text: 'В прошедшем месяце, как часто вы чувствовали, что трудности накапливаются настолько, что вы не можете их преодолеть?',
      reverse: false 
    }
  ],
  options: [
    { label: 'Никогда', value: 0 },
    { label: 'Почти никогда', value: 1 },
    { label: 'Иногда', value: 2 },
    { label: 'Довольно часто', value: 3 },
    { label: 'Очень часто', value: 4 }
  ],
  interpret: (score) => {
    if (score <= 13) {
      return {
        level: 'низкий',
        emoji: '🟢',
        text: 'Ваш уровень стресса низкий. Продолжайте в том же духе и заботьтесь о своем благополучии.',
        color: '#7A9E7E'
      };
    } else if (score <= 26) {
      return {
        level: 'средний',
        emoji: '🟡',
        text: 'Ваш уровень стресса средний. Попробуйте использовать релаксационные техники и медитацию для снижения стресса.',
        color: '#D4A857'
      };
    } else {
      return {
        level: 'высокий',
        emoji: '🔴',
        text: 'Ваш уровень стресса высокий. Рекомендуется обратиться к специалисту и активнее использовать методы релаксации.',
        color: '#C97D7D'
      };
    }
  }
};

// HADS: Госпитальная шкала тревоги (субшкала тревоги)
const HADS_DATA = {
  id: 'hads',
  title: '😰 HADS — Госпитальная шкала тревоги',
  description: '7 вопросов для оценки уровня тревоги (субшкала тревоги)',
  questions: [
    { text: 'Я чувствую напряженность или скованность', reverse: false },
    { text: 'Я испытываю внезапные приступы паники', reverse: false },
    { text: 'Я беспокойно впадаю в панику по несущественным поводам', reverse: false },
    { text: 'Я не в состоянии усидеть спокойно дома', reverse: false },
    { text: 'Я чувствую предчувствие чего-то ужасного', reverse: false },
    { text: 'Я блуждаю взглядом без сосредоточения, занимаю себя чем-то бессмысленным', reverse: false },
    { text: 'Я не чувствую себя спокойным и расслабленным', reverse: false }
  ],
  options: [
    { label: 'Совсем нет', value: 0 },
    { label: 'Немного', value: 1 },
    { label: 'Значительно', value: 2 },
    { label: 'Очень сильно', value: 3 }
  ],
  interpret: (score) => {
    if (score <= 7) {
      return {
        level: 'норма',
        emoji: '🟢',
        text: 'Ваш уровень тревоги в норме. Все хорошо!',
        color: '#7A9E7E'
      };
    } else if (score <= 10) {
      return {
        level: 'пограничная',
        emoji: '🟡',
        text: 'Ваш уровень тревоги пограничный. Стоит обратить внимание на свое состояние.',
        color: '#D4A857'
      };
    } else {
      return {
        level: 'выраженная',
        emoji: '🔴',
        text: 'Ваш уровень тревоги выраженный. Рекомендуется консультация со специалистом.',
        color: '#C97D7D'
      };
    }
  }
};

// Список всех доступных тестов
const AVAILABLE_TESTS = [
  {
    id: 'pss10',
    title: '📊 Шкала воспринимаемого стресса PSS-10',
    description: 'Оцените ваш уровень стресса за последний месяц',
    questions: 10,
    link: 'pss10.html'
  },
  {
    id: 'hads',
    title: '😰 HADS — Госпитальная шкала тревоги',
    description: 'Субшкала для оценки уровня тревожности',
    questions: 7,
    link: 'hads.html'
  }
];

// ─────────────────────────────────────────
// ФУНКЦИИ ДЛЯ ОТРИСОВКИ СПИСКА ТЕСТОВ
// ─────────────────────────────────────────

function renderTestsGrid() {
  const grid = document.getElementById('tests-grid');
  if (!grid) return;

  grid.innerHTML = AVAILABLE_TESTS.map(test => `
    <div class="test-card card fade-in">
      <h3 style="margin: 0 0 8px 0;">${test.title}</h3>
      <p style="margin: 0 0 12px 0; color: var(--muted); font-size: 0.95rem;">${test.description}</p>
      <p style="margin: 0 0 16px 0; color: var(--muted); font-size: 0.85rem;">❓ ${test.questions} вопросов</p>
      <a href="${test.link}" class="btn btn-primary" style="display: inline-block;">Начать тест</a>
    </div>
  `).join('');
}

// ─────────────────────────────────────────
// PSS-10 ТЕСТ
// ─────────────────────────────────────────

function renderPSS10Test() {
  const container = document.getElementById('test-container');
  if (!container) return;

  // Проверяем, есть ли сохраненные ответы
  const savedAnswers = sessionStorage.getItem('pss10_answers');
  if (savedAnswers && sessionStorage.getItem('pss10_result')) {
    // Показываем результат
    showPSS10Result(container);
    return;
  }

  // Показываем форму теста
  const answersArray = JSON.parse(savedAnswers || '[]');

  container.innerHTML = `
    <div style="max-width: 700px; margin: 0 auto;">
      <h1>📊 Шкала воспринимаемого стресса PSS-10</h1>
      <p style="color: var(--muted); margin-bottom: 24px;">
        10 вопросов о том, как часто вы испытываете стресс в повседневной жизни.
      </p>

      <form id="pss10-form" style="display: grid; gap: 20px;">
        ${PSS10_DATA.questions.map((q, idx) => `
          <div class="question-block" style="padding: 16px; background: var(--bg-card); border: 1px solid var(--warm); border-radius: 8px;">
            <p style="margin: 0 0 12px 0; font-weight: 600;">
              <span style="color: var(--muted); font-size: 0.9rem;">Вопрос ${idx + 1} из ${PSS10_DATA.questions.length}</span><br>
              ${q.text}
            </p>
            <div id="q${idx}-options" style="display: grid; gap: 8px;">
              ${PSS10_DATA.options.map(opt => `
                <label style="display: flex; align-items: center; cursor: pointer;">
                  <input type="radio" name="q${idx}" value="${opt.value}" style="margin-right: 8px; cursor: pointer;">
                  <span>${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <button type="submit" class="btn btn-primary" style="padding: 14px 28px; font-size: 1rem;">
          ✓ Завершить тест
        </button>
      </form>
    </div>
  `;

  // Обработчик отправки формы
  const form = container.querySelector('#pss10-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const answers = [];
      let allAnswered = true;

      PSS10_DATA.questions.forEach((_, idx) => {
        const selected = form.querySelector(`input[name="q${idx}"]:checked`);
        if (!selected) {
          allAnswered = false;
          return;
        }
        answers.push(parseInt(selected.value));
      });

      if (!allAnswered) {
        showToast('Ответьте на все вопросы');
        return;
      }

      // Вычисляем баллы с учетом обратных пунктов
      let score = 0;
      answers.forEach((answer, idx) => {
        if (PSS10_DATA.questions[idx].reverse) {
          score += (4 - answer); // Инвертируем баллы для обратных пунктов
        } else {
          score += answer;
        }
      });

      // Сохраняем результат
      sessionStorage.setItem('pss10_answers', JSON.stringify(answers));
      sessionStorage.setItem('pss10_result', score);

      // Показываем результат
      showPSS10Result(container);
    });
  }
}

function showPSS10Result(container) {
  const score = parseInt(sessionStorage.getItem('pss10_result') || '0');
  const interpretation = PSS10_DATA.interpret(score);

  container.innerHTML = `
    <div style="max-width: 700px; margin: 0 auto; text-align: center;">
      <div style="padding: 40px; background: ${interpretation.color}33; border: 2px solid ${interpretation.color}; border-radius: 12px; margin-bottom: 24px;">
        <div style="font-size: 4rem; margin-bottom: 16px;">${interpretation.emoji}</div>
        <h1 style="margin: 0 0 8px 0; color: ${interpretation.color};">Ваш результат: ${score} баллов</h1>
        <p style="margin: 0 0 12px 0; font-size: 1.1rem; color: ${interpretation.color}; font-weight: 600;">
          Уровень стресса: <strong>${interpretation.level.toUpperCase()}</strong>
        </p>
        <p style="margin: 0; color: var(--text); font-size: 0.95rem; line-height: 1.5;">
          ${interpretation.text}
        </p>
      </div>

      <div style="display: grid; gap: 12px; margin-bottom: 24px;">
        <p style="margin: 0; color: var(--muted); font-size: 0.85rem;">
          <strong>Шкала:</strong> 0–13 = низкий, 14–26 = средний, 27–40 = высокий стресс
        </p>
      </div>

      <div style="display: grid; gap: 12px; margin-bottom: 24px;">
        <a href="dashboard.html" class="btn btn-primary">📓 Записать эмоции в дневник</a>
        <a href="audio.html" class="btn btn-outline">🎧 Послушать медитацию</a>
        <a href="tests.html" class="btn btn-outline">← Вернуться к тестам</a>
      </div>

      <button onclick="resetPSS10Test()" class="btn btn-outline" style="width: 100%;">
        🔄 Пройти тест заново
      </button>
    </div>
  `;
}

function resetPSS10Test() {
  sessionStorage.removeItem('pss10_answers');
  sessionStorage.removeItem('pss10_result');
  renderPSS10Test();
}

// ─────────────────────────────────────────
// HADS ТЕСТ
// ─────────────────────────────────────────

function renderHADSTest() {
  const container = document.getElementById('test-container');
  if (!container) return;

  // Проверяем, есть ли сохраненные ответы
  const savedResult = sessionStorage.getItem('hads_result');
  if (savedResult) {
    showHADSResult(container);
    return;
  }

  container.innerHTML = `
    <div style="max-width: 700px; margin: 0 auto;">
      <h1>😰 HADS — Госпитальная шкала тревоги</h1>
      <p style="color: var(--muted); margin-bottom: 24px;">
        7 вопросов для оценки уровня вашей тревожности.
      </p>

      <form id="hads-form" style="display: grid; gap: 20px;">
        ${HADS_DATA.questions.map((q, idx) => `
          <div class="question-block" style="padding: 16px; background: var(--bg-card); border: 1px solid var(--warm); border-radius: 8px;">
            <p style="margin: 0 0 12px 0; font-weight: 600;">
              <span style="color: var(--muted); font-size: 0.9rem;">Вопрос ${idx + 1} из ${HADS_DATA.questions.length}</span><br>
              ${q.text}
            </p>
            <div id="q${idx}-options" style="display: grid; gap: 8px;">
              ${HADS_DATA.options.map(opt => `
                <label style="display: flex; align-items: center; cursor: pointer;">
                  <input type="radio" name="q${idx}" value="${opt.value}" style="margin-right: 8px; cursor: pointer;">
                  <span>${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <button type="submit" class="btn btn-primary" style="padding: 14px 28px; font-size: 1rem;">
          ✓ Завершить тест
        </button>
      </form>
    </div>
  `;

  const form = container.querySelector('#hads-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const answers = [];
      let allAnswered = true;

      HADS_DATA.questions.forEach((_, idx) => {
        const selected = form.querySelector(`input[name="q${idx}"]:checked`);
        if (!selected) {
          allAnswered = false;
          return;
        }
        answers.push(parseInt(selected.value));
      });

      if (!allAnswered) {
        showToast('Ответьте на все вопросы');
        return;
      }

      const score = answers.reduce((sum, val) => sum + val, 0);

      sessionStorage.setItem('hads_answers', JSON.stringify(answers));
      sessionStorage.setItem('hads_result', score);

      showHADSResult(container);
    });
  }
}

function showHADSResult(container) {
  const score = parseInt(sessionStorage.getItem('hads_result') || '0');
  const interpretation = HADS_DATA.interpret(score);

  container.innerHTML = `
    <div style="max-width: 700px; margin: 0 auto; text-align: center;">
      <div style="padding: 40px; background: ${interpretation.color}33; border: 2px solid ${interpretation.color}; border-radius: 12px; margin-bottom: 24px;">
        <div style="font-size: 4rem; margin-bottom: 16px;">${interpretation.emoji}</div>
        <h1 style="margin: 0 0 8px 0; color: ${interpretation.color};">Ваш результат: ${score} баллов</h1>
        <p style="margin: 0 0 12px 0; font-size: 1.1rem; color: ${interpretation.color}; font-weight: 600;">
          Уровень тревоги: <strong>${interpretation.level.toUpperCase()}</strong>
        </p>
        <p style="margin: 0; color: var(--text); font-size: 0.95rem; line-height: 1.5;">
          ${interpretation.text}
        </p>
      </div>

      <div style="display: grid; gap: 12px; margin-bottom: 24px;">
        <p style="margin: 0; color: var(--muted); font-size: 0.85rem;">
          <strong>Шкала:</strong> 0–7 = норма, 8–10 = пограничная, 11–21 = выраженная тревога
        </p>
      </div>

      <div style="display: grid; gap: 12px; margin-bottom: 24px;">
        <a href="dashboard.html" class="btn btn-primary">📓 Записать эмоции в дневник</a>
        <a href="audio.html" class="btn btn-outline">🎧 Послушать медитацию</a>
        <a href="tests.html" class="btn btn-outline">← Вернуться к тестам</a>
      </div>

      <button onclick="resetHADSTest()" class="btn btn-outline" style="width: 100%;">
        🔄 Пройти тест заново
      </button>
    </div>
  `;
}

function resetHADSTest() {
  sessionStorage.removeItem('hads_answers');
  sessionStorage.removeItem('hads_result');
  renderHADSTest();
}

// ─────────────────────────────────────────
// ИНИЦИАЛИЗАЦИЯ
// ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'tests.html') {
    requireAuth();
    renderTestsGrid();
  }
});

'use strict';

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Открыть меню');
  toggle.textContent = '☰';
  navigation.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  toggle.textContent = open ? '×' : '☰';
  navigation.classList.toggle('is-open', open);
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('header')) closeMenu();

  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  closeMenu();
  // После перехода клавиша Tab продолжает навигацию в выбранном разделе.
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});

window.matchMedia('(max-width: 1100px)').addEventListener('change', (event) => {
  closeMenu();
  if (event.matches && navigation.contains(document.activeElement)) toggle.focus();
});

const form = document.querySelector('#booking-form');
const result = document.querySelector('#form-result');
const customer = document.querySelector('#customer');
const car = document.querySelector('#car-model');
const service = document.querySelector('#service');

function clearResult() {
  result.hidden = true;
  result.textContent = '';
}

function validateText(field) {
  const onlySpaces = field.value.length > 0 && !field.value.trim();
  field.setCustomValidity(onlySpaces ? 'Введите пример текста, а не только пробелы.' : '');
  if (field.validity.valid) field.removeAttribute('aria-invalid');
}

document.querySelectorAll('[data-service]').forEach((card) => {
  card.addEventListener('click', () => {
    service.value = card.dataset.service;
    service.removeAttribute('aria-invalid');
    clearResult();
  });
});

form.addEventListener('invalid', (event) => {
  event.target.setAttribute('aria-invalid', 'true');
}, true);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  validateText(customer);
  validateText(car);
  if (!form.reportValidity()) return;
  // Данные используются только для проверки полей; отправки и хранилища нет.
  form.reset();
  result.textContent = 'Готово! Вы проверили демонстрационную запись. Реальная заявка не создана. Данные не отправлены и не сохранены.';
  result.hidden = false;
  result.scrollIntoView({ block: 'nearest', behavior: 'auto' });
});

form.addEventListener('input', (event) => {
  clearResult();
  if (event.target === customer || event.target === car) validateText(event.target);
  else if (event.target.validity.valid) event.target.removeAttribute('aria-invalid');
});

form.addEventListener('reset', () => {
  [customer, car, service].forEach((field) => {
    field.setCustomValidity('');
    field.removeAttribute('aria-invalid');
  });
  clearResult();
});

// Очищаем примеры при уходе со страницы и возврате из кэша браузера.
window.addEventListener('pagehide', () => form.reset());
window.addEventListener('pageshow', (event) => {
  if (event.persisted) form.reset();
});

// Включаем кнопку только после подключения обработчика, предотвращающего отправку формы.
document.querySelector('#submit-booking').disabled = false;

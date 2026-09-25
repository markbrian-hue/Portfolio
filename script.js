/* Progressive enhancement: the portfolio and direct contact work without JS. */
'use strict';
const form = document.querySelector('#inquiry-form');
const result = document.querySelector('#inquiry-result');
const preview = document.querySelector('#inquiry-preview');
const sendLink = document.querySelector('#inquiry-send');
const editButton = document.querySelector('#edit-inquiry');
// Only expose the builder when JavaScript can prevent native form submission.
form.hidden = false;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const required = [form.elements.name, form.elements.details];
  for (const field of required) {
    field.setCustomValidity(field.value.trim() ? '' : 'Please add a little detail here.');
  }
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const value = (key) => String(fields.get(key) || '').trim();
  const message = [
    `Hi Mark, I’m ${value('name')}.`,
    `I’m looking for: ${value('service')}.`,
    '', value('details'), '',
    `Budget: ${value('budget') || 'To be discussed'}`,
    `Target date: ${value('timing') || 'Flexible / to be discussed'}`,
  ].join('\n');
  // textContent keeps visitor-entered text from being interpreted as HTML.
  preview.textContent = message;
  sendLink.href = `https://wa.me/639935259766?text=${encodeURIComponent(message)}`;
  form.hidden = true;
  result.hidden = false;
  sendLink.focus();
});
form.addEventListener('input', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    event.target.setCustomValidity('');
  }
});
editButton.addEventListener('click', () => {
  result.hidden = true;
  form.hidden = false;
  form.elements.name.focus();
});

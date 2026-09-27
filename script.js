/* Progressive enhancement: the portfolio and direct contact work without JS. */
'use strict';

// Motion is an enhancement: content never depends on a hidden CSS class.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionTokens = getComputedStyle(document.documentElement);
const motionDuration = parseFloat(motionTokens.getPropertyValue('--motion-enter')) || 620;
const motionEase = motionTokens.getPropertyValue('--motion-ease-out').trim() || 'ease-out';
const activeEntrances = new Map();

function playEntrance(element, { delay = 0, duration = motionDuration, distance = 16 } = {}) {
  if (motionPreference.matches || !element.animate || element.contains(document.activeElement)) return;
  activeEntrances.get(element)?.cancel();
  const animation = element.animate(
    [
      { opacity: 0, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    { duration, delay, easing: motionEase, fill: 'backwards' },
  );
  activeEntrances.set(element, animation);
  const cleanUp = () => {
    if (activeEntrances.get(element) === animation) activeEntrances.delete(element);
  };
  animation.addEventListener('finish', cleanUp, { once: true });
  animation.addEventListener('cancel', cleanUp, { once: true });
}

// Keyboard focus always takes priority over an entrance animation.
document.addEventListener('focusin', (event) => {
  for (const [element, animation] of activeEntrances) {
    if (element.contains(event.target)) animation.cancel();
  }
});
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) {
    for (const animation of activeEntrances.values()) animation.cancel();
    activeEntrances.clear();
  }
});

if ('IntersectionObserver' in window) {
  const entranceTargets = document.querySelectorAll([
    '.hero-copy > *', '.hero-aside', '.section-heading',
    '.project-visual', '.project-copy', '.split-section > div:first-child',
    '.service-list article', '.process-list li', '.skills', '.faq-list', '.inquiry-panel',
  ].join(', '));
  const heroItems = [...document.querySelectorAll('.hero-copy > *')];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const heroIndex = heroItems.indexOf(entry.target);
      const delay = heroIndex >= 0 ? Math.min(heroIndex * 55, 165)
        : entry.target.matches('.hero-aside, .project-copy') ? 80 : 0;
      playEntrance(entry.target, { delay });
    }
  }, { threshold: 0.08 });
  entranceTargets.forEach((element) => observer.observe(element));
}

// Keep native details behavior, including keyboard interaction and no-JS support.
document.querySelectorAll('details').forEach((details) => {
  details.addEventListener('toggle', () => {
    for (const child of details.children) {
      if (child.tagName === 'SUMMARY') continue;
      if (details.open) playEntrance(child, { duration: 280, distance: 6 });
      else activeEntrances.get(child)?.cancel();
    }
  });
});

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
  playEntrance(preview, { duration: 280, distance: 6 });
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

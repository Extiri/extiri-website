/* Keep the takeoff inside the hero, clear of the product walkthrough. */
const hero = document.querySelector('.air-hero');
const plane = document.getElementById('plane-transform-group');
const runway = document.getElementById('runway-svg');
const trail = document.getElementById('jet-trail');
const gear = document.getElementById('landing-gear');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrow = window.matchMedia('(max-width: 820px)');
let scheduled = false;

function drawPlane() {
  scheduled = false;
  const progress = reducedMotion.matches ? 0 : Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * .72)));
  const mobile = narrow.matches;
  const distance = Math.pow(progress, .9);
  const x = mobile ? 280 + 660 * distance : 240 + 1310 * distance;
  const y = 710 - 365 * Math.pow(progress, 1.2);
  runway.setAttribute('viewBox', mobile ? '0 400 900 400' : '0 0 1400 800');
  runway.setAttribute('preserveAspectRatio', mobile ? 'xMinYMax meet' : 'xMidYMax slice');
  plane.setAttribute('transform', `translate(${x}, ${y}) rotate(${-24 * progress})`);
  gear.style.opacity = Math.max(0, 1 - 5 * progress);
  trail.style.opacity = Math.min(.7, progress * 2);
  plane.style.opacity = Math.min(1, (1 - progress) * 6);
}

function schedulePlane() {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(drawPlane);
}

window.addEventListener('scroll', schedulePlane, { passive: true });
window.addEventListener('resize', schedulePlane);
reducedMotion.addEventListener('change', schedulePlane);
drawPlane();

/* The chapter links work without scripting. Track which scene is being read. */
const chapterLinks = [...document.querySelectorAll('.air-workflow-index nav a')];
const scenes = chapterLinks.map(link => document.getElementById(link.hash.slice(1)));
const visibleScenes = new Set();
const sceneObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) visibleScenes.add(entry.target);
    else visibleScenes.delete(entry.target);
  }
  const current = scenes.find(scene => visibleScenes.has(scene));
  if (!current) return;
  chapterLinks.forEach((link, index) => {
    if (scenes[index] === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-18% 0px -55% 0px' });
scenes.forEach(scene => sceneObserver.observe(scene));

/* The sample is local to this page. Step outcomes are recorded in order. */
const sample = document.getElementById('sample-run');
const progress = document.getElementById('sample-progress');
const intro = document.getElementById('sample-intro');
const step = document.getElementById('sample-step');
const stepName = document.getElementById('sample-step-name');
const stepDescription = document.getElementById('sample-step-description');
const note = document.getElementById('sample-note');
const record = document.getElementById('sample-record');
const buttons = [...sample.querySelectorAll('[data-run-action]')];
const checks = [
  ['Confirm the build', 'Check that the version and build number match the release you intend to submit.'],
  ['Review the privacy details', 'Compare the privacy manifest with the data collection details shown in App Store Connect.'],
  ['Check the product page', 'Review the screenshots and release notes on the product page before submission.']
];
const results = [];
let started = false;

function showRun() {
  const complete = results.length === checks.length;
  const active = started && !complete;
  intro.hidden = started;
  step.hidden = !active;
  record.hidden = !complete;
  progress.textContent = complete ? 'Run recorded' : active ? `Step ${results.length + 1} of ${checks.length}` : 'Ready to start';

  if (active) {
    [stepName.textContent, stepDescription.textContent] = checks[results.length];
    note.value = '';
  }

  for (const button of buttons) {
    const action = button.dataset.runAction;
    if (action === 'start') button.hidden = started;
    else if (action === 'reset') button.hidden = !started;
    else button.hidden = !active;
  }
}

function addResult(outcome) {
  const item = document.createElement('li');
  const status = document.createElement('span');
  status.textContent = outcome;
  item.append(status, " ", checks[results.length][0]);
  const text = note.value.trim();
  if (text) {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    item.append(paragraph);
  }
  results.push(item);
  record.append(item);
}

sample.addEventListener('submit', event => event.preventDefault());
sample.addEventListener('click', event => {
  const button = event.target.closest('[data-run-action]');
  if (!button) return;
  const action = button.dataset.runAction;
  if (action === 'start') started = true;
  else if (action === 'reset') {
    started = false;
    results.length = 0;
    record.replaceChildren();
  } else {
    addResult(action);
  }

  showRun();
  if (action === 'reset') buttons[0].focus();
  else if (results.length === checks.length) {
    record.tabIndex = -1;
    record.focus();
  } else {
    stepName.tabIndex = -1;
    stepName.focus({ preventScroll: true });
  }
});
showRun();
document.getElementById('sample-controls').hidden = false;

const component = document.getElementById('cm-component');
const framework = document.getElementById('cm-framework');
const prompt = document.getElementById('cm-prompt');
const copy = document.getElementById('cm-copy');
const status = document.getElementById('cm-copy-status');

function renderPrompt() {
  const name = component.value.trim() || 'component';
  prompt.textContent = `Review the ${name} in ${framework.value}. Check keyboard navigation, error states, and accessibility labels.`;
  status.textContent = '';
}

component.addEventListener('input', renderPrompt);
framework.addEventListener('change', renderPrompt);
renderPrompt();

if (navigator.clipboard?.writeText) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(prompt.textContent);
      status.textContent = 'Copied';
    } catch {
      status.textContent = 'Select the prompt to copy it manually.';
    }
  });
}

const rapidoolPipeline = document.querySelector('[data-rd-pipeline]');

if (rapidoolPipeline) {
  const stepper = rapidoolPipeline.querySelector('.rd-stepper');
  const buttons = [...stepper.querySelectorAll('[data-step]')];
  const output = rapidoolPipeline.querySelector('[data-step-output]');
  const label = rapidoolPipeline.querySelector('[data-step-label]');
  const count = rapidoolPipeline.querySelector('[data-step-count]');
  const raw = output.textContent.split('\n');
  const errors = raw.filter(line => line.includes(' ERROR '));
  const steps = {
    input: { label: 'Raw log', lines: raw },
    filter: { label: 'Errors only', lines: errors },
    unique: { label: 'Unique errors', lines: [...new Set(errors)] },
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const step = steps[button.dataset.step];

      for (const candidate of buttons) {
        candidate.setAttribute('aria-pressed', String(candidate === button));
      }

      label.textContent = step.label;
      count.textContent = `${step.lines.length} lines`;
      output.textContent = step.lines.join('\n');
    });
  }

  stepper.hidden = false;
}

const rapidoolInspect = document.querySelector('[data-rd-inspect]');

if (rapidoolInspect) {
  const buttons = [...rapidoolInspect.querySelectorAll('button[aria-controls]')];
  const panels = buttons.map(button => document.getElementById(button.getAttribute('aria-controls')));

  function selectInspector(index) {
    buttons.forEach((button, position) => {
      const selected = index === position;
      button.setAttribute('aria-pressed', String(selected));
      panels[position].hidden = !selected;
    });
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => selectInspector(index));
  });

  selectInspector(0);
  rapidoolInspect.setAttribute('data-ready', '');
}

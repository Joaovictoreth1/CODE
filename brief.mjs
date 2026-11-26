const services = {
  consulting: 'Consultoria em IA',
  development: 'Desenvolvimento de IA',
  integration: 'Integração de sistemas',
};

const stages = {
  idea: 'Explorando uma ideia',
  prototype: 'Com um protótipo',
  production: 'Com um sistema em produção',
};

export function createBrief({ service, goal, stage }) {
  if (!Object.hasOwn(services, service)) {
    return { field: 'service', error: 'Selecione uma área de interesse.' };
  }
  if (typeof goal !== 'string' || !goal.trim() || goal.trim().length > 600) {
    return { field: 'goal', error: 'Descreva o objetivo em até 600 caracteres.' };
  }
  if (stage && !Object.hasOwn(stages, stage)) {
    return { field: 'stage', error: 'Selecione uma etapa da lista ou deixe em branco.' };
  }
  const lines = [
    'Rascunho de projeto',
    `Área: ${services[service]}`,
    stage ? `Etapa: ${stages[stage]}` : 'Etapa: não informada',
    '',
    'Objetivo:',
    goal.trim().replace(/\r\n?/g, '\n'),
  ];
  return { text: lines.join('\n') };
}

function bindBrief(document, clipboard) {
  const form = document.getElementById('brief-form');
  const output = document.getElementById('brief-output');
  const outputTitle = document.getElementById('brief-output-title');
  const text = document.getElementById('brief-text');
  const copyButton = document.getElementById('brief-copy');
  const error = document.getElementById('brief-error');
  const status = document.getElementById('brief-status');
  let invalidField;
  let revision = 0;

  function clearError() {
    if (!invalidField) return;
    invalidField.removeAttribute('aria-invalid');
    invalidField.setAttribute('aria-describedby', invalidField === form.elements.goal ? 'brief-goal-help' : '');
    invalidField = undefined;
    error.textContent = '';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearError();
    const result = createBrief(Object.fromEntries(new FormData(form)));
    if (result.error) {
      invalidField = form.elements.namedItem(result.field);
      invalidField.setAttribute('aria-invalid', 'true');
      const help = invalidField.getAttribute('aria-describedby');
      invalidField.setAttribute('aria-describedby', [help, error.id].filter(Boolean).join(' '));
      error.textContent = result.error;
      invalidField.focus();
      return;
    }

    text.value = result.text;
    status.textContent = '';
    output.hidden = false;
    outputTitle.focus();
  });

  form.addEventListener('input', event => {
    if (event.target === invalidField) clearError();
    revision++;
    status.textContent = '';
    output.hidden = true;
  });

  copyButton.addEventListener('click', async () => {
    const copyRevision = revision;
    copyButton.disabled = true;
    try {
      await clipboard(text.value);
      if (revision === copyRevision) status.textContent = 'Rascunho copiado.';
    } catch {
      if (revision === copyRevision) {
        text.focus();
        text.select();
        status.textContent = 'Não foi possível copiar automaticamente. O texto está selecionado para copiar manualmente.';
      }
    } finally {
      copyButton.disabled = false;
    }
  });

  form.hidden = false;
}

if (typeof document !== 'undefined') {
  bindBrief(document, text => navigator.clipboard.writeText(text));
}

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createBrief } from './brief.mjs';

test('creates a plain-text draft without collecting contact fields', () => {
  assert.deepEqual(createBrief({
    service: 'integration',
    goal: '  Organizar chamados.\r\nTestar em uma equipe. ',
    stage: 'prototype',
    email: 'not-included@example.test',
  }), {
    text: 'Rascunho de projeto\nÁrea: Integração de sistemas\nEtapa: Com um protótipo\n\nObjetivo:\nOrganizar chamados.\nTestar em uma equipe.',
  });
});

test('optional stage can be blank and headings are preserved for manual review', () => {
  const { text } = createBrief({ service: 'development', goal: 'Preparar piloto', stage: '' });
  assert.match(text, /Área: Desenvolvimento de IA/);
  assert.match(text, /Etapa: não informada/);
  assert.match(text, /Objetivo:\nPreparar piloto$/);
});

test('reports the invalid field for missing or out-of-range inputs', () => {
  assert.equal(createBrief({ service: 'constructor', goal: 'Objetivo' }).field, 'service');
  assert.equal(createBrief({ service: 'consulting', goal: '   ' }).field, 'goal');
  assert.equal(createBrief({ service: 'consulting', goal: 'x'.repeat(601) }).field, 'goal');
  assert.ok(createBrief({ service: 'consulting', goal: 'x'.repeat(600) }).text);
  assert.equal(createBrief({ service: 'consulting', goal: 'Objetivo', stage: 'other' }).field, 'stage');
});

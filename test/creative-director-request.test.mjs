import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function loadModule(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

const { createCreativeDirectorProjectId, createDiagnosticRequestKey } = await loadModule('../src/lib/creativeDirectorRequest.js');
const { acquireCreativeDirectorRequest, getCreativeDirectorResult, storeCreativeDirectorResult } = await loadModule('../src/app/api/creative-director/requestGuards.js');

test('first diagnosis has a unique stable request key', () => {
  const projectId = createCreativeDirectorProjectId();
  assert.ok(projectId);
  assert.equal(createDiagnosticRequestKey(projectId, 'pt'), createDiagnosticRequestKey(projectId, 'pt'));
  assert.doesNotMatch(createDiagnosticRequestKey(projectId, 'pt'), /^pending:/);
});

test('immediate repeat returns the completed cached diagnosis', () => {
  const key = createDiagnosticRequestKey(createCreativeDirectorProjectId(), 'pt');
  const result = { diagnostico: 'Teste' };
  storeCreativeDirectorResult(key, result);
  assert.deepEqual(getCreativeDirectorResult(key), result);
});

test('simultaneous duplicate requests are deduplicated by the lock', () => {
  const key = createDiagnosticRequestKey(createCreativeDirectorProjectId(), 'pt');
  const first = acquireCreativeDirectorRequest(key);
  const second = acquireCreativeDirectorRequest(key);
  assert.equal(first.ok, true);
  assert.equal(second.ok, false);
  assert.equal(second.reason, 'duplicate_in_progress');
  first.release();
});

test('new diagnoses and new browser projects do not share keys', () => {
  const firstProject = createCreativeDirectorProjectId();
  const secondDiagnosis = createCreativeDirectorProjectId();
  const anotherBrowserProject = createCreativeDirectorProjectId();
  assert.notEqual(createDiagnosticRequestKey(firstProject, 'pt'), createDiagnosticRequestKey(secondDiagnosis, 'pt'));
  assert.notEqual(createDiagnosticRequestKey(secondDiagnosis, 'pt'), createDiagnosticRequestKey(anotherBrowserProject, 'pt'));
});

test('a saved successful diagnosis is serializable for progress restore', () => {
  const saved = { creativeDirectorProjectId: createCreativeDirectorProjectId(), creativeDirector: { diagnostico: 'Teste', language: 'pt' } };
  assert.deepEqual(JSON.parse(JSON.stringify(saved)), saved);
});

test('real failures leave no completed cache entry so a retry is possible', () => {
  const key = createDiagnosticRequestKey(createCreativeDirectorProjectId(), 'pt');
  const guard = acquireCreativeDirectorRequest(key);
  guard.release();
  assert.equal(getCreativeDirectorResult(key), null);
  assert.equal(acquireCreativeDirectorRequest(key).ok, true);
});

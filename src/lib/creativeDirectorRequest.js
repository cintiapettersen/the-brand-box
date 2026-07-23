export function createCreativeDirectorProjectId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `creative-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createDiagnosticRequestKey(projectId, language) {
  if (!projectId) return null;
  return `${projectId}:diagnostic:${language || 'pt'}`;
}

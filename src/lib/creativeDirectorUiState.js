export function getCreativeDirectorNavigationState({ isLoading, creativeDirector, error }) {
  if (isLoading) return 'loading';
  if (creativeDirector) return 'ready';
  if (error) return 'fallback';
  return 'waiting';
}

export function getCreativeDirectorScrollMargin(viewportWidth) {
  return viewportWidth <= 767
    ? 'calc(6.5rem + env(safe-area-inset-top, 0px))'
    : '5rem';
}

export function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export function dateFmt(value) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function initials(name) {
  return String(name || 'U')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

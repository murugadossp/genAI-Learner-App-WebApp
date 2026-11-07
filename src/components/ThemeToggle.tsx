'use client';
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('genai-theme', next); } catch {}
  }
  return <button className="theme-toggle" onClick={toggle} aria-label="Toggle color theme">◐ <span>Theme</span></button>;
}

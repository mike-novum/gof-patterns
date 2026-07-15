import { useEffect, useState } from 'react';

interface Props {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

export function SlideNav({ total, current, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    function onKey(e: KeyboardEvent) {
      // Don't intercept if user is typing in an input
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        onChange(Math.min(total - 1, current + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onChange(Math.max(0, current - 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        onChange(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onChange(total - 1);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, total, onChange]);

  if (!mounted) return null;

  const prev = current > 0;
  const next = current < total - 1;
  const deepDivider = current >= 4; // после 4 базовых — секция «Глубже»

  return (
    <div
      className="sticky bottom-0 z-10 -mx-4 mt-12 border-t px-4 py-5 backdrop-blur-md sm:-mx-6 sm:px-6"
      style={{
        background: 'color-mix(in srgb, var(--bg-base) 85%, transparent)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Depth indicator */}
      <div className="mb-4 flex items-center gap-2">
        <span className="mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
          {deepDivider ? 'Глубже' : 'База'}
        </span>
        <div className="h-px flex-1 max-w-[60px]" style={{ background: 'var(--border-default)' }} />
      </div>

      {/* Progress dots */}
      <div className="mb-5 flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={`Слайд ${i + 1}`}
            className="h-2 transition-all duration-300"
            style={{
              width: i === current ? 32 : 8,
              borderRadius: 4,
              background: i === current ? 'var(--accent)' : i < current ? 'var(--accent-hover)' : 'var(--border-default)',
              opacity: i <= current ? 1 : 0.5,
            }}
          />
        ))}
        <span className="mono ml-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onChange(current - 1)}
          disabled={!prev}
          className="group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-[var(--accent)]"
          style={{
            borderColor: 'var(--border-default)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-enabled:group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="hidden sm:inline">Назад</span>
        </button>

        <div className="mono hidden items-center gap-3 text-[10px] uppercase tracking-wider sm:flex" style={{ color: 'var(--text-tertiary)' }}>
          <kbd className="rounded border px-1.5 py-0.5" style={{ borderColor: 'var(--border-default)' }}>←</kbd>
          <kbd className="rounded border px-1.5 py-0.5" style={{ borderColor: 'var(--border-default)' }}>→</kbd>
          <span>навигация</span>
        </div>

        <button
          onClick={() => onChange(current + 1)}
          disabled={!next}
          className="group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-[var(--accent)]"
          style={{
            borderColor: 'var(--border-default)',
            background: next ? 'var(--accent-soft)' : 'var(--bg-elevated)',
            color: next ? 'var(--accent)' : 'var(--text-primary)',
          }}
        >
          <span className="hidden sm:inline">Вперёд</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-enabled:group-hover:translate-x-1">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
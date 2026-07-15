import { CATEGORY_META, type Pattern } from '../types/pattern';
import { url } from '../lib/paths';

interface Props {
  pattern: Pattern;
  index: number;
  total: number;
}

export function PatternCard({ pattern, index, total }: Props) {
  const meta = CATEGORY_META[pattern.category];
  const num = String(index + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');

  return (
    <a
      href={url(`/patterns/${pattern.slug}/`)}
      className="group relative flex flex-col gap-4 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px -20px var(--accent-glow)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Top row: number + category */}
      <div className="flex items-center justify-between">
        <span className="mono text-xs font-medium tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
          {num} / {totalNum}
        </span>
        <span
          className="mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
          style={{
            color: 'var(--accent)',
            background: 'var(--accent-soft)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {meta.index}
        </span>
      </div>

      {/* Title */}
      <div className="flex-1">
        <h3
          className="display-font text-2xl font-semibold leading-tight transition-colors group-hover:text-[var(--accent)]"
          style={{ color: 'var(--text-primary)' }}
        >
          {pattern.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {pattern.intent}
        </p>
      </div>

      {/* Footer: slides count + arrow */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
          {pattern.slides.length} {pattern.slides.length === 1 ? 'слайд' : 'слайдов'}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: 'var(--accent)' }}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>

      {/* Subtle decorative grid in corner */}
      <div
        className="pointer-events-none absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      >
        <div className="h-2 w-2 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }} />
      </div>
    </a>
  );
}
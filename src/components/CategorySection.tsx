import type { Pattern, Category } from '../types/pattern';
import { CATEGORY_META } from '../types/pattern';
import { PatternCard } from './PatternCard';

interface Props {
  category: Category;
  patterns: Pattern[];
  totalCount: number;
  startIndex: number;
}

export function CategorySection({ category, patterns, totalCount, startIndex }: Props) {
  const meta = CATEGORY_META[category];

  return (
    <section className="relative scroll-mt-24" id={category}>
      {/* Section header — asymmetric, blueprint-like */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-baseline gap-4">
          <span className="mono text-5xl font-bold leading-none tracking-tighter" style={{ color: 'var(--accent)' }}>
            {meta.index}
          </span>
          <div>
            <h2 className="display-font text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
              {meta.title}
            </h2>
            <p className="mono mt-1 text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
              {meta.subtitle}
            </p>
          </div>
        </div>
        <div className="mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {patterns.length} {patterns.length === 1 ? 'паттерн' : patterns.length < 5 ? 'паттерна' : 'паттернов'}
        </div>
      </div>

      {/* Decorative divider with bullet */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: 'var(--border-default)' }} />
        <div className="h-1.5 w-1.5 rotate-45" style={{ background: 'var(--accent)' }} />
        <div className="h-px flex-1" style={{ background: 'var(--border-default)' }} />
      </div>

      {/* Grid of cards */}
      <div className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern, i) => (
          <PatternCard key={pattern.slug} pattern={pattern} index={startIndex + i} total={totalCount} />
        ))}
      </div>
    </section>
  );
}
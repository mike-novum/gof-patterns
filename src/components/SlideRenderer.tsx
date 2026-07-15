import type { SlideSection } from '../types/pattern';
import { CodeBlock } from './CodeBlock';

interface Props {
  slide: SlideSection;
}

export function SlideRenderer({ slide }: Props) {
  return (
    <div className="slide-enter">
      {/* Slide title */}
      <div className="mb-8 flex items-baseline gap-3">
        <span
          className="mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: 'var(--accent)' }}
        >
          {kindLabel(slide.kind)}
        </span>
        <div className="h-px flex-1 max-w-[120px]" style={{ background: 'var(--border-default)' }} />
      </div>

      <h2
        className="display-font mb-8 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        style={{ color: 'var(--text-primary)' }}
      >
        {slide.title}
      </h2>

      {/* Body */}
      {slide.body && (
        <p className="mb-6 max-w-3xl text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {slide.body}
        </p>
      )}

      {/* Analogy — callout box */}
      {slide.analogy && (
        <div
          className="relative my-6 max-w-3xl rounded-2xl border p-6"
          style={{
            background: 'var(--accent-soft)',
            borderColor: 'var(--accent)',
          }}
        >
          <div
            className="absolute -left-px -top-px h-3 w-3 rounded-br-md"
            style={{ background: 'var(--accent)' }}
          />
          <div
            className="absolute -right-px -bottom-px h-3 w-3 rounded-tl-md"
            style={{ background: 'var(--accent)' }}
          />
          <div className="mb-2 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z" />
            </svg>
            <span className="mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
              Аналогия
            </span>
          </div>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {slide.analogy}
          </p>
        </div>
      )}

      {/* Points list */}
      {slide.points && slide.points.length > 0 && (
        <ul className="mb-6 max-w-3xl space-y-3">
          {slide.points.map((point, i) => (
            <li key={i} className="flex gap-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span
                className="mono mt-2 inline-block h-1 w-6 flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Code */}
      {slide.code && (
        <div className="my-8 max-w-4xl">
          <CodeBlock code={slide.code.source} lang={slide.code.lang} />
        </div>
      )}

      {/* Pros and Cons */}
      {(slide.pros || slide.cons) && (
        <div className="my-6 grid max-w-4xl gap-4 sm:grid-cols-2">
          {slide.pros && (
            <div
              className="rounded-xl border p-5"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg" style={{ color: 'var(--accent)' }}>+</span>
                <span className="mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
                  Плюсы
                </span>
              </div>
              <ul className="space-y-2">
                {slide.pros.map((p, i) => (
                  <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {slide.cons && (
            <div
              className="rounded-xl border p-5"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg" style={{ color: 'var(--text-tertiary)' }}>−</span>
                <span className="mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
                  Минусы
                </span>
              </div>
              <ul className="space-y-2">
                {slide.cons.map((c, i) => (
                  <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function kindLabel(kind: string): string {
  const map: Record<string, string> = {
    analogy: 'Аналогия',
    problem: 'Проблема',
    solution: 'Решение',
    code: 'Код',
    diagram: 'Диаграмма',
    proscons: 'Анализ',
    usage: 'Применение',
  };
  return map[kind] || kind.toUpperCase();
}
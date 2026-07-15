interface Props {
  code: string;
  lang: 'ts' | 'js' | 'tsx';
}

export function CodeBlock({ code, lang }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border"
      style={{
        background: 'var(--code-bg)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-2"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444', opacity: 0.5 }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#eab308', opacity: 0.5 }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#22c55e', opacity: 0.5 }} />
        </div>
        <span className="mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
          {lang === 'ts' ? 'typescript' : lang === 'tsx' ? 'tsx' : 'javascript'}
        </span>
      </div>
      <pre className="mono overflow-x-auto p-5 text-[13px] leading-[1.7]" style={{ color: 'var(--text-primary)' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
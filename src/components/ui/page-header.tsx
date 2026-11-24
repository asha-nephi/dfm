// Standard title block for app pages.
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="font-display mt-1 text-3xl text-navy-black sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-navy-black/65">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-navy-black/55">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold text-charcoal">{value}</p>
      {hint && <p className="mt-1 text-xs text-navy-black/55">{hint}</p>}
    </>
  );
  return href ? (
    <a href={href} className="card block p-5 transition hover:border-charcoal/40">
      {body}
    </a>
  ) : (
    <div className="card p-5">{body}</div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-10 text-center">
      <p className="font-display text-xl text-navy-black">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-md text-sm text-navy-black/60">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

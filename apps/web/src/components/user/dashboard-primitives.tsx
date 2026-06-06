import Link from 'next/link';

export function ApiErrorBanner({ message }: { message: string }) {
  return (
    <div className="callout callout-warning" role="alert">
      <p>{message}</p>
    </div>
  );
}

export function ApiOfflineBanner() {
  return (
    <div className="callout callout-offline" role="alert">
      <p className="callout__title">Noa API unreachable</p>
      <p>
        This is different from having no credentials or devices — live counts are unavailable until
        the API responds.
      </p>
      <p>
        Start Postgres and run <code>pnpm --filter @noa/api dev</code>, then refresh this page.
        Quick links below still work for navigation while the API is offline.
      </p>
    </div>
  );
}

export type DashboardStat = {
  label: string;
  value: string | number;
  hint?: string;
  unavailable?: boolean;
};

export function DashboardStatGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="dashboard-stats">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`dashboard-stat card${stat.unavailable ? ' dashboard-stat--unavailable' : ''}`}
        >
          <p className="dashboard-stat__label">{stat.label}</p>
          <p className="dashboard-stat__value">{stat.value}</p>
          {stat.hint ? <p className="dashboard-stat__hint">{stat.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="card empty-state">
      <p>
        <strong>{title}</strong>
        <br />
        {body}
      </p>
    </div>
  );
}

export type OverviewEmptyItem = {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
};

export function OverviewEmptyStates({ items }: { items: OverviewEmptyItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="overview-empty" aria-label="Empty dashboard sections">
      <h2 className="dashboard-section-title">Nothing here yet</h2>
      <p className="dashboard-muted overview-empty__lede">
        Your account is connected, but these sections have no data yet. This is normal for a new
        holder — not an API error.
      </p>
      <ul className="overview-empty__list">
        {items.map((item) => (
          <li key={item.title} className="overview-empty__item card">
            <p className="overview-empty__item-title">{item.title}</p>
            <p className="overview-empty__item-body">{item.body}</p>
            <Link href={item.href} className="overview-empty__link">
              {item.linkLabel} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ApiErrorBanner({ message }: { message: string }) {
  return (
    <div className="callout callout-warning" role="alert">
      <p>{message}</p>
    </div>
  );
}

export function DashboardStatGrid({
  stats,
}: {
  stats: { label: string; value: string | number; hint?: string }[];
}) {
  return (
    <div className="dashboard-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="dashboard-stat card">
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

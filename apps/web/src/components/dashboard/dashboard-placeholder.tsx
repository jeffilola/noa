export function DashboardPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="dashboard-panel">
      <header className="dashboard-panel__header">
        <h1>{title}</h1>
        <p className="dashboard-panel__lede">{description}</p>
      </header>
      <div className="dashboard-empty">
        <p>This workspace is wired for RBAC navigation. Connect live data when the API endpoints are ready.</p>
      </div>
    </section>
  );
}

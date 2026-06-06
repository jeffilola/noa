import Link from 'next/link';

export function UserQuickLink({
  href,
  title,
  description,
  stat,
  statUnavailable = false,
}: {
  href: string;
  title: string;
  description: string;
  stat?: string;
  statUnavailable?: boolean;
}) {
  return (
    <Link href={href} className="dashboard-tile no-underline hover:no-underline">
      <div className="dashboard-tile__head">
        <h3>{title}</h3>
        {stat ? (
          <span
            className={`dashboard-tile__stat${statUnavailable ? ' dashboard-tile__stat--unavailable' : ''}`}
            aria-label={statUnavailable ? `${title}: unavailable while API is offline` : undefined}
          >
            {stat}
          </span>
        ) : null}
      </div>
      <p>{description}</p>
      <span className="dashboard-tile__cta">Open →</span>
    </Link>
  );
}

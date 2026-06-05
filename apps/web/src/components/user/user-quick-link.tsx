import Link from 'next/link';

export function UserQuickLink({
  href,
  title,
  description,
  stat,
}: {
  href: string;
  title: string;
  description: string;
  stat?: string;
}) {
  return (
    <Link href={href} className="dashboard-tile no-underline hover:no-underline">
      <div className="dashboard-tile__head">
        <h3>{title}</h3>
        {stat ? <span className="dashboard-tile__stat">{stat}</span> : null}
      </div>
      <p>{description}</p>
      <span className="dashboard-tile__cta">Open →</span>
    </Link>
  );
}

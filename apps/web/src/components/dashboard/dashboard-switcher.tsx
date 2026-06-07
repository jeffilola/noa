'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { noaColors as c } from '@/components/relume/shared/theme';

export interface DashboardSwitcherLink {
  label: string;
  basePath: string;
}

export function DashboardSwitcher({ links }: { links: DashboardSwitcherLink[] }) {
  const pathname = usePathname();
  const router = useRouter();

  if (links.length === 0) {
    return null;
  }

  if (links.length === 1) {
    return (
      <Link
        href={links[0].basePath}
        className="rounded-full px-5 py-2 text-sm font-semibold no-underline transition-opacity hover:opacity-90"
        style={{ background: c.accent, color: c.onAccent }}
      >
        Dashboard
      </Link>
    );
  }

  const current =
    links.find((link) =>
      link.basePath === '/user' ? pathname.startsWith('/user') : pathname.startsWith(link.basePath),
    )?.basePath ?? links[0].basePath;

  return (
    <label className="dashboard-switcher">
      <span className="sr-only">Switch dashboard</span>
      <select
        className="dashboard-switcher__select"
        value={current}
        onChange={(event) => router.push(event.target.value)}
      >
        {links.map((link) => (
          <option key={link.basePath} value={link.basePath}>
            {link.label}
          </option>
        ))}
      </select>
    </label>
  );
}

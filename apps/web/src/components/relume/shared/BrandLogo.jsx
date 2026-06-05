import Link from 'next/link';
import { noaColors as c } from './theme';

export function BrandLogo({ href = '/', className = '' }) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold tracking-tight"
        style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.glow})`, color: c.onAccent }}
      >
        N
      </span>
      <span className="text-xl font-bold tracking-tight" style={{ color: c.ink }}>
        Noa
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex no-underline hover:no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

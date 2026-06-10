import Link from 'next/link';

export function BrandLogo({ href = '/', className = '' }) {
  const content = (
    <span className={`brand-logo inline-flex items-center gap-2.5 ${className}`}>
      <span className="brand-logo__mark flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold tracking-tight">
        N
      </span>
      <span className="brand-logo__text text-xl font-bold tracking-tight">Noa</span>
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

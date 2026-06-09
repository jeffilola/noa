'use client';



import clsx from 'clsx';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import React, { useState } from 'react';

import { AuthNavControls } from '@/components/auth-nav-controls';
import { ThemeToggle } from '@/components/theme-toggle';
import { useNoaColors } from '@/hooks/use-noa-colors';

import { BrandLogo } from './BrandLogo';

import { marketingNavLinks, marketingRoutes } from './routes';



function NavItem({ href, label, onClick }) {
  const c = useNoaColors();
  const pathname = usePathname();

  const active = pathname === href;



  return (

    <Link

      href={href}

      onClick={onClick}

      className={clsx(

        'rounded-full px-4 py-2 text-sm font-medium transition-colors no-underline hover:no-underline',

        active ? 'font-semibold' : '',

      )}

      style={{

        color: active ? c.ink : c.sage,

        background: active ? c.accentSoft : 'transparent',

      }}

    >

      {label}

    </Link>

  );

}



export function Navbar3() {
  const c = useNoaColors();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);



  return (

    <header

      className="sticky top-0 z-50 border-b backdrop-blur-md"

      style={{

        borderColor: `color-mix(in srgb, ${c.sage} 22%, transparent)`,

        background: c.glassNav,

      }}

    >

      <div className="marketing-shell flex h-[4.5rem] items-center justify-between gap-6">

        <BrandLogo href={marketingRoutes.home} />



        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">

          {marketingNavLinks.map((link) => (

            <NavItem key={link.href} {...link} />

          ))}

        </nav>



        <div className="flex items-center gap-3">
          <ThemeToggle compact />
          <div className="hidden sm:block">

            <AuthNavControls />

          </div>



          <button

            type="button"

            className="inline-flex size-10 items-center justify-center rounded-full border lg:hidden"

            style={{ borderColor: `color-mix(in srgb, ${c.sage} 35%, transparent)` }}

            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}

            aria-expanded={mobileOpen}

            onClick={() => setMobileOpen((open) => !open)}

          >

            <span className="flex flex-col gap-1">

              <span className="block h-0.5 w-5" style={{ background: c.sage }} />

              <span className="block h-0.5 w-5" style={{ background: c.sage }} />

              <span className="block h-0.5 w-5" style={{ background: c.sage }} />

            </span>

          </button>

        </div>

      </div>



      {mobileOpen ? (

        <>

          <button

            type="button"

            className="fixed inset-0 z-40 lg:hidden"

            style={{ background: 'rgb(0 0 0 / 65%)' }}

            aria-label="Close menu overlay"

            onClick={closeMobile}

          />

          <div

            className="absolute left-0 right-0 top-full z-50 border-b py-5 shadow-lg lg:hidden"

            style={{ borderColor: `color-mix(in srgb, ${c.sage} 22%, transparent)`, background: c.surface }}

          >

            <nav className="marketing-shell flex flex-col gap-4" aria-label="Mobile primary">

              {marketingNavLinks.map((link) => (

                <NavItem key={link.href} {...link} onClick={closeMobile} />

              ))}

              <AuthNavControls compact />

            </nav>

          </div>

        </>

      ) : null}

    </header>

  );

}


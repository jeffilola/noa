'use client';



import Link from 'next/link';

import React from 'react';

import {

  BiLogoInstagram,

  BiLogoLinkedinSquare,

} from 'react-icons/bi';

import { FaXTwitter } from 'react-icons/fa6';

import { BrandLogo } from './BrandLogo';

import { marketingRoutes } from './routes';

import { useNoaColors } from '@/hooks/use-noa-colors';



const footerLinks = [

  {

    title: 'Product',

    links: [

      { label: 'How it works', href: marketingRoutes.home },

      { label: 'Security', href: marketingRoutes.security },

      { label: 'Integrations', href: marketingRoutes.adminIntegrations },

    ],

  },

  {

    title: 'Company',

    links: [

      { label: 'About', href: marketingRoutes.about },

      { label: 'Contact', href: marketingRoutes.contact },

      { label: 'Documentation', href: marketingRoutes.portal },

    ],

  },

  {

    title: 'Solutions',

    links: [

      { label: 'For enterprises', href: marketingRoutes.adminCredentials },

      { label: 'For contractors', href: marketingRoutes.holderDashboard },

      { label: 'Holder dashboard', href: marketingRoutes.holderDashboard },

    ],

  },

];



export function Footer3() {
  const c = useNoaColors();

  return (

    <footer

      className="border-t py-16 md:py-20"

      style={{

        borderColor: `color-mix(in srgb, #ffffff 10%, transparent)`,

        background: c.glassNav,

      }}

    >

      <div className="marketing-shell">

        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">

          <div>

            <BrandLogo href={marketingRoutes.home} />

            <p className="mt-5 max-w-sm text-sm leading-relaxed" style={{ color: c.sage }}>

              Privacy-first credential orchestration. One wallet for every door, key, and pass.

            </p>

            <div className="mt-6 space-y-1 text-sm">

              <p className="font-semibold" style={{ color: c.ink }}>

                Contact

              </p>

              <a href="mailto:info@noa.app" className="block no-underline hover:underline" style={{ color: c.sage }}>

                info@noa.app

              </a>

            </div>

            <div className="mt-6 flex gap-3" style={{ color: c.accent }}>

              {[

                { href: 'https://linkedin.com', label: 'LinkedIn', Icon: BiLogoLinkedinSquare },

                { href: 'https://x.com', label: 'X', Icon: FaXTwitter },

                { href: 'https://instagram.com', label: 'Instagram', Icon: BiLogoInstagram },

              ].map(({ href, label, Icon }) => (

                <a

                  key={label}

                  href={href}

                  target="_blank"

                  rel="noreferrer"

                  aria-label={label}

                  className="transition-opacity hover:opacity-70"

                >

                  <Icon className="size-5" />

                </a>

              ))}

            </div>

          </div>



          <div className="grid gap-8 sm:grid-cols-3">

            {footerLinks.map((group) => (

              <div key={group.title}>

                <p

                  className="mb-3 text-xs font-bold uppercase tracking-widest"

                  style={{ color: c.accent }}

                >

                  {group.title}

                </p>

                <ul className="space-y-2">

                  {group.links.map((link) => (

                    <li key={link.label}>

                      <Link

                        href={link.href}

                        className="text-sm no-underline transition-colors hover:underline"

                        style={{ color: c.sage }}

                      >

                        {link.label}

                      </Link>

                    </li>

                  ))}

                </ul>

              </div>

            ))}

          </div>

        </div>



        <div

          className="mt-14 flex flex-col gap-5 border-t pt-8 text-sm md:flex-row md:items-center md:justify-between"

          style={{ borderColor: `color-mix(in srgb, ${c.sage} 20%, transparent)`, color: c.sage }}

        >

          <p>© {new Date().getFullYear()} Noa. All rights reserved.</p>

          <div className="flex flex-wrap gap-4">

            <Link href={marketingRoutes.security} className="no-underline hover:underline">

              Privacy

            </Link>

            <Link href={marketingRoutes.contact} className="no-underline hover:underline">

              Terms

            </Link>

          </div>

        </div>

      </div>

    </footer>

  );

}


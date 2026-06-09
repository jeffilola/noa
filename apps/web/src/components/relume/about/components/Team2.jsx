'use client';

import { Button } from '@relume_io/relume-ui';
import Link from 'next/link';
import React from 'react';
import { BiLogoLinkedinSquare } from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';
import { useNoaColors } from '@/hooks/use-noa-colors';

const TEAM = [
  {
    name: 'James Mitchell',
    role: 'Chief Executive Officer',
    bio: 'Twenty years in identity systems. Spent the last decade solving access control at scale.',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=640&h=640&q=80&crop=face',
  },
  {
    name: 'Sarah Chen',
    role: 'Chief Technology Officer',
    bio: 'Former security architect. Built encryption systems that protect millions of users daily.',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&h=640&q=80&crop=face',
  },
  {
    name: 'Marcus Webb',
    role: 'Chief Product Officer',
    bio: 'Designed products at three unicorns. Believes simplicity is the hardest thing to build.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=640&h=640&q=80&crop=face',
  },
  {
    name: 'Elena Rodriguez',
    role: 'VP of Security',
    bio: 'Compliance expert with deep experience in GDPR, SOC 2, and enterprise security frameworks.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=640&h=640&q=80&crop=face',
  },
  {
    name: 'David Park',
    role: 'VP of Engineering',
    bio: "Led engineering teams at fintech companies. Obsessed with building systems that don't fail.",
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=640&h=640&q=80&crop=face',
  },
  {
    name: 'Lisa Thompson',
    role: 'Head of Operations',
    bio: 'Scaled operations for fast-growing SaaS companies. Keeps the machine running smoothly.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=640&h=640&q=80&crop=face',
  },
  {
    name: 'Thomas Anderson',
    role: 'Head of Sales',
    bio: 'Enterprise sales veteran. Understands what organizations need to move fast with confidence.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=640&h=640&q=80&crop=face',
  },
  {
    name: 'Priya Kapoor',
    role: 'Head of Design',
    bio: 'Design systems specialist. Creates interfaces that feel natural and secure at once.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=640&h=640&q=80&crop=face',
  },
];

function TeamCard({ member }) {
  const c = useNoaColors();
  return (
    <article
      className="flex flex-col rounded-2xl border p-5 text-center md:p-6"
      style={{
        borderColor: `color-mix(in srgb, ${c.ink} 12%, transparent)`,
        background: c.cardBgSoft,
      }}
    >
      <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-xl">
        <img
          src={member.image}
          alt={`Portrait of ${member.name}`}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="mb-3">
        <h3 className="text-lg font-bold" style={{ color: c.ink }}>
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-medium" style={{ color: c.accent }}>
          {member.role}
        </p>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: c.sage }}>
        {member.bio}
      </p>
      <div className="mt-5 flex justify-center gap-3" style={{ color: c.accent }}>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`}>
          <BiLogoLinkedinSquare className="size-5 opacity-80 transition-opacity hover:opacity-100" />
        </a>
        <a href="https://x.com" target="_blank" rel="noreferrer" aria-label={`${member.name} on X`}>
          <FaXTwitter className="size-5 p-0.5 opacity-80 transition-opacity hover:opacity-100" />
        </a>
      </div>
    </article>
  );
}

export function Team2() {
  const c = useNoaColors();
  return (
    <section
      id="team"
      className="marketing-section relative z-[1] border-t"
      style={{
        borderColor: `color-mix(in srgb, ${c.ink} 10%, transparent)`,
        background: c.glass,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="marketing-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: c.accent }}>
            Leadership
          </p>
          <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl" style={{ color: c.ink }}>
            Our team
          </h2>
          <p className="text-base leading-relaxed md:text-lg" style={{ color: c.sage }}>
            Built by people who understand security, identity, and the weight of trust.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {TEAM.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>

        <div
          className="mx-auto mt-14 max-w-md rounded-2xl border p-8 text-center md:mt-16"
          style={{
            borderColor: `color-mix(in srgb, ${c.ink} 10%, transparent)`,
            background: c.cardBgSoft,
          }}
        >
          <h3 className="mb-3 text-2xl font-bold md:text-3xl" style={{ color: c.ink }}>
            We&apos;re hiring
          </h3>
          <p className="text-sm leading-relaxed md:text-base" style={{ color: c.sage }}>
            Join a team building the future of digital identity.
          </p>
          <div className="mt-6">
            <Link href="/contact" className="no-underline">
              <Button variant="secondary" className="rounded-full px-6">
                View roles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState, type ElementType } from 'react';
import { FiUser } from 'react-icons/fi';
import { identitySubNav, userNavLinks } from '@/lib/user-dashboard';

function sidebarGreeting(firstName?: string | null, email?: string | null) {
  if (firstName?.trim()) return `Welcome, ${firstName.trim()}`;
  if (email) return `Welcome, ${email.split('@')[0]}`;
  return 'Welcome';
}

function DrawerNavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon?: ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`drawer-nav-link${active ? ' drawer-nav-link--active' : ''}`}
      title={label}
    >
      {Icon ? <Icon className="drawer-nav-link__icon" aria-hidden /> : null}
      <span className="drawer-nav-link__label">{label}</span>
    </Link>
  );
}

export function UserSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash.replace('#', ''));
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [pathname]);

  const greeting = isLoaded
    ? sidebarGreeting(user?.firstName, user?.primaryEmailAddress?.emailAddress)
    : 'Welcome';

  const onIdentityRoute = pathname === '/user/identity' || pathname.startsWith('/user/identity/');

  return (
    <aside className="user-sidebar" aria-label="Identity Holder dashboard">
      <p className="drawer-sidebar__greeting">{greeting}</p>
      <nav className="drawer-nav">
        {userNavLinks.map((link) => {
          const hasSubNav = 'subNav' in link && link.subNav;
          const parentActive =
            link.href === '/user'
              ? pathname === '/user'
              : link.href === '/user/identity'
                ? onIdentityRoute
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const ParentIcon = link.icon ?? FiUser;

          return (
            <div key={link.href} className="drawer-nav__group">
              <DrawerNavLink
                href={link.href}
                label={link.label}
                icon={ParentIcon}
                active={parentActive}
              />
              {hasSubNav && parentActive ? (
                <div className="drawer-nav__subnav">
                  {link.subNav.map((subLink) => {
                    const SubIcon = subLink.icon ?? FiUser;
                    const subActive =
                      onIdentityRoute &&
                      (activeHash === subLink.hash || (!activeHash && subLink.hash === 'profile'));

                    return (
                      <DrawerNavLink
                        key={subLink.hash}
                        href={subLink.href}
                        label={subLink.label}
                        icon={SubIcon}
                        active={subActive}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

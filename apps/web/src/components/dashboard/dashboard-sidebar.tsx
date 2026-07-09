'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ElementType } from 'react';
import { useSidebarOptional } from '@/components/dashboard/sidebar-context';
import { SidebarThemeSettings } from '@/components/sidebar-theme-settings';
import {
  FiActivity,
  FiAlertCircle,
  FiBarChart2,
  FiCreditCard,
  FiFileText,
  FiGlobe,
  FiLink,
  FiMapPin,
  FiRefreshCw,
  FiSettings,
  FiShield,
  FiUsers,
} from 'react-icons/fi';
import type { DashboardNavConfig } from '@/lib/rbac/navigation';

const iconByLabel: Record<string, ElementType> = {
  Overview: FiActivity,
  Users: FiUsers,
  'Site access': FiMapPin,
  Credentials: FiCreditCard,
  Integrations: FiLink,
  Reports: FiBarChart2,
  'Audit Logs': FiFileText,
  'Security Center': FiShield,
  'Credential Monitoring': FiCreditCard,
  Revocations: FiAlertCircle,
  Compliance: FiFileText,
  Exports: FiFileText,
  Providers: FiLink,
  Webhooks: FiLink,
  'Sync Monitoring': FiRefreshCw,
  'Integration Health': FiActivity,
  Organizations: FiGlobe,
  'Training & certs': FiFileText,
  'System Health': FiActivity,
  Billing: FiSettings,
};

interface DashboardSidebarProps {
  config: DashboardNavConfig;
}

export function DashboardSidebar({ config }: DashboardSidebarProps) {
  const pathname = usePathname();
  const sidebar = useSidebarOptional();

  function closeOnMobile() {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
      sidebar?.close();
    }
  }

  return (
    <aside className="user-sidebar" aria-label={`${config.label} dashboard`}>
      <p className="drawer-sidebar__section-label">{config.label}</p>
      <nav className="drawer-nav">
        {config.items.map((link) => {
          const active =
            link.href === config.basePath
              ? pathname === config.basePath
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = iconByLabel[link.label] ?? FiActivity;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`drawer-nav-link${active ? ' drawer-nav-link--active' : ''}`}
              title={link.label}
              onClick={closeOnMobile}
            >
              <Icon className="drawer-nav-link__icon" aria-hidden />
              <span className="drawer-nav-link__label">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <SidebarThemeSettings />
    </aside>
  );
}

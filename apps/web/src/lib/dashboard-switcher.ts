export interface DashboardSwitcherLink {
  label: string;
  basePath: string;
  href: string;
}

const DASHBOARD_LANDING_PATH: Partial<Record<string, string>> = {
  '/platform': '/platform/organizations',
  '/compliance': '/compliance/reports',
  '/integrations-admin': '/integrations-admin/providers',
};

export function dashboardLandingPath(basePath: string, firstNavHref?: string) {
  return DASHBOARD_LANDING_PATH[basePath] ?? firstNavHref ?? basePath;
}

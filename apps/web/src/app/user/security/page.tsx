import { PageHeader } from '@/components/page-header';
import { SecurityPrivacyPanel } from '@/components/user/security-privacy-panel';

export const dynamic = 'force-dynamic';

export default function UserSecurityPage() {
  return (
    <div className="content-stack">
      <PageHeader
        title="Security & privacy"
        description="Export or delete your holder data. All actions are audited."
      />
      <SecurityPrivacyPanel />
    </div>
  );
}

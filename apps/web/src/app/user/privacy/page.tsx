import { PageHeader } from '@/components/page-header';
import { PrivacyActions } from '@/components/user/privacy-actions';

export default function PrivacyPage() {
  return (
    <div className="content-stack">
      <PageHeader
        title="Privacy & data"
        description="Export or delete your holder data. All actions are audited."
      />
      <PrivacyActions />
    </div>
  );
}

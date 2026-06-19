import { redirect } from 'next/navigation';

export default function IntegrationAdminIndexPage() {
  redirect('/integrations-admin/providers');
}

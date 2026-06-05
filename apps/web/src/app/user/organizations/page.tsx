import { redirect } from 'next/navigation';

export default function UserOrganizationsPage() {
  redirect('/user/identity#organizations');
}

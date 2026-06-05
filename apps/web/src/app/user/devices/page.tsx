import { redirect } from 'next/navigation';

export default function DevicesPage() {
  redirect('/user/identity#devices');
}

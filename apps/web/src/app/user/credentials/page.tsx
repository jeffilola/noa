import { redirect } from 'next/navigation';

export default function UserCredentialsPage() {
  redirect('/user/identity#credentials');
}

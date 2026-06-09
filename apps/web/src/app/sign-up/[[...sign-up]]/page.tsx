import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { BrandLogo } from '@/components/relume/shared/BrandLogo';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="mb-8">
        <BrandLogo href="/" />
      </div>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/user"
      />
      <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-[var(--text)] no-underline hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

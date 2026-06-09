import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { BrandLogo } from '@/components/relume/shared/BrandLogo';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="mb-8">
        <BrandLogo href="/" />
      </div>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/user"
      />
      <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
        Need an account?{' '}
        <Link href="/sign-up" className="font-semibold text-[var(--text)] no-underline hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

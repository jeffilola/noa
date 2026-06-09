import { ClerkProvider } from '@clerk/nextjs';
import type { ComponentProps } from 'react';

type ClerkAppearance = NonNullable<ComponentProps<typeof ClerkProvider>['appearance']>;

const sharedVariables = {  borderRadius: '0.75rem',
};

export function getClerkAppearance(mode: 'light' | 'dark'): ClerkAppearance {
  if (mode === 'light') {
    return {
      variables: {
        ...sharedVariables,
        colorPrimary: '#0a0a0a',
        colorBackground: '#ffffff',
        colorText: '#0a0a0a',
        colorTextSecondary: '#6b6b6b',
        colorInputBackground: '#f0f0f1',
        colorInputText: '#0a0a0a',
        colorNeutral: '#6b6b6b',
      },
      elements: {
        formButtonPrimary: 'bg-neutral-900 text-white hover:bg-neutral-800 border-0 shadow-none',
        card: 'bg-white border border-black/10 shadow-xl',
        headerTitle: 'text-neutral-900',
        headerSubtitle: 'text-neutral-500',
        socialButtonsBlockButton:
          'border-black/10 bg-neutral-50 text-neutral-900 hover:bg-neutral-100',
        formFieldInput: 'bg-neutral-50 border-black/10 text-neutral-900',
        footerActionLink: 'text-neutral-900 hover:text-neutral-700',
        identityPreviewEditButton: 'text-neutral-900',
        userButtonPopoverCard: 'border border-black/10 bg-white',
        userButtonPopoverActionButton: 'text-neutral-900 hover:bg-neutral-100',
      },
    };
  }

  return {
    variables: {
      ...sharedVariables,
      colorPrimary: '#ffffff',
      colorBackground: '#0a0a0a',
      colorText: '#ffffff',
      colorTextSecondary: '#a3a3a3',
      colorInputBackground: '#141414',
      colorInputText: '#ffffff',
      colorNeutral: '#a3a3a3',
    },
    elements: {
      formButtonPrimary: 'bg-white text-black hover:bg-neutral-200 border-0 shadow-none',
      card: 'bg-[#0a0a0a] border border-white/10 shadow-2xl',
      headerTitle: 'text-white',
      headerSubtitle: 'text-neutral-400',
      socialButtonsBlockButton: 'border-white/15 bg-[#141414] text-white hover:bg-[#1f1f1f]',
      formFieldInput: 'bg-[#141414] border-white/15 text-white',
      footerActionLink: 'text-white hover:text-neutral-300',
      identityPreviewEditButton: 'text-white',
      userButtonPopoverCard: 'border border-white/10 bg-[#0a0a0a]',
      userButtonPopoverActionButton: 'text-white hover:bg-white/10',
    },
  };
}

/** @deprecated Use getClerkAppearance(resolvedTheme) inside ThemedClerkProvider */
export const clerkAppearance = getClerkAppearance('dark');

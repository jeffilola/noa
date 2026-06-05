export const clerkAppearance = {
  variables: {
    colorPrimary: '#ffffff',
    colorBackground: '#0a0a0a',
    colorText: '#ffffff',
    colorTextSecondary: '#a3a3a3',
    colorInputBackground: '#141414',
    colorInputText: '#ffffff',
    colorNeutral: '#a3a3a3',
    borderRadius: '0.75rem',
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
  },
} as const;

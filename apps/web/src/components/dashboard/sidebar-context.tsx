'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'noa.dashboard.sidebar.open';
const DESKTOP_QUERY = '(min-width: 901px)';

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;
}

interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const desktop = isDesktopViewport();
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (desktop) {
      setOpen(stored !== null ? stored === 'true' : true);
    } else {
      setOpen(false);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (!media.matches) {
        setOpen(false);
        return;
      }

      const stored = window.localStorage.getItem(STORAGE_KEY);
      setOpen(stored !== null ? stored === 'true' : true);
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [ready]);

  useEffect(() => {
    if (!ready || !isDesktopViewport()) return;
    window.localStorage.setItem(STORAGE_KEY, String(open));
  }, [open, ready]);

  const value: SidebarContextValue = {
    open,
    toggle: () => setOpen((current) => !current),
    close: () => setOpen(false),
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

export function useSidebarOptional() {
  return useContext(SidebarContext);
}

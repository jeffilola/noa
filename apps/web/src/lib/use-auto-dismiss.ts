import { useEffect, useRef } from 'react';

export const FEEDBACK_DISMISS_MS = 5000;

export function useAutoDismiss(
  message: string | null,
  onDismiss: () => void,
  durationMs = FEEDBACK_DISMISS_MS,
) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => onDismissRef.current(), durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs]);
}

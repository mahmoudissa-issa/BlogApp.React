import { useState, useEffect, useCallback } from "react";

/**
 * Hook for managing a cooldown timer (e.g., resend button).
 * Returns [secondsLeft, startCooldown, isActive].
 */
export function useCooldown(seconds: number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const start = useCallback(() => setRemaining(seconds), [seconds]);

  return [remaining, start, remaining > 0] as const;
}

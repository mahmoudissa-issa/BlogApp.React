import { useCallback, useState } from "react";

/**
 * Manages show/hide state for one or more password fields.
 * Returns a map of field names → { show, toggle } and a reset function.
 *
 * Usage:
 *   const pw = usePasswordToggle("password", "confirmPassword");
 *   pw.password.show        // boolean
 *   pw.password.toggle()    // flip visibility
 */
export function usePasswordToggle<T extends string>(...fields: T[]) {
  const [state, setState] = useState<Record<T, boolean>>(
    () => Object.fromEntries(fields.map((f) => [f, false])) as Record<T, boolean>,
  );

  const toggle = useCallback(
    (field: T) => setState((prev) => ({ ...prev, [field]: !prev[field] })),
    [],
  );

  const result = {} as Record<T, { show: boolean; toggle: () => void }>;
  for (const f of fields) {
    result[f] = { show: state[f], toggle: () => toggle(f) };
  }

  return result;
}

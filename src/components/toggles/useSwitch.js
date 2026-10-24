import { useState } from "react";

/**
 * Shared on/off state for the toggles.
 *
 * Works controlled (pass `checked`) or uncontrolled (`defaultChecked`).
 * `touched` turns true after the first flip, so an animation that should
 * only play on a change (a blink, a puff of smoke) does not play on load.
 */
export function useSwitch({ checked, defaultChecked = false, onChange, disabled = false }) {
  const [own, setOwn] = useState(Boolean(defaultChecked));
  const [touched, setTouched] = useState(false);
  const controlled = checked !== undefined;
  const on = controlled ? Boolean(checked) : own;

  const toggle = (event) => {
    if (disabled) return;
    const next = !on;
    if (!controlled) setOwn(next);
    setTouched(true);
    onChange?.(next, event);
  };

  return { on, touched, toggle };
}

/** Builds the CSS variables for the props a user actually passed. */
export function cssVars(entries) {
  const vars = {};
  for (const [name, value, unit = ""] of entries) {
    if (value !== undefined && value !== null && value !== "") vars[name] = `${value}${unit}`;
  }
  return vars;
}

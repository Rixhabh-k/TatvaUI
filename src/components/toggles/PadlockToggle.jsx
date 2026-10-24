import "../../styles/toggles/padlockToggle.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * PadlockToggle
 *
 * A padlock. Lock it and the shackle snaps down, the keyhole turns as if
 * a key went round, the body thunks and a few sparkles pop; unlock it and
 * the shackle springs up and swings open.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Locked when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=90]  Size in pixels; everything scales with it.
 * @param {string}   [props.label="Locked"]  What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.lockedColor]  Body colour when locked.
 * @param {string}   [props.openColor]  Body colour when open.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function PadlockToggle({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Locked",
  disabled = false,
  lockedColor,
  openColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-lock-size", size, "px"],
    ["--tattva-lock-locked", lockedColor],
    ["--tattva-lock-open", openColor],
  ]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      {...props}
      onClick={(event) => {
        toggle(event);
        props.onClick?.(event);
      }}
      data-state={on ? "on" : "off"}
      data-touched={touched || undefined}
      className={`tattva-lock ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-lock__sparkles" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="tattva-lock__shackle" aria-hidden="true" />
      <span className="tattva-lock__body" aria-hidden="true">
        <i className="tattva-lock__keyhole" />
      </span>
    </button>
  );
}

export default PadlockToggle;

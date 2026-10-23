import "../../styles/toggles/neonSign.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/* "OPEN", drawn as tubes rather than set in a font, so it looks the same
   everywhere: O, P, E, N */
const LETTER_PATHS = [
  "M38 26 C26 26 22 38 22 50 C22 62 26 74 38 74 C50 74 54 62 54 50 C54 38 50 26 38 26 Z",
  "M70 74 V26 H84 C96 26 99 34 99 39 C99 45 95 52 84 52 H70",
  "M134 26 H113 V74 H134 M113 50 H130",
  "M148 74 V26 L170 74 V26",
];
const LETTERS = LETTER_PATHS.join(" ");

/**
 * NeonSign
 *
 * A neon "OPEN" sign on a brick wall. Switch it on and the tubes buzz and
 * flicker to life one letter at a time, throwing pink light on the wall
 * inside a cyan border; switch it off and they go dark, back to bare glass.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Lit when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=80]  Size in pixels; everything scales with it.
 * @param {string}   [props.label="Open sign"]  What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.textColor]  Colour of the lettering.
 * @param {string}   [props.borderColor]  Colour of the border tube.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function NeonSign({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Open sign",
  disabled = false,
  textColor,
  borderColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-neon-size", size, "px"],
    ["--tattva-neon-text", textColor],
    ["--tattva-neon-border", borderColor],
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
      className={`tattva-neon ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <svg className="tattva-neon__svg" viewBox="0 0 190 100" aria-hidden="true">
        {/* bare glass, always there; the lit tube is drawn over it */}
        <g className="tattva-neon__glass">
          <rect x="8" y="8" width="174" height="84" rx="16" />
          <path d={LETTERS} />
        </g>
        <rect className="tattva-neon__tube tattva-neon__frame" x="8" y="8" width="174" height="84" rx="16" />
        {LETTER_PATHS.map((d, i) => (
          <path key={i} className="tattva-neon__tube tattva-neon__letter" style={{ "--i": i }} d={d} />
        ))}
      </svg>
    </button>
  );
}

export default NeonSign;

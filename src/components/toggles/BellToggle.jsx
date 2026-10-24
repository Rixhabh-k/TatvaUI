import "../../styles/toggles/bellToggle.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * BellToggle
 *
 * A notifications switch drawn as a bell. Off, it is muted, grey and
 * struck through; on, the slash wipes away, the bell turns gold and rings,
 * its clapper swinging the other way, with sound waves and a little
 * badge popping up.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Notifications on when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=64]  Size in pixels; everything scales with it.
 * @param {string}   [props.label="Notifications"]  What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.bellColor]  Colour of the bell when on.
 * @param {string}   [props.badgeColor]  Colour of the badge.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function BellToggle({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Notifications",
  disabled = false,
  bellColor,
  badgeColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-bell-size", size, "px"],
    ["--tattva-bell-on", bellColor],
    ["--tattva-bell-badge", badgeColor],
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
      className={`tattva-bell ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <svg className="tattva-bell__svg" viewBox="0 0 48 48" aria-hidden="true">
        <path className="tattva-bell__wave tattva-bell__wave--left" d="M8.5 15 Q5 21 8.5 27 M4.5 12 Q-0.5 21 4.5 30" />
        <path className="tattva-bell__wave tattva-bell__wave--right" d="M39.5 15 Q43 21 39.5 27 M43.5 12 Q48.5 21 43.5 30" />
        <g className="tattva-bell__swing">
          <g className="tattva-bell__clapper">
            <circle cx="24" cy="36.5" r="3.4" />
          </g>
          <path
            className="tattva-bell__shape"
            d="M24 8.5 C17 8.5 13.5 13.5 13.5 20 V26 L10 31.5 Q9.4 33 11 33 H37 Q38.6 33 38 31.5 L34.5 26 V20 C34.5 13.5 31 8.5 24 8.5 Z"
          />
          <circle className="tattva-bell__knob" cx="24" cy="7.5" r="2.3" />
          <path className="tattva-bell__shine" d="M18 14 Q16.5 17 16.5 21" />
        </g>
        <path className="tattva-bell__slash tattva-bell__slash--gap" d="M10 8 L38 40" pathLength="1" />
        <path className="tattva-bell__slash" d="M10 8 L38 40" pathLength="1" />
        <g className="tattva-bell__badge">
          <circle cx="35.5" cy="11" r="5.5" />
          <text x="35.5" y="13.4" textAnchor="middle">3</text>
        </g>
      </svg>
    </button>
  );
}

export default BellToggle;

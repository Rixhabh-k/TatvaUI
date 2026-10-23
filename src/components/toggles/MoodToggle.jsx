import "../../styles/toggles/moodToggle.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * MoodToggle
 *
 * A switch whose knob is a little face. Off, it is sad and rolls to the
 * left with a tear; on, it rolls right and smiles, with rosy cheeks. The
 * mouth flattens on the way, and the face blinks every time it flips.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Happy when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(happy: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=40]               Height in pixels; everything scales with it.
 * @param {string}   [props.label="Happy"]         What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.offColor]              Track colour when off.
 * @param {string}   [props.onColor]               Track colour when on.
 * @param {string}   [props.faceColor]
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function MoodToggle({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Happy",
  disabled = false,
  offColor,
  onColor,
  faceColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-mood-size", size, "px"],
    ["--tattva-mood-off", offColor],
    ["--tattva-mood-on", onColor],
    ["--tattva-mood-face", faceColor],
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
      className={`tattva-mood ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-mood__face" aria-hidden="true">
        <i className="tattva-mood__eye tattva-mood__eye--left" />
        <i className="tattva-mood__eye tattva-mood__eye--right" />
        <i className="tattva-mood__tear" />
        <i className="tattva-mood__cheek tattva-mood__cheek--left" />
        <i className="tattva-mood__cheek tattva-mood__cheek--right" />
        <i className="tattva-mood__mouth" />
      </span>
    </button>
  );
}

export default MoodToggle;

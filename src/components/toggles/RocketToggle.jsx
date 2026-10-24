import "../../styles/toggles/rocketToggle.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * RocketToggle
 *
 * A rocket on its launch pad under a night sky. Switch it on and the
 * engine fires, the rocket shudders, lifts off in a cloud of smoke and
 * hovers on its flame while the stars streak past; switch it off and it
 * settles back onto the pad.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               In flight when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=96]  Size in pixels; everything scales with it.
 * @param {string}   [props.label="Launch"]  What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.rocketColor]  Colour of the nose cone and fins.
 * @param {string}   [props.skyColor]  Colour of the sky.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function RocketToggle({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Launch",
  disabled = false,
  rocketColor,
  skyColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-rocket-size", size, "px"],
    ["--tattva-rocket-accent", rocketColor],
    ["--tattva-rocket-sky", skyColor],
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
      className={`tattva-rocket ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-rocket__stars" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </span>
      <span className="tattva-rocket__pad" aria-hidden="true" />
      <span className="tattva-rocket__smoke" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="tattva-rocket__ship" aria-hidden="true">
        <span className="tattva-rocket__flame" />
        <span className="tattva-rocket__fin tattva-rocket__fin--left" />
        <span className="tattva-rocket__fin tattva-rocket__fin--right" />
        <span className="tattva-rocket__body">
          <i className="tattva-rocket__window" />
        </span>
      </span>
    </button>
  );
}

export default RocketToggle;

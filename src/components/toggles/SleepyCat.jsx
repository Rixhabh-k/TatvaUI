import "../../styles/toggles/sleepyCat.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * SleepyCat
 *
 * A switch with a cat for a knob. Off, it dozes on a dusky track, ears
 * drooping, with a trail of z's floating up; on, it slides into the
 * sunshine, eyes pop open, ears perk up and its whiskers twitch.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Awake when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=44]  Size in pixels; everything scales with it.
 * @param {string}   [props.label="Awake"]  What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.furColor]  Colour of the cat.
 * @param {string}   [props.nightColor]  Track colour while it sleeps.
 * @param {string}   [props.dayColor]  Track colour while it is awake.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function SleepyCat({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Awake",
  disabled = false,
  furColor,
  nightColor,
  dayColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-cat-size", size, "px"],
    ["--tattva-cat-fur", furColor],
    ["--tattva-cat-night", nightColor],
    ["--tattva-cat-day", dayColor],
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
      className={`tattva-cat ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-cat__zzz" aria-hidden="true">
        <i>z</i>
        <i>z</i>
        <i>z</i>
      </span>
      <span className="tattva-cat__sun" aria-hidden="true" />
      <span className="tattva-cat__head" aria-hidden="true">
        <i className="tattva-cat__ear tattva-cat__ear--left" />
        <i className="tattva-cat__ear tattva-cat__ear--right" />
        <span className="tattva-cat__face">
          <i className="tattva-cat__stripes" />
          <i className="tattva-cat__eye tattva-cat__eye--left" />
          <i className="tattva-cat__eye tattva-cat__eye--right" />
          <i className="tattva-cat__cheek tattva-cat__cheek--left" />
          <i className="tattva-cat__cheek tattva-cat__cheek--right" />
          <i className="tattva-cat__nose" />
          <i className="tattva-cat__whiskers tattva-cat__whiskers--left" />
          <i className="tattva-cat__whiskers tattva-cat__whiskers--right" />
        </span>
      </span>
    </button>
  );
}

export default SleepyCat;

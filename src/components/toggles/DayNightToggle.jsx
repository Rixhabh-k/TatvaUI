import "../../styles/toggles/dayNightToggle.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * DayNightToggle
 *
 * A dark-mode switch drawn as a little sky. Flip it and the sun rolls
 * across and turns into a cratered moon, the clouds sink away and the
 * stars come out.
 *
 * It is a real switch (role="switch" on a <button>), so it works with the
 * keyboard and is announced by screen readers.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Night when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(night: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=40]               Height in pixels; everything scales with it.
 * @param {string}   [props.label="Dark mode"]     What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.daySky]                Sky colour by day.
 * @param {string}   [props.nightSky]              Sky colour by night.
 * @param {string}   [props.sunColor]
 * @param {string}   [props.moonColor]
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function DayNightToggle({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Dark mode",
  disabled = false,
  daySky,
  nightSky,
  sunColor,
  moonColor,
  className = "",
  style,
  ...props
}) {
  const { on, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-dnt-size", size, "px"],
    ["--tattva-dnt-day", daySky],
    ["--tattva-dnt-night", nightSky],
    ["--tattva-dnt-sun", sunColor],
    ["--tattva-dnt-moon", moonColor],
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
      data-state={on ? "night" : "day"}
      className={`tattva-day-night ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-day-night__stars" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </span>
      <span className="tattva-day-night__clouds" aria-hidden="true">
        <i className="tattva-day-night__cloud tattva-day-night__cloud--back" />
        <i className="tattva-day-night__cloud" />
      </span>
      <span className="tattva-day-night__halo" aria-hidden="true" />
      <span className="tattva-day-night__orb" aria-hidden="true">
        <i className="tattva-day-night__crater" />
        <i className="tattva-day-night__crater" />
        <i className="tattva-day-night__crater" />
      </span>
    </button>
  );
}

export default DayNightToggle;

import "../../styles/toggles/rockerSwitch.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * RockerSwitch
 *
 * A chunky retro power switch. The paddle tilts in 3D toward the side you
 * pressed — "O" for off, "I" for on — and the pressed half falls into
 * shadow, while an LED above it glows when the power is on.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               On when true. Pass it to control the switch.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(on: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=56]               Height of the housing in pixels; everything scales with it.
 * @param {string}   [props.label="Power"]         What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.ledColor]              Colour of the lit LED.
 * @param {string}   [props.paddleColor]           Colour of the paddle.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function RockerSwitch({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Power",
  disabled = false,
  ledColor,
  paddleColor,
  className = "",
  style,
  ...props
}) {
  const { on, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-rocker-size", size, "px"],
    ["--tattva-rocker-led", ledColor],
    ["--tattva-rocker-paddle", paddleColor],
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
      className={`tattva-rocker ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-rocker__led" aria-hidden="true" />
      <span className="tattva-rocker__housing" aria-hidden="true">
        <span className="tattva-rocker__paddle">
          <span className="tattva-rocker__half tattva-rocker__half--off">
            <i className="tattva-rocker__o" />
          </span>
          <span className="tattva-rocker__half tattva-rocker__half--on">
            <i className="tattva-rocker__i" />
          </span>
        </span>
      </span>
    </button>
  );
}

export default RockerSwitch;

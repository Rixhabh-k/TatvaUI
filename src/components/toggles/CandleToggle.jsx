import "../../styles/toggles/candleToggle.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * CandleToggle
 *
 * A candle you light with a click. On, a flame grows from the wick and
 * flickers in its own warm glow; off, it goes out with a curl of smoke.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Lit when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(lit: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=110]              Height in pixels; everything scales with it.
 * @param {string}   [props.label="Candle"]        What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.waxColor]              Colour of the candle.
 * @param {string}   [props.flameColor]            Outer colour of the flame.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function CandleToggle({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Candle",
  disabled = false,
  waxColor,
  flameColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-candle-size", size, "px"],
    ["--tattva-candle-wax", waxColor],
    ["--tattva-candle-flame", flameColor],
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
      data-state={on ? "lit" : "out"}
      data-touched={touched || undefined}
      className={`tattva-candle ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-candle__glow" aria-hidden="true" />
      <span className="tattva-candle__smoke" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="tattva-candle__flame" aria-hidden="true">
        <i className="tattva-candle__core" />
      </span>
      <span className="tattva-candle__wick" aria-hidden="true" />
      <span className="tattva-candle__body" aria-hidden="true" />
      <span className="tattva-candle__plate" aria-hidden="true" />
    </button>
  );
}

export default CandleToggle;

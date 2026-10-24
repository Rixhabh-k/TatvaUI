import { useId } from "react";
import "../../styles/toggles/lavaLamp.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/* each blob of wax: size, column, the tempo of its rise and fall, and how
   long it takes to warm up enough to leave the heap */
const BLOBS = [
  { s: "0.075em", x: "34%", t: "9s", d: "0.4s" },
  { s: "0.055em", x: "60%", t: "11s", d: "2s" },
  { s: "0.09em", x: "50%", t: "13s", d: "1.1s" },
  { s: "0.045em", x: "42%", t: "8s", d: "2.8s" },
  { s: "0.065em", x: "58%", t: "10s", d: "1.6s" },
];

/**
 * LavaLamp
 *
 * A lava lamp. Off, the wax lies cold in a heap at the bottom of dark
 * glass; on, the lamp warms up and glows, and soft blobs of wax rise,
 * merge, split and sink again.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               On when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=130]              Height in pixels; everything scales with it.
 * @param {string}   [props.label="Lava lamp"]     What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.waxColor]              Colour of the wax.
 * @param {string}   [props.liquidColor]           Colour of the glowing liquid.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function LavaLamp({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Lava lamp",
  disabled = false,
  waxColor,
  liquidColor,
  className = "",
  style,
  ...props
}) {
  const { on, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });
  // the goo filter needs an id of its own, for several lamps on one page
  const goo = `tattva-lava-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const vars = cssVars([
    ["--tattva-lava-size", size, "px"],
    ["--tattva-lava-wax", waxColor],
    ["--tattva-lava-liquid", liquidColor],
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
      className={`tattva-lava ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      {/* blur the blobs together, then sharpen the edge back: they merge like wax */}
      <svg className="tattva-lava__defs" aria-hidden="true" focusable="false">
        <filter id={goo}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>

      <span className="tattva-lava__halo" aria-hidden="true" />
      <span className="tattva-lava__cap" aria-hidden="true" />
      <span className="tattva-lava__glass" aria-hidden="true">
        <span className="tattva-lava__wax" style={{ filter: `url(#${goo})` }}>
          <i className="tattva-lava__pool" />
          {BLOBS.map((b, i) => (
            <i key={i} className="tattva-lava__blob" style={{ "--s": b.s, "--x": b.x, "--t": b.t, "--d": b.d }} />
          ))}
        </span>
        <span className="tattva-lava__shine" />
      </span>
      <span className="tattva-lava__base" aria-hidden="true" />
    </button>
  );
}

export default LavaLamp;

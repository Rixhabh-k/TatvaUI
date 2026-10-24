import "../../styles/toggles/fireflyJar.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/* where each firefly sleeps (rest, along the bottom), where it flies
   (x, y, in % of the jar), the two detours of its loop and its tempo */
const FLIES = [
  { x: "22%", y: "28%", rest: "18%", ax: "0.08em", ay: "0.06em", bx: "0.03em", by: "-0.07em", t: "3.1s" },
  { x: "62%", y: "22%", rest: "34%", ax: "-0.07em", ay: "0.08em", bx: "0.05em", by: "0.04em", t: "3.7s" },
  { x: "44%", y: "46%", rest: "50%", ax: "0.06em", ay: "-0.08em", bx: "-0.06em", by: "0.05em", t: "2.8s" },
  { x: "72%", y: "58%", rest: "66%", ax: "-0.05em", ay: "-0.06em", bx: "-0.08em", by: "0.03em", t: "3.4s" },
  { x: "26%", y: "64%", rest: "28%", ax: "0.07em", ay: "0.05em", bx: "0.06em", by: "-0.06em", t: "4s" },
  { x: "52%", y: "76%", rest: "58%", ax: "-0.06em", ay: "-0.07em", bx: "0.04em", by: "-0.05em", t: "3.3s" },
  { x: "36%", y: "38%", rest: "42%", ax: "0.05em", ay: "0.07em", bx: "-0.07em", by: "-0.04em", t: "3.9s" },
];

/**
 * FireflyJar
 *
 * A glass jar of fireflies. Off, they sleep in a dim heap at the bottom;
 * on, they wake one by one, rise, and drift around the jar, each glowing
 * to its own rhythm and lighting the glass from inside.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Fireflies awake when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=120]  Size in pixels; everything scales with it.
 * @param {string}   [props.label="Fireflies"]  What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.glowColor]  Colour of the fireflies' light.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function FireflyJar({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Fireflies",
  disabled = false,
  glowColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });
  // each firefly gets its own resting place, flight path and rhythm
  const flies = FLIES;

  const vars = cssVars([
    ["--tattva-firefly-size", size, "px"],
    ["--tattva-firefly-glow", glowColor],
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
      className={`tattva-firefly ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-firefly__aura" aria-hidden="true" />
      <span className="tattva-firefly__lid" aria-hidden="true" />
      <span className="tattva-firefly__jar" aria-hidden="true">
        <span className="tattva-firefly__light" />
        {flies.map((f, i) => (
          <i
            key={i}
            className="tattva-firefly__fly"
            style={{
              "--x": f.x,
              "--y": f.y,
              "--rest": f.rest,
              "--ax": f.ax,
              "--ay": f.ay,
              "--bx": f.bx,
              "--by": f.by,
              "--t": f.t,
              "--d": `${i * 0.12}s`,
            }}
          />
        ))}
        <span className="tattva-firefly__shine" />
      </span>
    </button>
  );
}

export default FireflyJar;

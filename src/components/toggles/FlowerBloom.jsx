import "../../styles/toggles/flowerBloom.css";
import { cssVars, useSwitch } from "./useSwitch.js";

const PETALS = 8;

/**
 * FlowerBloom
 *
 * A flower in a pot. Off, it is a closed bud on a drooping stem; on, the
 * stem straightens, the leaves unfurl, the petals open one after another
 * and a little pollen drifts up. Off again, it folds back into its bud.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               In bloom when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=120]  Size in pixels; everything scales with it.
 * @param {string}   [props.label="Bloom"]  What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.petalColor]  Colour of the petals.
 * @param {string}   [props.potColor]  Colour of the pot.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function FlowerBloom({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Bloom",
  disabled = false,
  petalColor,
  potColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-bloom-size", size, "px"],
    ["--tattva-bloom-petal", petalColor],
    ["--tattva-bloom-pot", potColor],
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
      className={`tattva-bloom ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-bloom__pollen" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="tattva-bloom__stem" aria-hidden="true">
        <i className="tattva-bloom__leaf tattva-bloom__leaf--left" />
        <i className="tattva-bloom__leaf tattva-bloom__leaf--right" />
        <span className="tattva-bloom__flower">
          {Array.from({ length: PETALS }, (_, i) => (
            <i key={i} className="tattva-bloom__petal" style={{ "--i": i, "--a": `${(360 / PETALS) * i}deg` }} />
          ))}
          <i className="tattva-bloom__heart" />
        </span>
      </span>
      <span className="tattva-bloom__pot" aria-hidden="true" />
    </button>
  );
}

export default FlowerBloom;

import { useEffect, useId, useRef } from "react";
import "../../styles/toggles/eyeToggle.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * EyeToggle
 *
 * A show/hide toggle drawn as an eye — made for password fields. Closed,
 * it shows a lid with its lashes; open, it looks around, its pupil
 * following the pointer, and it blinks now and then.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Open (password shown) when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=40]               Height in pixels; everything scales with it.
 * @param {string}   [props.label="Show password"] What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {boolean}  [props.follow=true]           Whether the pupil follows the pointer.
 * @param {string}   [props.irisColor]             Colour of the iris.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function EyeToggle({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Show password",
  disabled = false,
  follow = true,
  irisColor,
  className = "",
  style,
  ...props
}) {
  const { on, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });
  const ref = useRef(null);
  const clip = `tattva-eye-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // the pupil looks toward the pointer, in the window the eye is in
  useEffect(() => {
    const el = ref.current;
    if (!el || !follow) return;
    const view = el.ownerDocument.defaultView;
    if (!view) return;

    let frame = 0;
    const onMove = (event) => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        // looks further the further away the pointer is, up to the edge of the eye
        const reach = Math.min(1, dist / 160);
        el.style.setProperty("--tattva-eye-x", ((dx / dist) * 7 * reach).toFixed(2));
        el.style.setProperty("--tattva-eye-y", ((dy / dist) * 3.5 * reach).toFixed(2));
      });
    };

    view.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      view.cancelAnimationFrame(frame);
      view.removeEventListener("pointermove", onMove);
    };
  }, [follow]);

  const vars = cssVars([
    ["--tattva-eye-size", size, "px"],
    ["--tattva-eye-iris", irisColor],
  ]);

  return (
    <button
      ref={ref}
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
      className={`tattva-eye ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <svg className="tattva-eye__svg" viewBox="0 0 60 40" aria-hidden="true">
        <defs>
          <clipPath id={clip}>
            <path d="M6 20 Q30 -2 54 20 Q30 42 6 20 Z" />
          </clipPath>
        </defs>
        <g className="tattva-eye__blink">
          <g className="tattva-eye__ball" clipPath={`url(#${clip})`}>
            <path className="tattva-eye__white" d="M6 20 Q30 -2 54 20 Q30 42 6 20 Z" />
            <g className="tattva-eye__iris">
              <circle className="tattva-eye__iris-ring" cx="30" cy="20" r="9.5" />
              <circle className="tattva-eye__iris-fill" cx="30" cy="20" r="8" />
              <circle className="tattva-eye__pupil" cx="30" cy="20" r="4.2" />
              <circle className="tattva-eye__glint" cx="27" cy="16.8" r="1.8" />
            </g>
          </g>
          <path className="tattva-eye__line tattva-eye__lower" d="M6 20 Q30 42 54 20" />
          <g className="tattva-eye__lid">
            <path className="tattva-eye__line" d="M6 20 Q30 -2 54 20" />
            <path
              className="tattva-eye__lashes"
              d="M15.6 13 L12.4 8.4 M22.8 10 L21.4 4.8 M30 9 L30 3.6 M37.2 10 L38.6 4.8 M44.4 13 L47.6 8.4"
            />
          </g>
        </g>
      </svg>
    </button>
  );
}

export default EyeToggle;

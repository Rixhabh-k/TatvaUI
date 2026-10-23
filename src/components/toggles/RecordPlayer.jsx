import "../../styles/toggles/recordPlayer.css";
import { cssVars, useSwitch } from "./useSwitch.js";

/**
 * RecordPlayer
 *
 * A little turntable. Switch it on and the tonearm swings over onto the
 * record, the vinyl starts to spin and notes float up; switch it off and
 * the arm lifts back to its rest while the record stops where it is.
 *
 * A real switch (role="switch" on a <button>): it works with the keyboard
 * and screen readers, and holds still for reduced motion.
 *
 * @param {object}   props
 * @param {boolean}  [props.checked]               Playing when true. Pass it to control the toggle.
 * @param {boolean}  [props.defaultChecked=false]  Starting state when uncontrolled.
 * @param {(checked: boolean, event: object) => void} [props.onChange]
 * @param {number}   [props.size=100]  Size in pixels; everything scales with it.
 * @param {string}   [props.label="Music"]  What screen readers announce.
 * @param {boolean}  [props.disabled=false]
 * @param {string}   [props.labelColor]  Colour of the record's centre label.
 * @param {string}   [props.noteColor]  Colour of the floating notes.
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
function RecordPlayer({
  checked,
  defaultChecked = false,
  onChange,
  size,
  label = "Music",
  disabled = false,
  labelColor,
  noteColor,
  className = "",
  style,
  ...props
}) {
  const { on, touched, toggle } = useSwitch({ checked, defaultChecked, onChange, disabled });

  const vars = cssVars([
    ["--tattva-record-size", size, "px"],
    ["--tattva-record-label", labelColor],
    ["--tattva-record-note", noteColor],
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
      className={`tattva-record ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      <span className="tattva-record__plinth" aria-hidden="true" />
      <span className="tattva-record__disc" aria-hidden="true">
        <span className="tattva-record__grooves" />
        <span className="tattva-record__sheen" />
      </span>
      <span className="tattva-record__notes" aria-hidden="true">
        <i>♪</i>
        <i>♫</i>
        <i>♪</i>
      </span>
      <span className="tattva-record__arm" aria-hidden="true">
        <i className="tattva-record__rod" />
        <i className="tattva-record__head" />
      </span>
      <span className="tattva-record__pivot" aria-hidden="true" />
      <span className="tattva-record__led" aria-hidden="true" />
    </button>
  );
}

export default RecordPlayer;

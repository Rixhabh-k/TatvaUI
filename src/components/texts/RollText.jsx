import { useEffect, useState } from "react";
import "../../styles/texts/rollText.css";

/**
 * @param {string}  text
 * @param {"hover"|"loop"} trigger
 *        hover – rolls when the pointer enters the text (default). Wrap it in an
 *                element with the class `tatva-roll-group` to roll it when
 *                that parent is hovered instead (buttons, links, cards).
 *        loop  – rolls automatically, pausing between rolls
 * @param {number}  duration  Seconds each letter takes to roll.
 * @param {number}  stagger   Seconds between one letter and the next.
 * @param {number}  pause     Seconds to rest between rolls (loop only).
 * @param {string}  easing    Any CSS timing function.
 * @param {string}  baseColor Colour of the text. Default: inherited text colour.
 * @param {string}  nextColor Colour the incoming letters flash as they roll in; they settle
 *                        into the normal text colour as they land (default: no flash).
 */
function RollText({
  text = "Roll",
  trigger = "loop",
  duration = 0.55,
  stagger = 0.03,
  pause = 1.6,
  easing = "cubic-bezier(0.76, 0, 0.24, 1)",
  baseColor,
  nextColor,
  className = "",
  style,
  ...props
}) {
  const chars = Array.from(text);
  const [rolling, setRolling] = useState(false);

  // loop: switch the "rolling" class on for one roll, then off, every cycle
  useEffect(() => {
    if (trigger !== "loop") return undefined;
    const rollMs = (duration + stagger * Math.max(0, chars.length - 1)) * 1000;
    const cycleMs = rollMs + pause * 1000;
    let off = 0;
    const roll = () => {
      setRolling(true);
      off = window.setTimeout(() => setRolling(false), rollMs + 50);
    };
    roll();
    const id = window.setInterval(roll, cycleMs);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(off);
    };
  }, [trigger, duration, stagger, pause, chars.length]);

  const vars = {
    "--tatva-roll-duration": `${duration}s`,
    "--tatva-roll-stagger": `${stagger}s`,
    "--tatva-roll-ease": easing,
  };
  if (nextColor) vars["--tatva-roll-next"] = nextColor;

  const classes = [
    "tatva-roll",
    rolling && "tatva-roll--rolling",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      {...props}
      className={classes}
      style={{ color: baseColor, ...vars, ...style }}>
      <span className="tatva-roll__sr">{text}</span>
      <span className="tatva-roll__visual" aria-hidden="true">
        {chars.map((ch, i) => {
          const glyph = ch === " " ? "\u00A0" : ch;
          return (
            <span key={i} className="tatva-roll__char" style={{ "--i": i }}>
              <span className="tatva-roll__face">{glyph}</span>
              <span className="tatva-roll__face tatva-roll__face--next">
                {glyph}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export default RollText;

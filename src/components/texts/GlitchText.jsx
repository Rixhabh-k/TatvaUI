import "../../styles/texts/glitchText.css";

/**
 * GlitchText — text that tears into offset RGB slices.
 * Pure CSS animation, driven by a `data-text` copy of the text.
 *
 * @param {string}  text      Text to glitch.
 * @param {"loop"|"hover"|"always"} trigger
 *        loop   – short glitch bursts with quiet gaps in between (default)
 *        hover  – glitches continuously while hovered
 *        always – glitches continuously
 * @param {number}  interval  Seconds per burst cycle (loop) / per flicker cycle (hover, always).
 * @param {number}  shift     How far the slices jump, in em.
 * @param {[string, string]} colors  The two slice colours.
 * @param {string}  baseColor  Colour of the text itself. Default: inherited text colour.
 */
function GlitchText({
  text = "Glitch",
  trigger = "loop",
  interval,
  shift = 0.06,
  colors = ["#00e5ff", "#ff2e93"],
  baseColor,
  className = "",
  style,
  ...props
}) {
  const cycle = interval ?? (trigger === "loop" ? 3.2 : 0.55);

  const classes = ["tatva-glitch", `tatva-glitch--${trigger}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      {...props}
      className={classes}
      data-text={text}
      style={{
        "--tatva-glitch-duration": `${cycle}s`,
        "--tatva-glitch-shift": `${shift}em`,
        "--tatva-glitch-a": colors[0],
        "--tatva-glitch-b": colors[1],
        color: baseColor,
        ...style,
      }}>
      <span className="tatva-glitch__text">{text}</span>
    </span>
  );
}

export default GlitchText;

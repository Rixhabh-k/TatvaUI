import "../../styles/texts/shimmerText.css";
// import "./shimmerText.css";

/**
 * ShimmerText — a soft band of light sweeps across the text.
 * Pure CSS animation: great for "Thinking…" / "Generating…" states.
 *
 * @param {number}  duration        Seconds per sweep.
 * @param {number}  delay           Seconds before the first sweep.
 * @param {number}  angle           Angle of the light band (deg).
 * @param {"ltr"|"rtl"} direction   Sweep direction.
 * @param {string}  baseColor       Colour of the resting text. Default: dimmed copy of the text colour.
 * @param {string}  highlightColor  Colour of the light band. Default: the text colour.
 * @param {boolean} paused          Freeze the animation.
 */
function ShimmerText({
  children = "Thinking...",
  duration = 2.2,
  delay = 0,
  angle = 100,
  direction = "ltr",
  baseColor = "#616161",
  highlightColor = "#f4f4f3",
  paused = false,
  className = "",
  style,
  ...props
}) {
  const vars = {
    "--tatva-shimmer-duration": `${duration}s`,
    "--tatva-shimmer-delay": `${delay}s`,
    "--tatva-shimmer-angle": `${angle}deg`,
  };
  if (baseColor) vars["--tatva-shimmer-base"] = baseColor;
  if (highlightColor) vars["--tatva-shimmer-highlight"] = highlightColor;

  const classes = [
    "tatva-shimmer",
    direction === "rtl" && "tatva-shimmer--rtl",
    paused && "tatva-shimmer--paused",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...props} className={classes} style={{ ...vars, ...style }}>
      {children}
    </span>
  );
}

export default ShimmerText;

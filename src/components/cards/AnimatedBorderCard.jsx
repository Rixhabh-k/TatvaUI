import "../../styles/cards/animatedBorderCard.css";

/** number -> "12px", string ("1rem", "50%") as it is */
const toCssSize = (value) =>
  typeof value === "number" ? `${value}px` : value;

/**
 * AnimatedBorderCard
 *
 * @param {object}  props
 * @param {React.ReactNode} [props.children]
 * @param {string}  [props.color1="#22d3ee"]
 * @param {string}  [props.color2="#facc15"]
 * @param {string}  [props.color3="#ec4899"]
 * @param {number|string} [props.radius=20]        Upper box ka radius. Lower box ka radius auto adjust hota hai.
 * @param {number|string} [props.borderWidth=1.5]  Border ki motai (1-2px recommended)
 * @param {"clockwise"|"counterclockwise"} [props.direction="clockwise"]
 * @param {"always"|"hover"} [props.trigger="always"]  Animation kab chale
 * @param {number}  [props.duration=5]             Ek rotation ka time (seconds)
 * @param {boolean} [props.glow=true]              Soft glow on/off
 * @param {string}  [props.className]
 * @param {object}  [props.style]
 */
function AnimatedBorderCard({
  children = "Animated Border Card",
  color1 = "#22d3ee",
  color2 = "#facc15",
  color3 = "#ec4899",
  radius = 20,
  borderWidth = 1.5,
  direction = "clockwise",
  trigger = "always",
  duration = 5,
  glow = true,
  className = "",
  style,
  ...props
}) {
  // Inline CSS variables: first render se hi sahi values, useEffect ki zarurat nahi
  const cssVars = {
    "--tattva-border-color-1": color1,
    "--tattva-border-color-2": color2,
    "--tattva-border-color-3": color3,
    "--tattva-radius": toCssSize(radius),
    "--tattva-border-width": toCssSize(borderWidth),
    "--tattva-duration": `${duration}s`,
    "--tattva-direction":
      direction === "counterclockwise" ? "reverse" : "normal",
  };

  return (
    <div
      {...props}
      data-trigger={trigger}
      className={`tattva-animated-border-card ${className}`.trim()}
      style={{ ...cssVars, ...style }}
    >
      {glow && <div className="tattva-animated-border-card__glow" />}

      <div className="tattva-animated-border-card__content">{children}</div>
    </div>
  );
}

export default AnimatedBorderCard;

/* ---------------- Usage ----------------

<AnimatedBorderCard />

<AnimatedBorderCard
  color1="#a78bfa"
  color2="#34d399"
  color3="#f87171"
  radius={32}
  borderWidth={2}
  direction="counterclockwise"
  trigger="hover"
  duration={3}
>
  Hello
</AnimatedBorderCard>

------------------------------------------ */
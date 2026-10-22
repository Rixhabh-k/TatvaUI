import "../../styles/buttons/rollingtextbutton.css";

/**
 * @typedef {"up" | "down"} RollingTextButtonDirection
 */

/**
 * RollingTextButton
 *
 * @param {object}  props
 * @param {string}  [props.children="Explore Motion"]  Button ka text (rolling ke liye string hona zaroori hai)
 * @param {string}  [props.buttonColor]        Button ka background color (default #eeeee6)
 * @param {string}  [props.buttonHoverColor]   Hover par button ka color (default #c9c9be)
 * @param {string}  [props.textColor]          Text color (default #111111)
 * @param {number}  [props.duration=0.5]       Ek letter ke roll ka time, seconds me
 * @param {number}  [props.stagger=0.02]       Letters ke beech ka delay, seconds me (0 = sab saath)
 * @param {RollingTextButtonDirection} [props.direction="up"]  Roll ki direction: "up" ya "down"
 * @param {string}  [props.href]               Dene par button <a> link ban jata hai
 * @param {string}  [props.target]
 * @param {string}  [props.rel]
 * @param {string}  [props.className]          Positioning / spacing ke liye apni class
 * @param {object}  [props.style]
 * (baaki sab button props jaise onClick, disabled, type, id bhi chalte hain)
 */
function RollingTextButton({
  children = "Explore Motion",
  buttonColor,
  buttonHoverColor,
  textColor,
  duration = 0.5,
  stagger = 0.02,
  direction = "up",
  href,
  target,
  rel,
  className = "",
  style,
  ...props
}) {
  const text = String(children);
  const chars = Array.from(text);

  // CSS variables sirf tab set hote hain jab user ne prop diya ho,
  // taaki baaki sab user ki stylesheet se bhi override ho sake.
  const vars = {};
  if (buttonColor !== undefined) vars["--tattva-rtb-bg"] = buttonColor;
  if (buttonHoverColor !== undefined) vars["--tattva-rtb-hover-bg"] = buttonHoverColor;
  if (textColor !== undefined) vars["--tattva-rtb-text"] = textColor;
  if (Number.isFinite(duration) && duration >= 0) vars["--tattva-rtb-duration"] = `${duration}s`;
  if (Number.isFinite(stagger) && stagger >= 0) vars["--tattva-rtb-stagger"] = `${stagger}s`;

  const Component = href ? "a" : "button";
  const elementProps = href
    ? { href, target, rel: rel ?? (target === "_blank" ? "noopener noreferrer" : undefined) }
    : { type: "button" };

  return (
    <Component
      {...elementProps}
      {...props}
      data-direction={direction === "down" ? "down" : "up"}
      className={`tattva-rolling-text-button ${className}`.trim()}
      style={{ ...vars, ...style }}
    >
      {/* Screen readers ke liye asli text (animated letters aria-hidden hain) */}
      <span className="tattva-rolling-text-button__sr">{text}</span>

      <span className="tattva-rolling-text-button__label" aria-hidden="true">
        {chars.map((char, index) => {
          const visible = char === " " ? "\u00A0" : char;
          return (
            <span
              key={`${char}-${index}`}
              className="tattva-rolling-text-button__char"
              style={{ "--tattva-rtb-i": index }}
            >
              <span className="tattva-rolling-text-button__char-inner" data-char={visible}>
                {visible}
              </span>
            </span>
          );
        })}
      </span>
    </Component>
  );
}

export default RollingTextButton;

/* ---------------- Usage ----------------

// Default
<RollingTextButton />

// Customized
<RollingTextButton
  buttonColor="#7c3aed"
  buttonHoverColor="#4c1d95"
  textColor="#ffffff"
  duration={0.6}
  direction="down"
>
  Get Started
</RollingTextButton>

// Link ki tarah
<RollingTextButton href="/pricing">See Pricing</RollingTextButton>

------------------------------------------ */
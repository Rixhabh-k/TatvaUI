import { useEffect, useId, useRef } from "react";
import "../../styles/texts/circularText.css";

/**
 *   "expand" -> ring grows slightly
 *   "shrink" -> ring shrinks to ~75%
 *   "speed"  -> rotation speeds up (~1.5x)
 *   "color"  -> text turns blue
 *   "pause"  -> rotation eases to a stop
 *   "none"   -> no hover effect
 */
export default function CircularText({
  text = "TATVA • UI • ",
  radius = 105, // baseline radius of the text
  fontSize = 32,
  duration = 12.3, // seconds per full rotation
  direction = "clockwise", // "clockwise" | "counterclockwise"
  onHover = "expand",
  hoverSpeed = 1.5, // rotation multiplier for "speed"
  expandScale = 1.05,
  shrinkScale = 0.75,
  baseColor = "#ffffff", // default text colour
  hoverColor = "#0055ff", // text colour on hover for onHover="color"
  className = "",
  children,
  ...props
}) {
  const pathId = useId().replace(/:/g, "");
  const ringRef = useRef(null);
  const hoverRef = useRef(false);

  // Phrase is repeated twice around the ring, as in the reference.
  const content = (text + text).replace(/ /g, "\u00A0");

  const size = (radius + fontSize * 0.8) * 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * radius;

  // rAF-driven rotation so speed-up / pause ease in and out (~0.2s).
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sign = direction === "counterclockwise" ? -1 : 1;
    const baseSpeed = 360 / duration; // deg / second

    let angle = 0;
    let current = reduce ? 0 : 1;
    let last = performance.now();
    let raf;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      let target = reduce ? 0 : 1;
      if (hoverRef.current && !reduce) {
        if (onHover === "speed") target = hoverSpeed;
        if (onHover === "pause") target = 0;
      }
      current += (target - current) * Math.min(dt * 12, 1);

      angle = (angle + sign * baseSpeed * current * dt) % 360;
      ring.style.transform = `rotate(${angle}deg)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, direction, onHover, hoverSpeed]);

  const hoverScale =
    onHover === "expand" ? expandScale : onHover === "shrink" ? shrinkScale : 1;

  return (
    <div
      className={`tatva-circular ${
        onHover === "color" ? "tatva-circular--color" : ""
      } ${className}`.trim()}
      style={{
        width: size,
        height: size,
        fontSize,
        "--tatva-circular-scale": hoverScale,
        "--tatva-circular-base-color": baseColor,
        "--tatva-circular-hover-color": hoverColor,
      }}
      data-hover={onHover}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      {...props}>
      <div className="tatva-circular__stage">
        <div className="tatva-circular__ring" ref={ringRef}>
          <svg
            className="tatva-circular__svg"
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden="true">
            <defs>
              <path
                id={pathId}
                d={`M ${c - radius},${c} a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 ${-radius * 2},0`}
              />
            </defs>
            <text className="tatva-circular__text">
              <textPath
                href={`#${pathId}`}
                textLength={circumference}
                lengthAdjust="spacing">
                {content}
              </textPath>
            </text>
          </svg>
        </div>
        {children && <div className="tatva-circular__center">{children}</div>}
      </div>
      <span className="tatva-circular__sr">{text}</span>
    </div>
  );
}

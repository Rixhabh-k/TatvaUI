import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "../../styles/cards/CircleExpand.css";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80";

const DEFAULT_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Numbers become px; strings must be valid CSS for `property`, else fallback. */
function toCssLength(value, fallback, property = "width") {
  if (typeof value === "number" && Number.isFinite(value)) return `${value}px`;
  if (typeof value === "string" && value.trim() !== "") {
    const v = value.trim();
    if (typeof CSS !== "undefined" && CSS.supports && !CSS.supports(property, v)) {
      return fallback;
    }
    return v;
  }
  return fallback;
}

function toDuration(value) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return `${value}ms`;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const v = value.trim();
    if (
      typeof CSS === "undefined" ||
      !CSS.supports ||
      CSS.supports("transition-duration", v)
    ) {
      return v;
    }
  }
  return "750ms";
}

function toEasing(value) {
  if (typeof value === "string" && value.trim() !== "") {
    const v = value.trim();
    if (
      typeof CSS === "undefined" ||
      !CSS.supports ||
      CSS.supports("transition-timing-function", v)
    ) {
      return v;
    }
  }
  return DEFAULT_EASING;
}

function toRotation(value) {
  if (typeof value === "number" && Number.isFinite(value)) return `${value}deg`;
  if (typeof value === "string" && /^-?\d*\.?\d+(deg|rad|turn|grad)$/.test(value.trim())) {
    return value.trim();
  }
  return "45deg";
}

function CircleExpand({
  // Background
  image = DEFAULT_IMAGE,
  imageAlt = "",
  imagePosition = "center",
  imageScale = 1.08,
  overlayColor,

  // Content
  topText = "Top Text",
  title = "Card Title",
  description = "Card subtitle",

  // Dimensions / shape
  width = "285px",
  height = "336px",
  minWidth,
  maxWidth,
  borderRadius = "20px",
  className = "",
  style,

  // Initial text colors
  topTextColor = "#ffffff",
  titleColor = "#ffffff",
  descriptionColor = "rgba(255, 255, 255, 0.85)",

  // Hover text colors
  hoverTopTextColor = "#0f3d22",
  hoverTitleColor = "#0f3d22",
  hoverDescriptionColor = "#1d5a36",

  // Circle / arrow
  circleColor = "#b9f0c4",
  arrowColor = "#0f3d22",
  arrowHoverColor,
  arrow = "\u2197",
  showArrow = true,
  circleSize = "44px",
  arrowRotation = 45,

  // Animation
  transitionDuration = 750,
  easing = DEFAULT_EASING,
  hoverScale,
  enableHover = true,
  tapToToggle = true,

  // Interaction
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const cardRef = useRef(null);
  const surfaceRef = useRef(null);
  const pointerTypeRef = useRef("mouse");
  const [active, setActive] = useState(false);

  const interactive = typeof onClick === "function";
  const isActive = enableHover && active;

  const resolvedCircle = toCssLength(circleSize, "44px");
  const resolvedOverlay = overlayColor || circleColor;
  const resolvedArrowHover = arrowHoverColor || arrowColor;

  /**
   * Required scale = (2 * distance from circle center to farthest card corner
   * + safety margin) / circle diameter. Offsets are layout values, so they are
   * unaffected by the transform currently applied to the circle.
   */
  const measure = useCallback(() => {
    const card = cardRef.current;
    const surface = surfaceRef.current;
    if (!card || !surface) return;

    const W = card.clientWidth;
    const H = card.clientHeight;
    const d = surface.offsetWidth;
    if (!W || !H || !d) return;

    const cx = surface.offsetLeft + d / 2;
    const cy = surface.offsetTop + surface.offsetHeight / 2;
    const radius = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));

    // +4px diameter margin hides antialiasing / subpixel seams at the corners.
    const autoScale = (radius * 2 + 4) / d;
    const override =
      typeof hoverScale === "number" && hoverScale > 0 ? hoverScale : null;
    const scale = override ?? autoScale;

    card.style.setProperty("--ce-scale", scale.toFixed(4));
    card.style.setProperty(
      "--ce-title-size",
      `${Math.min(28, Math.max(16, W * 0.075)).toFixed(2)}px`
    );
    card.style.setProperty(
      "--ce-desc-size",
      `${Math.min(15, Math.max(12, W * 0.048)).toFixed(2)}px`
    );
  }, [hoverScale]);

  useIsoLayoutEffect(() => {
    measure();
  }, [measure, resolvedCircle, width, height, borderRadius, showArrow]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => measure());
      ro.observe(card);
    }
    window.addEventListener("resize", measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Touch: tapping outside a toggled-open card closes it.
  useEffect(() => {
    if (!active || pointerTypeRef.current !== "touch") return undefined;
    const onDocPointerDown = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [active]);

  const handlePointerDown = (e) => {
    pointerTypeRef.current = e.pointerType || "mouse";
  };

  const handlePointerEnter = (e) => {
    if (e.pointerType !== "touch") setActive(true);
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType !== "touch") setActive(false);
  };

  const handleClick = (e) => {
    if (tapToToggle && enableHover && pointerTypeRef.current === "touch") {
      setActive((v) => !v);
    }
    if (interactive) onClick(e);
  };

  const handleKeyDown = (e) => {
    if (!interactive) return;
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e);
    }
  };

  const handleFocus = (e) => {
    if (!interactive || e.target !== e.currentTarget) return;
    if (e.currentTarget.matches(":focus-visible")) setActive(true);
  };

  const handleBlur = (e) => {
    if (!interactive) return;
    if (!e.currentTarget.contains(e.relatedTarget)) setActive(false);
  };

  const cssVars = {
    "--ce-width": toCssLength(width, "285px"),
    "--ce-height": toCssLength(height, "336px", "height"),
    "--ce-radius": toCssLength(borderRadius, "20px", "border-radius"),
    "--ce-circle": resolvedCircle,
    "--ce-circle-color": circleColor,
    "--ce-overlay-color": resolvedOverlay,
    "--ce-arrow-color": arrowColor,
    "--ce-arrow-hover-color": resolvedArrowHover,
    "--ce-arrow-rotation": toRotation(arrowRotation),
    "--ce-top-color": topTextColor,
    "--ce-title-color": titleColor,
    "--ce-desc-color": descriptionColor,
    "--ce-top-hover-color": hoverTopTextColor,
    "--ce-title-hover-color": hoverTitleColor,
    "--ce-desc-hover-color": hoverDescriptionColor,
    "--ce-duration": toDuration(transitionDuration),
    "--ce-easing": toEasing(easing),
    "--ce-image-scale":
      typeof imageScale === "number" && imageScale > 0 ? imageScale : 1.08,
    "--ce-image-position":
      typeof imagePosition === "string" && imagePosition.trim()
        ? imagePosition
        : "center",
  };
  if (minWidth !== undefined) {
    cssVars["--ce-min-width"] = toCssLength(minWidth, "0px", "min-width");
  }
  if (maxWidth !== undefined) {
    cssVars["--ce-max-width"] = toCssLength(maxWidth, "100%", "max-width");
  }

  const classes = [
    "ce-card",
    isActive ? "ce-card--active" : "",
    showArrow ? "" : "ce-card--no-arrow",
    interactive ? "ce-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const interactiveProps = interactive
    ? { role: "button", tabIndex: 0 }
    : {};

  return (
    <article
      {...rest}
      {...interactiveProps}
      ref={cardRef}
      className={classes}
      style={{ ...cssVars, ...style }}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {image ? (
        <img
          className="ce-image"
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : null}
      <div className="ce-gradient" aria-hidden="true" />
      <span className="ce-surface" ref={surfaceRef} aria-hidden="true" />

      <div className="ce-content">
        {topText ? <span className="ce-top">{topText}</span> : <span />}
        {title || description ? (
          <div className="ce-text">
            {title ? <h3 className="ce-title">{title}</h3> : null}
            {description ? <p className="ce-description">{description}</p> : null}
          </div>
        ) : null}
      </div>

      {showArrow ? (
        <span className="ce-badge" aria-hidden="true">
          <span className="ce-arrow">{arrow}</span>
        </span>
      ) : null}
    </article>
  );
}

export default CircleExpand;
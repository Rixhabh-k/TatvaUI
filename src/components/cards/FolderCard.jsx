import React, { useEffect, useRef, useState } from "react";
import "../../styles/cards/FolderCard.css";

/* Built-in placeholder artwork so <FolderCard /> works with no props and no network. */
const DEFAULT_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 240">' +
      '<defs>' +
      '<linearGradient id="s" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#a6dcff"/><stop offset=".35" stop-color="#7b6cff"/>' +
      '<stop offset=".7" stop-color="#ff6a88"/><stop offset="1" stop-color="#5cf0b0"/>' +
      "</linearGradient>" +
      '<linearGradient id="f" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#0b0b6b"/><stop offset="1" stop-color="#2a22d0"/>' +
      "</linearGradient></defs>" +
      '<path d="M34 54 L222 28 Q236 27 231 40 L150 208 Q142 222 134 208 L110 130 Z" ' +
      'fill="url(#f)" stroke="url(#s)" stroke-width="12" stroke-linejoin="round"/>' +
      "</svg>"
  );

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
    if (typeof CSS === "undefined" || !CSS.supports || CSS.supports("transition-duration", v)) {
      return v;
    }
  }
  return "650ms";
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

function FolderCard({
  // Image
  image = DEFAULT_IMAGE,
  imageAlt = "",
  imageBackground = "radial-gradient(120% 90% at 15% 0%, #7d5ef2 0%, #4b32dc 48%, #2a1bb0 100%)",
  imageFit = "contain",
  imageWidth = "80%",
  imageHeight = "58%",
  imageTop = "6%",

  // Panel and folder colors
  panelColor = "#08063f",
  folderColor = "#02002f",

  // Folder geometry
  folderHeight = "78%",
  folderOpenHeight = "50%",
  tabWidth = "36%",
  tabHeight = "16px",
  folderRadius = "16px",
  panelPadding = 6,

  // Text content
  label = "01",
  title = "Simple and easy to use",
  description = "Fully customize to suit your needs",
  arrow = "\u2197",
  showArrow = true,

  // Text colors
  labelColor = "#ffffff",
  titleColor = "#ffffff",
  descriptionColor = "rgba(255, 255, 255, 0.6)",
  arrowColor = "rgba(255, 255, 255, 0.85)",

  // Card dimensions and shape
  width = "260px",
  height = "340px",
  minWidth,
  maxWidth,
  borderRadius = "24px",
  className = "",
  style,

  // Animation
  transitionDuration = 650,
  easing = DEFAULT_EASING,
  enableHover = true,
  tapToToggle = true,

  // Interaction
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const cardRef = useRef(null);
  const pointerTypeRef = useRef("mouse");
  const [active, setActive] = useState(false);

  const interactive = typeof onClick === "function";
  const isActive = enableHover && active;

  // Touch: tapping outside an opened card closes it.
  useEffect(() => {
    if (!active || pointerTypeRef.current !== "touch") return undefined;
    const onDocPointerDown = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setActive(false);
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
    if (!interactive || e.target !== e.currentTarget) return;
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
    "--fc-width": toCssLength(width, "260px"),
    "--fc-height": toCssLength(height, "340px", "height"),
    "--fc-radius": toCssLength(borderRadius, "24px", "border-radius"),
    "--fc-panel-padding": toCssLength(panelPadding, "6px", "padding"),
    "--fc-panel-color": panelColor,
    "--fc-folder-color": folderColor,
    "--fc-image-bg": imageBackground,
    "--fc-image-fit": imageFit,
    "--fc-image-w": toCssLength(imageWidth, "80%"),
    "--fc-image-h": toCssLength(imageHeight, "58%", "height"),
    "--fc-image-top": toCssLength(imageTop, "6%", "top"),
    "--fc-folder-h": toCssLength(folderHeight, "78%", "height"),
    "--fc-folder-open-h": toCssLength(folderOpenHeight, "50%", "height"),
    "--fc-tab-w": toCssLength(tabWidth, "36%"),
    "--fc-tab-h": toCssLength(tabHeight, "16px", "height"),
    "--fc-folder-radius": toCssLength(folderRadius, "16px", "border-radius"),
    "--fc-label-color": labelColor,
    "--fc-title-color": titleColor,
    "--fc-desc-color": descriptionColor,
    "--fc-arrow-color": arrowColor,
    "--fc-duration": toDuration(transitionDuration),
    "--fc-easing": toEasing(easing),
  };
  if (minWidth !== undefined) {
    cssVars["--fc-min-width"] = toCssLength(minWidth, "0px", "min-width");
  }
  if (maxWidth !== undefined) {
    cssVars["--fc-max-width"] = toCssLength(maxWidth, "100%", "max-width");
  }

  const classes = [
    "fc-card",
    isActive ? "fc-card--open" : "",
    interactive ? "fc-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const interactiveProps = interactive ? { role: "button", tabIndex: 0 } : {};

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
      <div className="fc-inner">
        {image ? (
          <div className="fc-stage">
            <div className="fc-media">
              <img
                className="fc-image"
                src={image}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        ) : null}

        <div className="fc-folder">
          <span className="fc-tab" aria-hidden="true" />
          <span className="fc-body" aria-hidden="true" />

          {label ? <span className="fc-label">{label}</span> : null}
          {showArrow && arrow ? (
            <span className="fc-arrow" aria-hidden="true">
              {arrow}
            </span>
          ) : null}

          {title || description ? (
            <div className="fc-text">
              {title ? <h3 className="fc-title">{title}</h3> : null}
              {description ? <p className="fc-description">{description}</p> : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default FolderCard;
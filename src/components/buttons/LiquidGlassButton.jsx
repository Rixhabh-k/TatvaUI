import React, { forwardRef, useEffect, useRef, useState } from "react";
import "../../styles/buttons/LiquidGlassButton.css";

/**
 * @typedef {Object} LiquidGlassButtonProps
 * @property {string} [text="Get started"] Button label. Ignored if `children` is provided.
 * @property {React.ReactNode} [children] Custom label content. Takes priority over `text`.
 * @property {number|string} [padding="22px 64px"] Number = px, or any CSS padding value ("20px 56px").
 * @property {number|string} [borderRadius="9999px"] Number = px, or any CSS length. Default is a pill.
 * Also accepts every normal <button> prop (onClick, disabled, className, style, ...) and a ref.
 */

let idCounter = 0;

/** Numbers become px; strings must be valid CSS for `property`, else undefined. */
function toCss(value, property) {
  if (typeof value === "number" && Number.isFinite(value)) return `${value}px`;
  if (typeof value === "string" && value.trim() !== "") {
    const v = value.trim();
    if (typeof CSS === "undefined" || typeof CSS.supports !== "function" || CSS.supports(property, v)) {
      return v;
    }
  }
  return undefined;
}

/**
 * Real refraction (backdrop-filter: url(#svg-filter)) is only rendered by
 * Chromium browsers (Chrome, Edge, Opera, ...). Elsewhere the glass falls back
 * to a frosted blur, so the button still looks good.
 */
function supportsRefraction() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") return false;
  if (!CSS.supports("backdrop-filter", "url(#a)")) return false;
  return /\bChrome\/\d+/.test(navigator.userAgent);
}

/**
 * Builds the displacement map for a rounded rectangle (w x h, corner radius r).
 * Inside the "bezel" (a band along the edge) every pixel stores a direction
 * pointing inward and a strength that is largest at the rim and fades to zero
 * at the inner edge of the band. Red = x displacement, green = y displacement,
 * 128 = no displacement. Pixels deeper than the bezel are untouched, so the
 * centre of the button shows the background normally, while the rim bends it
 * like the edge of a water drop.
 */
export function computeDisplacementMap(w, h, r, bezel) {
  const data = new Uint8ClampedArray(w * h * 4);
  const hx = w / 2;
  const hy = h / 2;
  const bx = hx - r;
  const by = hy - r;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const px = x + 0.5 - hx;
      const py = y + 0.5 - hy;
      const sx = px >= 0 ? 1 : -1;
      const sy = py >= 0 ? 1 : -1;
      const qx = Math.abs(px) - bx;
      const qy = Math.abs(py) - by;

      // Signed distance to the rounded rectangle and its outward normal.
      let sdf;
      let nx;
      let ny;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy);
        sdf = len - r;
        nx = (qx / len) * sx;
        ny = (qy / len) * sy;
      } else if (qx > qy) {
        sdf = qx - r;
        nx = sx;
        ny = 0;
      } else {
        sdf = qy - r;
        nx = 0;
        ny = sy;
      }

      const depth = Math.max(0, -sdf);
      let dx = 0;
      let dy = 0;
      if (depth < bezel) {
        const u = 1 - depth / bezel; // 1 at the rim, 0 at the inner edge of the bezel
        const strength = u * u;
        dx = -nx * strength; // inward
        dy = -ny * strength;
      }

      const i = (y * w + x) * 4;
      data[i] = 127.5 + 127.5 * dx;
      data[i + 1] = 127.5 + 127.5 * dy;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  return data;
}

function mapToDataUrl(w, h, r, bezel) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const image = ctx.createImageData(w, h);
  image.data.set(computeDisplacementMap(w, h, r, bezel));
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

function parseRadius(computed, w, h) {
  const max = Math.min(w, h) / 2;
  const n = parseFloat(computed);
  if (!Number.isFinite(n)) return max;
  const px = String(computed).trim().endsWith("%") ? (n / 100) * Math.min(w, h) : n;
  return Math.max(0, Math.min(px, max));
}

const LiquidGlassButton = forwardRef(function LiquidGlassButton(
  {
    text = "Get started",
    children,
    padding,
    borderRadius,
    className,
    style,
    type = "button",
    ...rest
  },
  ref
) {
  const glassRef = useRef(null);
  const idRef = useRef(null);
  if (idRef.current === null) {
    idCounter += 1;
    idRef.current = `lgb-refract-${idCounter}`;
  }
  const filterId = idRef.current;

  // { url, w, h, scale } once the refraction map exists (Chromium only).
  const [refraction, setRefraction] = useState(null);

  useEffect(() => {
    const glass = glassRef.current;
    if (!glass || !supportsRefraction()) return undefined;

    let frame = 0;
    let lastKey = "";

    const update = () => {
      // offsetWidth/Height are layout sizes: unaffected by the hover/press transform.
      const w = Math.round(glass.offsetWidth);
      const h = Math.round(glass.offsetHeight);
      if (!w || !h) return;

      const r = parseRadius(getComputedStyle(glass).borderTopLeftRadius, w, h);
      const bezel = Math.max(8, Math.min(28, Math.min(w, h) * 0.35));
      const key = `${w}x${h}:${r.toFixed(1)}:${bezel.toFixed(1)}`;
      if (key === lastKey) return;
      lastKey = key;

      const url = mapToDataUrl(w, h, r, bezel);
      if (!url) return;
      // feDisplacementMap moves pixels by scale * (channel - 0.5), so scale = 2 * max shift.
      setRefraction({ url, w, h, scale: bezel * 0.9 * 2 });
    };

    update();

    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
      });
      observer.observe(glass);
    }
    return () => {
      cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
    };
  }, [padding, borderRadius, text, children]);

  // Variables are only set when a prop is passed, so stylesheet defaults still apply.
  const vars = {};
  const pad = toCss(padding, "padding");
  if (pad) vars["--lgb-padding"] = pad;
  const radius = toCss(borderRadius, "border-radius");
  if (radius) vars["--lgb-radius"] = radius;

  const glassStyle = refraction
    ? {
        "--lgb-backdrop": `url(#${filterId}) blur(1px) saturate(var(--lgb-saturate)) brightness(1.04)`,
      }
    : undefined;

  const classes = ["lgb", className].filter(Boolean).join(" ");

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={classes}
      data-refract={refraction ? "true" : "false"}
      style={{ ...vars, ...style }}
    >
      {refraction ? (
        <svg className="lgb-defs" width="0" height="0" aria-hidden="true" focusable="false">
          <filter
            id={filterId}
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={refraction.w}
            height={refraction.h}
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={refraction.url}
              x="0"
              y="0"
              width={refraction.w}
              height={refraction.h}
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={refraction.scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      ) : null}

      <span className="lgb-move">
        <span className="lgb-glass" ref={glassRef} style={glassStyle} aria-hidden="true" />
        <span className="lgb-fx">
          <span className="lgb-box">
            <span className="lgb-ring" aria-hidden="true" />
            <span className="lgb-text">{children ?? text}</span>
          </span>
        </span>
      </span>
    </button>
  );
});

LiquidGlassButton.displayName = "LiquidGlassButton";

export default LiquidGlassButton;
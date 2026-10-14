import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/cards/pixelhover.css";

/* ------------------------------------------------------------------
   Default images
   Yahan apni CDN image URLs daal do. Khali ("") chhodoge to built-in
   gradient placeholders dikhte hain.
------------------------------------------------------------------- */
const DEFAULT_IMAGE = "https://ik.imagekit.io/rixhabh/Tattva%20UI%20Default%20Images/mode-1";
const DEFAULT_HOVER_IMAGE = "https://ik.imagekit.io/rixhabh/Tattva%20UI%20Default%20Images/model-2.jpg";

/* ------------------------------------------------------------------
   pixelSize (2 - 5) ko is unit se multiply karke asli block size banta hai.
   6 => 12px - 30px blocks (video jaisa look).
   Literal 2px - 5px blocks chahiye to PIXEL_UNIT = 1 kar do.
------------------------------------------------------------------- */
const PIXEL_UNIT = 6;

const MIN_PIXEL_SIZE = 2;
const MAX_PIXEL_SIZE = 5;
const MIN_DURATION = 0.1; // seconds
const MAX_DURATION = 5; // seconds

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/* ================================================================== */
/* ---- engine ---- (canvas pixel transition, koi external lib nahi)  */
/* ================================================================== */

const makeCanvas = (w, h) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
};

/** "center", "left top", "50% 20%" jaisi position ko 0-1 fractions me badalta hai */
function parsePosition(position) {
  const keywords = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };
  const tokens = String(position ?? "center").trim().split(/\s+/);
  const toFraction = (token, fallback) => {
    if (token === undefined) return fallback;
    if (token in keywords) return keywords[token];
    const value = parseFloat(token);
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value / 100)) : fallback;
  };
  const x = toFraction(tokens[0], 0.5);
  // "top" / "bottom" pehle likha ho (jaise "top left") to axes swap
  const yFirst = tokens[0] === "top" || tokens[0] === "bottom";
  if (tokens.length === 1) return yFirst ? [0.5, x] : [x, 0.5];
  const y = toFraction(tokens[1], 0.5);
  return yFirst ? [y, x] : [x, y];
}

/** Image ko canvas me "cover" ya "contain" style me draw karta hai */
function drawFit(ctx, img, w, h, options = {}) {
  const { fit = "cover", position = "center", background = "#e7e5e0" } = options;
  const [fx, fy] = parsePosition(position);
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  if (fit === "contain") {
    const scale = Math.min(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) * fx, (h - dh) * fy, dw, dh);
    return;
  }

  const imgRatio = iw / ih;
  const boxRatio = w / h;
  let sw, sh;
  if (imgRatio > boxRatio) {
    sh = ih;
    sw = sh * boxRatio;
  } else {
    sw = iw;
    sh = sw / boxRatio;
  }
  ctx.drawImage(img, (iw - sw) * fx, (ih - sh) * fy, sw, sh, 0, 0, w, h);
}

/** Canvas ka size, cells ka grid aur random reveal order tayyar karta hai */
function layout(canvas, e, cell) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  canvas.width = w;
  canvas.height = h;

  e.w = w;
  e.h = h;
  e.cellPx = Math.max(1, Math.round(cell * dpr));
  e.cols = Math.ceil(w / e.cellPx);
  e.rows = Math.ceil(h / e.cellPx);

  // Fisher-Yates shuffle: har cell kab reveal hoga uska random order
  const total = e.cols * e.rows;
  const order = new Uint32Array(total);
  for (let i = 0; i < total; i++) order[i] = i;
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  e.order = order;

  e.A = makeCanvas(w, h); // default image / color
  e.B = makeCanvas(w, h); // hover image / color
  e.M = makeCanvas(w, h); // mask: jahan B dikhna hai
  e.buf = makeCanvas(w, h);
  e.revealed = 0;
  return true;
}

function paintSources(e, drawFrom, drawTo) {
  const a = e.A.getContext("2d");
  a.clearRect(0, 0, e.w, e.h);
  drawFrom(a, e.w, e.h);

  const b = e.B.getContext("2d");
  b.clearRect(0, 0, e.w, e.h);
  drawTo(b, e.w, e.h);
}

/** Mask me sirf naye cells add / remove karta hai (incremental, fast) */
function applyProgress(e, progress) {
  const total = e.order.length;
  const next = Math.round(progress * total);
  const m = e.M.getContext("2d");
  const { cols, cellPx, order } = e;

  if (next > e.revealed) {
    m.fillStyle = "#000";
    for (let i = e.revealed; i < next; i++) {
      const c = order[i];
      m.fillRect((c % cols) * cellPx, Math.floor(c / cols) * cellPx, cellPx, cellPx);
    }
  } else if (next < e.revealed) {
    for (let i = next; i < e.revealed; i++) {
      const c = order[i];
      m.clearRect((c % cols) * cellPx, Math.floor(c / cols) * cellPx, cellPx, cellPx);
    }
  }
  e.revealed = next;
}

function render(canvas, e) {
  const ctx = canvas.getContext("2d");
  const total = e.order.length;
  ctx.clearRect(0, 0, e.w, e.h);

  // Start / end par seedha ek hi source draw (koi seam nahi)
  if (e.revealed <= 0) {
    ctx.drawImage(e.A, 0, 0);
    return;
  }
  if (e.revealed >= total) {
    ctx.drawImage(e.B, 0, 0);
    return;
  }

  ctx.drawImage(e.A, 0, 0);

  const b = e.buf.getContext("2d");
  b.globalCompositeOperation = "source-over";
  b.clearRect(0, 0, e.w, e.h);
  b.drawImage(e.B, 0, 0);
  b.globalCompositeOperation = "destination-in";
  b.drawImage(e.M, 0, 0);
  b.globalCompositeOperation = "source-over";

  ctx.drawImage(e.buf, 0, 0);
}

/* ---- end engine ---- */

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

/** Image load karta hai (CORS ki zarurat nahi, kyunki pixels read nahi karte) */
function useLoadedImage(src) {
  const [state, setState] = useState({ img: null, failed: false });

  useEffect(() => {
    if (!src) {
      setState({ img: null, failed: false });
      return undefined;
    }
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!cancelled) setState({ img, failed: false });
    };
    img.onerror = () => {
      if (!cancelled) setState({ img: null, failed: true });
    };
    img.src = src;
    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return state;
}

/**
 * Canvas par "from" se "to" tak pixel-by-pixel transition chalata hai.
 * active = true  -> "to" ki taraf, active = false -> wapas "from" ki taraf.
 * Beech me hover hat jaye to wahin se reverse hota hai.
 */
function usePixelCanvas(canvasRef, { drawFrom, drawTo, cell, duration, active }) {
  const engine = useRef({ p: 0, raf: 0, order: null });
  const drawers = useRef({ drawFrom, drawTo });
  drawers.current = { drawFrom, drawTo };

  // Layout + resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const e = engine.current;

    const setup = () => {
      if (!layout(canvas, e, cell)) return;
      paintSources(e, drawers.current.drawFrom, drawers.current.drawTo);
      applyProgress(e, e.p);
      render(canvas, e);
    };

    setup();

    let frame = 0;
    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(setup);
      });
      observer.observe(canvas);
    }
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [canvasRef, cell]);

  // Source (image load / color change) badle to dobara paint
  useEffect(() => {
    const canvas = canvasRef.current;
    const e = engine.current;
    if (!canvas || !e.order) return;
    paintSources(e, drawFrom, drawTo);
    render(canvas, e);
  }, [canvasRef, drawFrom, drawTo]);

  // Hover state badle to animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const e = engine.current;
    if (!canvas) return undefined;

    const target = active ? 1 : 0;
    cancelAnimationFrame(e.raf);

    if (!e.order) {
      e.p = target;
      return undefined;
    }

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const from = e.p;
    const ms = duration * 1000 * Math.abs(target - from);

    if (reduceMotion || ms <= 0) {
      e.p = target;
      applyProgress(e, target);
      render(canvas, e);
      return undefined;
    }

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / ms));
      e.p = from + (target - from) * t;
      applyProgress(e, e.p);
      render(canvas, e);
      if (t < 1) e.raf = requestAnimationFrame(tick);
    };
    e.raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(e.raf);
  }, [canvasRef, active, duration]);
}

/* ------------------------------------------------------------------ */
/* Painters                                                            */
/* ------------------------------------------------------------------ */

const paintColor = (color) => (ctx, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
};

// Built-in placeholders (jab image na di ho)
const fallbackDefault = (ctx, w, h) => {
  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, "#6d28d9");
  base.addColorStop(1, "#2e1065");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const blob = ctx.createRadialGradient(w * 0.45, h * 0.5, 0, w * 0.45, h * 0.5, w * 0.5);
  blob.addColorStop(0, "rgba(196, 181, 253, 0.9)");
  blob.addColorStop(1, "rgba(196, 181, 253, 0)");
  ctx.fillStyle = blob;
  ctx.fillRect(0, 0, w, h);
};

const fallbackHover = (ctx, w, h) => {
  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, "#ede9fe");
  base.addColorStop(1, "#a78bfa");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const blob = ctx.createRadialGradient(w * 0.5, h * 0.62, 0, w * 0.5, h * 0.62, w * 0.32);
  blob.addColorStop(0, "#4c1d95");
  blob.addColorStop(1, "rgba(76, 29, 149, 0)");
  ctx.fillStyle = blob;
  ctx.fillRect(0, 0, w, h);
};

const makeImagePainter = ({ img, src, failed }, fallback, fitOptions) => (ctx, w, h) => {
  if (img) {
    drawFit(ctx, img, w, h, fitOptions);
  } else if (src && !failed) {
    // Image load ho rahi hai
    ctx.fillStyle = "#e7e5e0";
    ctx.fillRect(0, 0, w, h);
  } else {
    fallback(ctx, w, h);
  }
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * PixelHover
 *
 * Images
 * @param {string}  [props.image]        Default image URL
 * @param {string}  [props.hoverImage]   Hover par dikhne wali image URL
 * @param {string}  [props.imageAlt]     Alt text (default: title)
 *
 * Image size (user ki image ke hisaab se adjust karo)
 * @param {number|string} [props.imageHeight]       Image area ki fixed height (number = px, ya "16rem")
 * @param {number|string} [props.imageAspectRatio]  Height na do to ratio: 1, 1.2, "4 / 5", "16 / 9" (default "6 / 5")
 * @param {"cover"|"contain"} [props.imageFit="cover"]  cover: area bharo (crop), contain: poori image dikhao
 * @param {string}  [props.imagePosition="center"]  Crop ka focus: "center top", "50% 20%", etc.
 * @param {string}  [props.imageBackground="#e7e5e0"]  contain me khali jagah ka color
 *
 * Content
 * @param {string}  [props.title="Atlas Knit Cardigan"]
 * @param {string}  [props.description]
 * @param {string}  [props.priceLabel="Price"]
 * @param {string}  [props.price="€129"]
 * @param {string}  [props.buttonText="Buy Now"]
 * @param {string}  [props.buttonHref]       Dene par button link ban jata hai
 * @param {string}  [props.buttonTarget]
 * @param {Function} [props.onButtonClick]
 *
 * Colors (optional, CSS color)
 * @param {string}  [props.cardColor="#ffffff"]
 * @param {string}  [props.titleColor]
 * @param {string}  [props.descriptionColor]
 * @param {string}  [props.priceLabelColor]
 * @param {string}  [props.priceColor]
 * @param {string}  [props.buttonColor="#7c3aed"]        Button ka default color (purple)
 * @param {string}  [props.buttonHoverColor="#4c1d95"]   Hover par button ka color (dark purple)
 * @param {string}  [props.buttonTextColor="#ffffff"]
 *
 * Animation
 * @param {number}  [props.pixelSize=3]   2 se 5 (isse bahar ka value clamp ho jata hai)
 * @param {number}  [props.duration=0.7]  Seconds (0.1 se 5)
 * @param {boolean} [props.showGrid=false]  Pixel grid ki halki lines
 * @param {string}  [props.gridColor]
 *
 * Layout
 * @param {string}  [props.className]
 * @param {object}  [props.style]
 */
function PixelHover({
  image = DEFAULT_IMAGE,
  hoverImage = DEFAULT_HOVER_IMAGE,
  imageAlt,
  imageHeight,
  imageAspectRatio,
  imageFit = "cover",
  imagePosition = "center",
  imageBackground = "#e7e5e0",

  title = "Atlas Knit Cardigan",
  description = "Chunky merino knit in burnt sienna with horn buttons and a relaxed fit.",
  priceLabel = "Price",
  price = "€129",
  buttonText = "Buy Now",
  buttonHref,
  buttonTarget,
  onButtonClick,

  cardColor,
  titleColor,
  descriptionColor,
  priceLabelColor,
  priceColor,
  buttonColor = "#7c3aed",
  buttonHoverColor = "#4c1d95",
  buttonTextColor,

  pixelSize = 3,
  duration = 0.7,
  showGrid = false,
  gridColor,

  className = "",
  style,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const pointerType = useRef("mouse");
  const active = hovered || focused || tapped;

  // Valid range me clamp (2 - 5 aur 0.1 - 5s)
  const size = clamp(Number.isFinite(Number(pixelSize)) ? Number(pixelSize) : 3, MIN_PIXEL_SIZE, MAX_PIXEL_SIZE);
  const seconds = clamp(Number.isFinite(Number(duration)) ? Number(duration) : 0.7, MIN_DURATION, MAX_DURATION);
  const cell = Math.round(size * PIXEL_UNIT);
  const buttonCell = Math.max(2, Math.round(cell * 0.4));

  // Image layer
  const imageCanvas = useRef(null);
  const from = useLoadedImage(image);
  const to = useLoadedImage(hoverImage);
  const fitOptions = useMemo(
    () => ({ fit: imageFit, position: imagePosition, background: imageBackground }),
    [imageFit, imagePosition, imageBackground]
  );
  const drawImageFrom = useMemo(
    () => makeImagePainter({ img: from.img, src: image, failed: from.failed }, fallbackDefault, fitOptions),
    [from.img, from.failed, image, fitOptions]
  );
  const drawImageTo = useMemo(
    () => makeImagePainter({ img: to.img, src: hoverImage, failed: to.failed }, fallbackHover, fitOptions),
    [to.img, to.failed, hoverImage, fitOptions]
  );
  usePixelCanvas(imageCanvas, {
    drawFrom: drawImageFrom,
    drawTo: drawImageTo,
    cell,
    duration: seconds,
    active,
  });

  // Dev warnings: image ki problem pehchanne me madad (production me nahi chalte)
  useEffect(() => {
    let isProduction = false;
    try {
      isProduction = process.env.NODE_ENV === "production";
    } catch {
      isProduction = false;
    }
    if (isProduction) return;

    if (image && !hoverImage) {
      console.warn(
        "[PixelHover] `hoverImage` nahi diya, isliye hover par built-in gradient dikhega. Image se image badalne ke liye `hoverImage` do."
      );
    }
    if (image && hoverImage && image === hoverImage) {
      console.warn(
        "[PixelHover] `image` aur `hoverImage` same hain, isliye pixel effect dikhega nahi."
      );
    }
    if (from.failed) console.warn(`[PixelHover] \`image\` load nahi hui: ${image}`);
    if (to.failed) console.warn(`[PixelHover] \`hoverImage\` load nahi hui: ${hoverImage}`);
  }, [image, hoverImage, from.failed, to.failed]);

  // Button layer
  const buttonCanvas = useRef(null);
  const drawButtonFrom = useMemo(() => paintColor(buttonColor), [buttonColor]);
  const drawButtonTo = useMemo(() => paintColor(buttonHoverColor), [buttonHoverColor]);
  usePixelCanvas(buttonCanvas, {
    drawFrom: drawButtonFrom,
    drawTo: drawButtonTo,
    cell: buttonCell,
    duration: seconds,
    active,
  });

  const vars = {
    "--tattva-ph-bg": cardColor,
    "--tattva-ph-title": titleColor,
    "--tattva-ph-description": descriptionColor,
    "--tattva-ph-label": priceLabelColor,
    "--tattva-ph-price": priceColor,
    "--tattva-ph-button-text": buttonTextColor,
    "--tattva-ph-grid": gridColor,
  };
  // Sirf wahi variables inline jo user ne diye, baaki CSS se override ho sakte hain
  const inlineVars = Object.fromEntries(
    Object.entries(vars).filter(([, value]) => value !== undefined)
  );
  if (imageHeight !== undefined) {
    inlineVars["--tattva-ph-media-height"] =
      typeof imageHeight === "number" ? `${imageHeight}px` : imageHeight;
  }
  if (imageAspectRatio !== undefined) {
    inlineVars["--tattva-ph-media-ratio"] = String(imageAspectRatio);
  }
  inlineVars["--tattva-ph-cell"] = `${cell}px`;
  inlineVars["--tattva-ph-button-cell"] = `${buttonCell}px`;

  const buttonProps = buttonHref
    ? {
        href: buttonHref,
        target: buttonTarget,
        rel: buttonTarget === "_blank" ? "noopener noreferrer" : undefined,
      }
    : { type: "button" };
  const ButtonTag = buttonHref ? "a" : "button";

  return (
    <div
      {...props}
      data-active={active}
      className={`tattva-pixel-hover ${className}`.trim()}
      style={{ ...inlineVars, ...style }}
      onPointerDown={(e) => {
        pointerType.current = e.pointerType;
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") setHovered(false);
      }}
      onFocus={(e) => {
        if (e.target.matches?.(":focus-visible")) setFocused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      {/* ---------- Image ---------- */}
      <div
        className="tattva-pixel-hover__media"
        data-grid={showGrid}
        onClick={() => {
          // Touch devices par hover nahi hota, isliye tap se toggle
          if (pointerType.current === "touch") setTapped((value) => !value);
        }}
      >
        <canvas
          ref={imageCanvas}
          className="tattva-pixel-hover__canvas"
          role="img"
          aria-label={imageAlt ?? title}
        />
      </div>

      {/* ---------- Content ---------- */}
      <div className="tattva-pixel-hover__body">
        {title && <h3 className="tattva-pixel-hover__title">{title}</h3>}
        {description && (
          <p className="tattva-pixel-hover__description">{description}</p>
        )}

        <div className="tattva-pixel-hover__footer">
          <div className="tattva-pixel-hover__price-block">
            {priceLabel && (
              <span className="tattva-pixel-hover__price-label">{priceLabel}</span>
            )}
            {price && <span className="tattva-pixel-hover__price">{price}</span>}
          </div>

          <ButtonTag
            {...buttonProps}
            className="tattva-pixel-hover__button"
            data-grid={showGrid}
            onClick={onButtonClick}
            style={{ backgroundColor: buttonColor }}
          >
            <canvas
              ref={buttonCanvas}
              className="tattva-pixel-hover__button-canvas"
              aria-hidden="true"
            />
            <span className="tattva-pixel-hover__button-label">{buttonText}</span>
          </ButtonTag>
        </div>
      </div>
    </div>
  );
}

export default PixelHover;

/* ---------------- Usage ----------------

// Default data ke saath
<PixelHover />

// Apna data
<PixelHover
  className="product-card"
  image="https://cdn.example.com/flat-lay.jpg"
  hoverImage="https://cdn.example.com/model.jpg"
  title="Atlas Knit Cardigan"
  description="Chunky merino knit in burnt sienna."
  price="€129"
  buttonText="Add to Cart"
  buttonHref="/products/atlas"
  cardColor="#ffffff"
  imageHeight={260}          // ya imageAspectRatio="4 / 5"
  imageFit="cover"
  imagePosition="center top" // face / subject upar ho to
  buttonColor="#7c3aed"
  buttonHoverColor="#4c1d95"
  pixelSize={4}
  duration={0.9}
/>

------------------------------------------ */
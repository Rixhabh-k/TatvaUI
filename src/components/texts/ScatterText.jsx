import { useEffect, useRef } from "react";
import "../../styles/texts/scatterLoading.css";


const PERIOD = 3.33; // one full loop, seconds (at speed = 1)
const SWEEP = 1.06; // time for the sweep to cross the word
const RISE = 0.62;
const DRIFT_START = 0.63;
const DRIFT_TIME = 0.98;
const FALL_START = 1.65;
const FALL_TIME = 0.4;
const LIFE = FALL_START + FALL_TIME; // 2.05
const HOLD_START = SWEEP + LIFE; // after this every run is home
const PAD = 2; // css px of horizontal breathing room inside the canvas

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (u) => u * u * (3 - 2 * u);
const easeInOutQuad = (u) => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u));

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


function runOffset(r, tau) {
  if (tau <= 0 || tau >= LIFE) return 0;
  const lift = r.amp * easeInOutQuad(clamp01(tau / RISE));
  const sag = r.drift * smoothstep(clamp01((tau - DRIFT_START) / DRIFT_TIME));
  const fall = smoothstep(clamp01((tau - FALL_START) / FALL_TIME));
  return Math.sign(r.amp) * (Math.abs(lift) - sag) * (1 - fall);
}


function buildScene({
  text,
  fontFamily,
  fontWeight,
  fontSize,
  color,
  spread,
  drift,
  seed,
  dpr,
}) {
  const measure = document.createElement("canvas").getContext("2d");
  measure.font = `${fontWeight} ${fontSize * dpr}px ${fontFamily}`;
  const m = measure.measureText(text);

  const textW = m.width / dpr;
  const lineH = Math.ceil(fontSize * 1.2);
  const spreadPx = Math.ceil(spread * fontSize);

  const cssW = Math.ceil(textW) + PAD * 2;
  const cssH = lineH + spreadPx * 2;
  const W = Math.ceil(cssW * dpr);
  const H = Math.ceil(cssH * dpr);

  const src = document.createElement("canvas");
  src.width = W;
  src.height = H;
  const ctx = src.getContext("2d", { willReadFrequently: true });
  ctx.font = measure.font;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  // put the baseline exactly where the DOM text's baseline sits (line-height 1.2),
  // so swapping the plain text for the canvas doesn't move the word
  let baseline;
  if (m.fontBoundingBoxAscent != null) {
    // browsers round the font's ascent/descent to whole css px before centring it in the line box
    const asc = Math.round(m.fontBoundingBoxAscent / dpr);
    const desc = Math.round(m.fontBoundingBoxDescent / dpr);
    const lh = fontSize * 1.2;
    const domBaseline = Math.round((lh - (asc + desc)) / 2 + asc);
    baseline = (H / dpr / 2 - lh / 2 + domBaseline) * dpr;
  } else {
    baseline =
      H / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  }
  ctx.fillText(text, PAD * dpr, baseline);

  const { data } = ctx.getImageData(0, 0, W, H);
  const strip = Math.max(1, Math.round(dpr)); // = 1 css px wide
  const rand = mulberry32(seed);
  const maxShift = spread * fontSize * dpr;
  const driftPx = drift * fontSize * dpr;
  const inkW = Math.max(1, textW * dpr);

  const runs = [];
  for (let sx = 0; sx < W; sx += strip) {
    const w = Math.min(strip, W - sx);
    let start = -1;
    for (let y = 0; y <= H; y++) {
      let on = false;
      if (y < H) {
        let a = 0;
        for (let k = 0; k < w; k++)
          a = Math.max(a, data[(y * W + sx + k) * 4 + 3]);
        on = a > 8;
      }
      if (on && start < 0) start = y;
      if (!on && start >= 0) {
        const len = y - start;
        const nx = clamp01((sx - PAD * dpr) / inkW);
        let amp = (rand() * 2 - 1) * maxShift;
        amp = Math.max(-start, Math.min(H - len - start, amp)); // stay inside canvas
        // the slow return is a fixed distance, a touch different per run,
        // and never carries a short run past home
        const sag = Math.min(
          driftPx * (0.88 + 0.24 * rand()),
          Math.abs(amp) * 0.75,
        );
        runs.push({
          sx,
          w,
          y: start,
          len,
          amp,
          drift: sag,
          startAt: nx * SWEEP,
        });
        start = -1;
      }
    }
  }

  return { src, runs, W, H, cssW, cssH };
}

/**
 * @param {string}  text        Word to animate.
 * @param {number}  fontSize    px.
 * @param {number}  spread      How far streaks fly, in em (vertical, ±).
 * @param {number}  drift       How far they float back while scattered, in em.
 * @param {number}  speed       Playback multiplier.
 * @param {number}  seed        Changes the scatter pattern.
 * @param {boolean} subpixel    Animate between whole pixels (no stepping).
 * @param {boolean} paused      Freeze on the finished word.
 * @param {string}  color       Any CSS colour. Defaults to the inherited text colour.
 */
function ScatterText({
  text = "Loading",
  fontSize = 51,
  fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontWeight = 400,
  color = "#fff",
  spread = 1.5,
  drift = 0.5,
  speed = 1,
  seed = 1,
  subpixel = true,
  paused = false,
  className = "",
  style,
  ...props
}) {
  const size = Number.parseFloat(String(fontSize)) || 51; // px
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined; // the plain text stays visible

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = window.devicePixelRatio || 1;
    let raf = 0;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      try {
        const { src, runs, W, H, cssW, cssH } = buildScene({
          text,
          fontFamily,
          fontWeight,
          fontSize: size,
          color: color || getComputedStyle(wrap).color,
          spread,
          drift,
          seed,
          dpr,
        });

        if (!runs.length || W < 1 || H < 1) {
          // nothing was drawn (e.g. transparent text colour): keep the plain text visible
          console.warn(
            "[ScatterLoadingText] no ink to animate – is the text colour transparent? Showing plain text.",
          );
          return;
        }

        canvas.width = W;
        canvas.height = H;
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;

        const drawFormed = () => {
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(src, 0, 0);
        };

        // first paint, then (and only then) swap the plain text for the canvas
        drawFormed();
        wrap.setAttribute("data-ready", "true");

        if (paused) return;

        // begin on the "formed" hold so the word is readable immediately
        const t0 = performance.now() - (HOLD_START / speed) * 1000;

        const frame = (now) => {
          const phase = (((now - t0) / 1000) * speed) % PERIOD;

          if (phase >= HOLD_START) {
            drawFormed();
          } else {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < runs.length; i++) {
              const r = runs[i];
              const off = runOffset(r, phase - r.startAt);
              const y = r.y + (subpixel ? off : Math.round(off));
              ctx.drawImage(src, r.sx, r.y, r.w, r.len, r.sx, y, r.w, r.len);
            }
          }
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      } catch (err) {
        console.warn(
          "[ScatterLoadingText] could not start, showing plain text:",
          err,
        );
      }
    };

    // wait for the web font so we sample the real glyphs – but never wait forever
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      start();
    };
    const fontSpec = `${fontWeight} ${size}px ${fontFamily}`;
    const timer = window.setTimeout(go, 1500);
    if (document.fonts?.load) {
      document.fonts.load(fontSpec, text).then(go, go);
    } else {
      go();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      wrap.removeAttribute("data-ready");
    };
  }, [
    text,
    size,
    fontFamily,
    fontWeight,
    color,
    spread,
    drift,
    speed,
    seed,
    subpixel,
    paused,
  ]);

  return (
    <span
      {...props}
      ref={wrapRef}
      className={`velmora-scatter-loading ${className}`.trim()}
      style={{ fontSize: size, fontFamily, fontWeight, color, ...style }}>
      <span className="velmora-scatter-loading__sr" role="status">
        {text}
      </span>
      {/* plain text: shown until the canvas has painted (and kept if it can't run);
          it also gives the component its layout box */}
      <span className="velmora-scatter-loading__text" aria-hidden="true">
        {text}
      </span>
      <canvas
        ref={canvasRef}
        className="velmora-scatter-loading__canvas"
        aria-hidden="true"
      />
    </span>
  );
}

export default ScatterText;

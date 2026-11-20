import { useMemo } from "react";
import "../../styles/cards/dotMatrixLoader.css";

// deterministic pseudo-random so the pattern is stable between renders
const rand = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export default function DotMatrixLoader({
  grid = 23, // dots per row / column
  cell = 14, // px size of one grid cell
  duration = 3.6, // seconds for one full burst cycle
  petals = 4, // lobes of the burst (spikes = petals * 2)
  inner = "#ffd166", // colour at the centre
  outer = "#ff4d8d", // colour at the edges
  label,
  progress,
  className = "",
  style,
  ...props
}) {
  // keep the grid odd so the burst has a true centre dot
  const cols = grid % 2 === 0 ? grid + 1 : grid;

  const dots = useMemo(() => {
    const c = (cols - 1) / 2;
    const list = [];
    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        const dx = col - c;
        const dy = row - c;
        const dist = Math.hypot(dx, dy) / c;
        const edge =
          0.68 + 0.32 * Math.abs(Math.cos(Math.atan2(dy, dx) * petals));
        const lit = dist <= edge;
        const t = Math.min(dist / edge, 1);
        const jitter = rand(i);
        list.push({
          key: i,
          lit,
          t,
          peak: Math.min(
            1.1,
            Math.max(0.35, 1.05 - 0.55 * t + (jitter - 0.5) * 0.3),
          ),
          delay: dist * duration * 0.26 + jitter * 0.14,
        });
      }
    }
    return list;
  }, [cols, petals, duration]);

  const hasProgress = typeof progress === "number";
  const percent = hasProgress
    ? Math.min(100, Math.max(0, Math.round(progress)))
    : 0;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || "Loading"}
      className={`tatva-dot-matrix ${className}`.trim()}
      style={{
        "--tatva-dm-cols": cols,
        "--tatva-dm-cell": `${cell}px`,
        "--tatva-dm-dur": `${duration}s`,
        "--tatva-dm-inner": inner,
        "--tatva-dm-outer": outer,
        ...style,
      }}
      {...props}>
      {label && <span className="tatva-dot-matrix__label">{label}</span>}
      <div className="tatva-dot-matrix__grid" aria-hidden="true">
        {dots.map((d) => (
          <span
            key={d.key}
            className={`tatva-dot-matrix__dot${d.lit ? " tatva-dot-matrix__dot--lit" : ""}`}
            style={
              d.lit
                ? { "--t": d.t, "--peak": d.peak, "--delay": `${d.delay}s` }
                : undefined
            }
          />
        ))}
      </div>
      {hasProgress && (
        <span className="tatva-dot-matrix__badge">{percent}%</span>
      )}
    </div>
  );
}

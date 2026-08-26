import { useEffect, useRef } from "react";
import "../../styles/texts/waveText.css";

function WaveText({
  children = "WAVES",

  colors = [
    "#f24c00",
    "#9792e3",
    "#fc7a1e",
    "#eda96d",
  ],

  depth = 12,
  rotate = 3,
  skew = 3,
  perspective = 500,
  smoothing = 0.2,

  className = "",
  ...props
}) {
  const containerRef = useRef(null);
  const copiesRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const mouse = { x: 0, y: 0 };
    const center = { x: 0, y: 0 };
    const distance = { x: 0, y: 0 };
    const lerped = { x: 0, y: 0 };

    let animationFrame;

    function updateCenter() {
      const rect = container.getBoundingClientRect();

      center.x = rect.left + rect.width / 2;
      center.y = rect.top + rect.height / 2;
    }

    function handleMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      distance.x = center.x - mouse.x;
      distance.y = center.y - mouse.y;
    }

    function animate() {
      lerped.x +=
        (distance.x - lerped.x) * smoothing;

      lerped.y +=
        (distance.y - lerped.y) * smoothing;

      copiesRef.current.forEach((copy, index) => {
        if (!copy) return;

        const i = index + 1;

        const y = i * lerped.y * 0.03;

        const z = i * -depth;

        const rotation =
          i * rotate * (lerped.x * 0.003);

        const skewValue =
          i * skew * (lerped.x * 0.003);

        copy.style.transform = `
          perspective(${perspective}px)
          translate3d(0px, ${y}px, ${z}px)
          rotate(${rotation}deg)
          skew(${skewValue}deg)
        `;
      });

      animationFrame =
        requestAnimationFrame(animate);
    }

    updateCenter();

    window.addEventListener(
      "resize",
      updateCenter
    );

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      window.removeEventListener(
        "resize",
        updateCenter
      );

      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      cancelAnimationFrame(animationFrame);
    };
  }, [
    depth,
    rotate,
    skew,
    perspective,
    smoothing,
  ]);

  return (
    <div
      ref={containerRef}
      className={`velmora-wave-text ${className}`}
      {...props}
    >
      <span className="velmora-wave-text__main">
        {children}
      </span>

      {colors.map((color, index) => (
        <span
          key={index}
          ref={(element) => {
            copiesRef.current[index] = element;
          }}
          className="velmora-wave-text__copy"
          style={{
            color,
            zIndex: colors.length - index,
          }}
          aria-hidden="true"
        >
          {children}
        </span>
      ))}
    </div>
  );
}

export default WaveText;
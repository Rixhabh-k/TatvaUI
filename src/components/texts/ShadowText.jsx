import { useEffect, useRef } from "react";
import "../../styles/texts/shadowText.css";

function ShadowText({
  children = "COLORS",

  shadowOffset = 100,
  shadowOpacity = 0.5,
  shadowSaturation = 50,
  shadowLightness = 50,

  smoothing = 0.08,

  className = "",
  ...props
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) return;

    let animationFrame;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let hue = 0;

    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = x / rect.width;
      const percentY = y / rect.height;

      targetX =
        percentX * shadowOffset -
        shadowOffset / 2;

      targetY =
        percentY * shadowOffset -
        shadowOffset / 2;

      // Same concept as the original effect:
      // mouse X controls the shadow color.
      hue = e.clientX;
    }

    function animate() {
      currentX +=
        (targetX - currentX) * smoothing;

      currentY +=
        (targetY - currentY) * smoothing;

      text.style.textShadow = `
        ${currentX.toFixed(2)}px
        ${currentY.toFixed(2)}px
        0
        hsla(
          ${hue},
          ${shadowSaturation}%,
          ${shadowLightness}%,
          ${shadowOpacity}
        )
      `;

      animationFrame =
        requestAnimationFrame(animate);
    }

    container.addEventListener(
      "mousemove",
      handleMouseMove
    );

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      container.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      cancelAnimationFrame(animationFrame);
    };
  }, [
    shadowOffset,
    shadowOpacity,
    shadowSaturation,
    shadowLightness,
    smoothing,
  ]);

  return (
    <div
      ref={containerRef}
      className={`velmora-shadow-text ${className}`}
      {...props}
    >
      <span ref={textRef}>{children}</span>
    </div>
  );
}

export default ShadowText;
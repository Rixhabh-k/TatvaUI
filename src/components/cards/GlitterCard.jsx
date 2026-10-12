import { useEffect, useRef } from "react";
import "../../styles/cards/glitterCard.css";

function GlitterCard({
  children = "Glitter Card",
  ease = 0.12,
  className = "",
  ...props
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let targetX = 0.5;
    let targetY = 0.5;

    let currentX = 0.5;
    let currentY = 0.5;

    let frame;

    const animate = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      const rect = card.getBoundingClientRect();

      const mouseX = currentX * rect.width;
      const mouseY = currentY * rect.height;

      card.style.setProperty("--mouse-x", `${mouseX}px`);
      card.style.setProperty("--mouse-y", `${mouseY}px`);

      card.style.setProperty("--ratio-x", currentX);
      card.style.setProperty("--ratio-y", currentY);

      frame = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      const rect = card.getBoundingClientRect();

      targetX = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      );

      targetY = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
      );
    };

    card.addEventListener("pointermove", handlePointerMove);

    frame = requestAnimationFrame(animate);

    return () => {
      card.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, [ease]);

  return (
    <div
      ref={cardRef}
      {...props}
      className={`tattva-glitter-card ${className}`}
    >
      <div className="tattva-glitter-card__content">
        {children}
      </div>
    </div>
  );
}

export default GlitterCard;
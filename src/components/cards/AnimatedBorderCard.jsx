import { useEffect, useRef } from "react";
import "../../styles/cards/animatedBorderCard.css";

function AnimatedBorderCard({
  children = "Animated Border Card",
  color1 = "#22d3ee",
  color2 = "#facc15",
  color3 = "#ec4899",
  className = "",
  ...props
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--tattva-border-color-1", color1);
    card.style.setProperty("--tattva-border-color-2", color2);
    card.style.setProperty("--tattva-border-color-3", color3);
  }, [color1, color2, color3]);

  return (
    <div
      ref={cardRef}
      {...props}
      className={`tattva-animated-border-card ${className}`}
    >
      <div className="tattva-animated-border-card__glow" />

      <div className="tattva-animated-border-card__content">
        {children}
      </div>
    </div>
  );
}

export default AnimatedBorderCard;
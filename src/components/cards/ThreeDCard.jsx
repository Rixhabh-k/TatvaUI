import { useEffect, useRef } from "react";
import "../../styles/cards/threeDCard.css";

function ThreeDCard({
  children = "3D Card",

  image =
    "https://images.unsplash.com/photo-1557672199-6e8c8b2b8fff?ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80",

  glow = true,
  glowColor = "#ffffff",
  glowIntensity = 0.35,

  tiltIntensity = 1,
  perspective = 1500,

  className = "",
  ...props
}) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const boundsRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const glowElement = glowRef.current;

    if (!card) return;

    const rotateToMouse = (event) => {
      const bounds = boundsRef.current;

      if (!bounds) return;

      const leftX = event.clientX - bounds.x;
      const topY = event.clientY - bounds.y;

      const centerX = leftX - bounds.width / 2;
      const centerY = topY - bounds.height / 2;

      const distance = Math.sqrt(
        centerX ** 2 + centerY ** 2
      );

      const angle =
        Math.log(Math.max(distance, 1)) *
        2 *
        tiltIntensity;

      card.style.setProperty(
        "--tattva-card-rotate-x",
        `${centerY / 100}`
      );

      card.style.setProperty(
        "--tattva-card-rotate-y",
        `${-centerX / 100}`
      );

      card.style.setProperty(
        "--tattva-card-angle",
        `${angle}deg`
      );

      if (glow && glowElement) {
        const alpha = Math.max(
          0,
          Math.min(255, Math.round(glowIntensity * 255))
        );

        const alphaHex = alpha
          .toString(16)
          .padStart(2, "0");

        glowElement.style.backgroundImage = `
          radial-gradient(
            circle at
            ${centerX * 2 + bounds.width / 2}px
            ${centerY * 2 + bounds.height / 2}px,
            ${glowColor}${alphaHex},
            transparent
          )
        `;
      }
    };

    const handleMouseEnter = () => {
      boundsRef.current =
        card.getBoundingClientRect();

      document.addEventListener(
        "mousemove",
        rotateToMouse
      );
    };

    const handleMouseLeave = () => {
      document.removeEventListener(
        "mousemove",
        rotateToMouse
      );

      card.style.setProperty(
        "--tattva-card-rotate-x",
        "0"
      );

      card.style.setProperty(
        "--tattva-card-rotate-y",
        "0"
      );

      card.style.setProperty(
        "--tattva-card-angle",
        "0deg"
      );

      if (glowElement) {
        glowElement.style.backgroundImage = "";
      }

      boundsRef.current = null;
    };

    card.addEventListener(
      "mouseenter",
      handleMouseEnter
    );

    card.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    return () => {
      card.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );

      card.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      document.removeEventListener(
        "mousemove",
        rotateToMouse
      );
    };
  }, [
    glow,
    glowColor,
    glowIntensity,
    tiltIntensity,
  ]);

  return (
    <div
      className={`tattva-3d-card-wrapper ${className}`}
      style={{
        "--tattva-card-perspective": `${perspective}px`,
      }}
    >
      <div
        ref={cardRef}
        {...props}
        className="tattva-3d-card"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        {children}

        {glow && (
          <div
            ref={glowRef}
            className="tattva-3d-card__glow"
          />
        )}
      </div>
    </div>
  );
}

export default ThreeDCard;
import { useEffect, useRef } from "react";
import { flipText } from "../../animations/buttons/flipText.js";
import "../../styles/buttons/flip.css";

function FlipButton({
  front = "FRONT",
  back = "BACK",
  duration = 500,
  frontColor = "#111",
  backColor = "#fff",
  className = "",
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const destroy = flipText(buttonRef.current, {
      duration,
    });

    return destroy;
  }, [duration]);

  return (
    <button
      ref={buttonRef}
      className={`velmora-flip ${className}`}
      style={{
        "--flip-front-color": frontColor,
        "--flip-back-color": backColor,
      }}
    >
      <span className="velmora-flip__front">
        {front}
      </span>

      <span className="velmora-flip__back">
        {back}
      </span>
    </button>
  );
}

export default FlipButton;
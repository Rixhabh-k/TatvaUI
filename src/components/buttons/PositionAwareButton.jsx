import { useEffect, useRef } from "react";
import { positionAware } from "../../animations/buttons/positionAware.js";
import "../../styles/buttons/positionAware.css";

function PositionAwareButton({
  children = "POSITION AWARE",
  fillColor = "#333",
  textColor = "#fff",
  hoverTextColor = "#fff",
  duration = 400,
  className = "",
  ...props
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const destroy = positionAware(buttonRef.current, {
      duration,
    });

    return destroy;
  }, [duration]);

  return (
    <button
      {...props}
      ref={buttonRef}
      className={`velmora-position-aware ${className}`}
      style={{
        "--position-aware-fill": fillColor,
        "--position-aware-text": textColor,
        "--position-aware-hover-text": hoverTextColor,
      }}
    >
      <span className="velmora-position-aware__text">
        {children}
      </span>

      <span className="velmora-position-aware__circle" />
    </button>
  );
}

export default PositionAwareButton;
import { useEffect, useRef } from "react";
import { fill } from "../../animations/buttons/fill.js";
import "../../styles/buttons/fill.css";

function FillButton({
  children = "Hover Me!",
  fillColor = "#38146a",
  textColor = "#fff",
  hoverTextColor = "#fff",
  duration = 350,
  className = "",
  ...props
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const destroy = fill(buttonRef.current, {
      duration,
      fillColor,
    });

    return destroy;
  }, [duration, fillColor]);

  return (
    <button
      {...props}
      ref={buttonRef}
      className={`velmora-fill ${className}`}
      style={{
        "--fill-color": fillColor,
        "--fill-text-color": textColor,
        "--fill-hover-text-color": hoverTextColor,
        "--fill-duration": `${duration}ms`,
      }}
    >
      <span className="velmora-fill__text">
        {children}
      </span>
    </button>
  );
}

export default FillButton;
import { useEffect, useRef } from "react";
import { magnetic } from "../../index.js";

function MagneticButton({
  strength = 0.35,
  radius = 150,
  ease = 0.15,
  className = "",
  children,
  ...props
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const destroy = magnetic(buttonRef.current, {
      strength,
      radius,
      ease,
    });

    return destroy;
  }, [strength, radius, ease]);

  return (
    <button {...props} ref={buttonRef} className={className}>
      {children}
    </button>
  );
}

export default MagneticButton;

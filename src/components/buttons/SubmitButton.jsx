import { useEffect, useState } from "react";
import "../../styles/buttons/submitButton.css";

function SubmitButton({
  children = "SUBMIT",
  duration = 2250,
  successDuration = 1250,
  color = "#1ECD97",
  loadingColor = "#bbbbbb",
  successColor = "#471ecd",
  className = "",
}) {
  const [status, setStatus] = useState("idle");

  function handleClick() {
    if (status !== "idle") return;

    setStatus("loading");
  }

  useEffect(() => {
    if (status !== "loading") return;

    const timer = setTimeout(() => {
      setStatus("success");
    }, duration);

    return () => clearTimeout(timer);
  }, [status, duration]);

  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => {
      setStatus("idle");
    }, successDuration);

    return () => clearTimeout(timer);
  }, [status, successDuration]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`velmora-submit velmora-submit--${status} ${className}`}
      style={{
        "--submit-color": color,
        "--submit-loading-color": loadingColor,
        "--submit-success-color": successColor,
      }}
    >
      <span className="velmora-submit__text">
        {children}
      </span>

      <span className="velmora-submit__spinner" />

      <span className="velmora-submit__check">
        ✓
      </span>
    </button>
  );
}

export default SubmitButton;
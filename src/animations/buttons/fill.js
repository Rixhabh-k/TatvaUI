export function fill(element, options = {}) {
  const {
    duration = 350,
    fillColor = "#ff003b",
  } = options;

  element.style.setProperty("--fill-duration", `${duration}ms`);
  element.style.setProperty("--fill-color", fillColor);

  const handleEnter = () => {
    element.classList.add("is-filled");
  };

  const handleLeave = () => {
    element.classList.remove("is-filled");
  };

  element.addEventListener("mouseenter", handleEnter);
  element.addEventListener("mouseleave", handleLeave);

  return function destroy() {
    element.removeEventListener("mouseenter", handleEnter);
    element.removeEventListener("mouseleave", handleLeave);
  };
}
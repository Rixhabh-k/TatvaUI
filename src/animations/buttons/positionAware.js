export function positionAware(element, options = {}) {
  const {
    duration = 400,
  } = options;

  if (!element) return () => {};

  const circle = element.querySelector(
    ".velmora-position-aware__circle"
  );

  if (!circle) return () => {};

  element.style.setProperty(
    "--position-aware-duration",
    `${duration}ms`
  );

  function updatePosition(event) {
    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
  }

  element.addEventListener("mouseenter", updatePosition);
  element.addEventListener("mousemove", updatePosition);
  element.addEventListener("mouseleave", updatePosition);

  return function destroy() {
    element.removeEventListener("mouseenter", updatePosition);
    element.removeEventListener("mousemove", updatePosition);
    element.removeEventListener("mouseleave", updatePosition);
  };
}
export function flipText(element, options = {}) {
  const {
    duration = 500,
  } = options;

  element.style.setProperty("--flip-duration", `${duration}ms`);

  const handleEnter = () => {
    element.classList.add("is-flipped");
  };

  const handleLeave = () => {
    element.classList.remove("is-flipped");
  };

  element.addEventListener("mouseenter", handleEnter);
  element.addEventListener("mouseleave", handleLeave);

  return function destroy() {
    element.removeEventListener("mouseenter", handleEnter);
    element.removeEventListener("mouseleave", handleLeave);
  };
}
export function threeDButton(element, options = {}) {
  const {
    target,
    rotation = -90,
    ease = 0.15,
  } = options;

  if (!element || !target) return () => {};

  let targetRotation = 0;
  let currentRotation = 0;
  let animationFrame;

  function onMouseEnter() {
    targetRotation = rotation;
  }

  function onMouseLeave() {
    targetRotation = 0;
  }

  function animate() {
    currentRotation +=
      (targetRotation - currentRotation) * ease;

    target.style.transform = `rotateX(${currentRotation}deg)`;

    animationFrame = requestAnimationFrame(animate);
  }

  element.addEventListener("mouseenter", onMouseEnter);
  element.addEventListener("mouseleave", onMouseLeave);

  animate();

  return function destroy() {
    element.removeEventListener("mouseenter", onMouseEnter);
    element.removeEventListener("mouseleave", onMouseLeave);

    cancelAnimationFrame(animationFrame);

    target.style.transform = "";
  };
}
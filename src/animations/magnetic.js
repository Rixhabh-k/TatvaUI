export function magnetic(element, options = {}) {
  const {
    strength = 0.35,
    radius = 150,
    ease = 0.15,
  } = options;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame;

  function onMouseMove(event) {
    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    const distance = Math.sqrt(
      distanceX * distanceX + distanceY * distanceY
    );

    if (distance < radius) {
      targetX = distanceX * strength;
      targetY = distanceY * strength;
    }
  }

  function animate() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    animationFrame = requestAnimationFrame(animate);
  }

  function reset() {
    targetX = 0;
    targetY = 0;
  }

  element.addEventListener("mousemove", onMouseMove);
  element.addEventListener("mouseleave", reset);

  animate();

  // Allows the animation to be removed later
  return function destroy() {
    element.removeEventListener("mousemove", onMouseMove);
    element.removeEventListener("mouseleave", reset);
    cancelAnimationFrame(animationFrame);
    element.style.transform = "";
  };
}
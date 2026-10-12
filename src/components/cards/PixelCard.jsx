import { useEffect, useRef } from "react";
import "../../styles/cards/pixelCard.css";

const EFFECTS = {
  1: {
    gap: 5,
    speed: 35,
    colors: ["#f8fafc", "#f1f5f9", "#cbd5e1"],
    noFocus: false,
  },

  2: {
    gap: 10,
    speed: 25,
    colors: ["#e0f2fe", "#7dd3fc", "#0ea5e9"],
    noFocus: false,
  },

  3: {
    gap: 3,
    speed: 20,
    colors: ["#fef08a", "#fde047", "#eab308"],
    noFocus: false,
  },

  4: {
    gap: 6,
    speed: 80,
    colors: ["#fecdd3", "#fda4af", "#e11d48"],
    noFocus: true,
  },
};

class Pixel {
  constructor(canvas, ctx, x, y, color, speed, delay) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.x = x;
    this.y = y;

    this.color = color;

    this.speed = this.random(0.1, 0.9) * speed;

    this.size = 0;
    this.sizeStep = Math.random() * 0.4;

    this.minSize = 0.5;
    this.maxSizeInteger = 2;

    this.maxSize = this.random(
      this.minSize,
      this.maxSizeInteger
    );

    this.delay = delay;

    this.counter = 0;

    this.counterStep =
      Math.random() * 4 +
      (canvas.width + canvas.height) * 0.01;

    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset =
      this.maxSizeInteger * 0.5 -
      this.size * 0.5;

    this.ctx.fillStyle = this.color;

    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }

    this.size -= 0.1;

    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function PixelCard({
  children = "Pixel Card",
  effect = 1,
  className = "",
  ...props
}) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);

  const animationRef = useRef(null);
  const pixelsRef = useRef([]);
  const previousTimeRef = useRef(0);

  const selectedEffect =
    EFFECTS[effect] || EFFECTS[1];

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;

    if (!card || !canvas) return;

    const ctx = canvas.getContext("2d");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const {
      gap,
      speed,
      colors,
      noFocus,
    } = selectedEffect;

    const timeInterval = 1000 / 60;

    const getRandomColor = () => {
      return colors[
        Math.floor(Math.random() * colors.length)
      ];
    };

    const getDistanceFromCenter = (x, y) => {
      const dx = x - canvas.width / 2;
      const dy = y - canvas.height / 2;

      return Math.sqrt(dx * dx + dy * dy);
    };

    const createPixels = () => {
      pixelsRef.current = [];

      for (let x = 0; x < canvas.width; x += gap) {
        for (let y = 0; y < canvas.height; y += gap) {
          const delay = reducedMotion
            ? 0
            : getDistanceFromCenter(x, y);

          pixelsRef.current.push(
            new Pixel(
              canvas,
              ctx,
              x,
              y,
              getRandomColor(),
              speed * 0.001,
              delay
            )
          );
        }
      }
    };

    const resize = () => {
      const rect = card.getBoundingClientRect();

      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);

      createPixels();

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    const animate = (mode) => {
      animationRef.current =
        requestAnimationFrame(() => animate(mode));

      const now = performance.now();

      if (
        now - previousTimeRef.current <
        timeInterval
      ) {
        return;
      }

      previousTimeRef.current = now;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      pixelsRef.current.forEach((pixel) => {
        pixel[mode]();
      });

      if (
        pixelsRef.current.length &&
        pixelsRef.current.every(
          (pixel) => pixel.isIdle
        )
      ) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const startAnimation = () => {
      cancelAnimationFrame(animationRef.current);

      pixelsRef.current.forEach((pixel) => {
        pixel.isIdle = false;
      });

      previousTimeRef.current = performance.now();

      animate("appear");
    };

    const stopAnimation = () => {
      cancelAnimationFrame(animationRef.current);

      previousTimeRef.current = performance.now();

      animate("disappear");
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(card);

    card.addEventListener("mouseenter", startAnimation);
    card.addEventListener("mouseleave", stopAnimation);

    if (!noFocus) {
      card.addEventListener("focusin", startAnimation);
      card.addEventListener("focusout", stopAnimation);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);

      resizeObserver.disconnect();

      card.removeEventListener(
        "mouseenter",
        startAnimation
      );

      card.removeEventListener(
        "mouseleave",
        stopAnimation
      );

      if (!noFocus) {
        card.removeEventListener(
          "focusin",
          startAnimation
        );

        card.removeEventListener(
          "focusout",
          stopAnimation
        );
      }
    };
  }, [effect]);

  return (
    <div
      ref={cardRef}
      {...props}
      className={`tattva-pixel-card ${className}`}
      tabIndex={selectedEffect.noFocus ? -1 : 0}
      style={{
        "--tattva-pixel-active-color":
          selectedEffect.colors[0],
      }}
    >
      <canvas
        ref={canvasRef}
        className="tattva-pixel-card__canvas"
      />

      <div className="tattva-pixel-card__content">
        {children}
      </div>
    </div>
  );
}

export default PixelCard;
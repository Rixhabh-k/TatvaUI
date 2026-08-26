import { useEffect, useRef } from "react";
import "../../styles/texts/magicText.css";

const STAR_PATH =
  "M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z";

function MagicText({
  beforeText = "Sometimes I'll start a line of code and I",
  magicText = "don't even know",
  afterText = "where it's going.",

  colors = [
    "#7b1fa2",
    "#673ab7",
    "#f48fb1",
  ],

  starCount = 3,
  starInterval = 1000,
  starSize = 24,

  className = "",
  ...props
}) {
  const starsRef = useRef([]);

  useEffect(() => {
    const timers = [];
    const intervals = [];

    function random(min, max) {
      return Math.floor(
        Math.random() * (max - min + 1)
      ) + min;
    }

    function animate(star) {
      if (!star) return;

      star.style.setProperty(
        "--magic-star-left",
        `${random(-10, 100)}%`
      );

      star.style.setProperty(
        "--magic-star-top",
        `${random(-40, 80)}%`
      );

      star.style.animation = "none";

      // Force animation restart
      star.offsetHeight;

      star.style.animation = "";
    }

    starsRef.current.forEach((star, index) => {
      const timeout = setTimeout(() => {
        animate(star);

        const interval = setInterval(() => {
          animate(star);
        }, starInterval);

        intervals.push(interval);
      }, index * (starInterval / starCount));

      timers.push(timeout);
    });

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [starCount, starInterval]);

  return (
    <span
      className={`velmora-magic-text ${className}`}
      {...props}
    >
      {beforeText}{" "}

      <span
        className="velmora-magic-text__magic"
        style={{
          "--magic-star-size": `${starSize}px`,
          "--magic-purple": colors[0],
          "--magic-violet": colors[1],
          "--magic-pink": colors[2],
        }}
      >
        {Array.from({
          length: starCount,
        }).map((_, index) => (
          <span
            key={index}
            ref={(element) => {
              starsRef.current[index] = element;
            }}
            className="velmora-magic-text__star"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={STAR_PATH} />
            </svg>
          </span>
        ))}

        <span className="velmora-magic-text__text">
          {magicText}
        </span>
      </span>{" "}

      {afterText}
    </span>
  );
}

export default MagicText;
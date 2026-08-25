import { useEffect, useRef, useState } from "react";
import "../../styles/texts/textScramble.css";

function TextScramble({
  phrases = [
    "Neo,",
    "sooner or later",
    "you're going to realize",
    "just as I did",
    "that there's a difference",
    "between knowing the path",
    "and walking the path",
  ],

  duration = 80,
  pauseDuration = 800,

  chars = "!<>-_\\/[]{}—=+*^?#________",

  className = "",
  ...props
}) {
  const [text, setText] = useState("");

  const phraseIndex = useRef(0);
  const currentText = useRef("");
  const frameRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!phrases.length) return;

    let cancelled = false;

    function randomChar() {
      return chars[Math.floor(Math.random() * chars.length)];
    }

    function scrambleTo(newText) {
      return new Promise((resolve) => {
        // IMPORTANT:
        // Always use the actual currently displayed text.
        const oldText = currentText.current;

        const length = Math.max(
          oldText.length,
          newText.length
        );

        const queue = [];

        for (let i = 0; i < length; i++) {
          const from = oldText[i] || "";
          const to = newText[i] || "";

          const start = Math.floor(Math.random() * 40);

          const end =
            start +
            Math.floor(Math.random() * 40);

          queue.push({
            from,
            to,
            start,
            end,
            char: "",
          });
        }

        let frame = 0;

        function update() {
          if (cancelled) return;

          let output = "";
          let complete = 0;

          for (let i = 0; i < queue.length; i++) {
            const item = queue[i];

            if (frame >= item.end) {
              complete++;

              output += item.to;
            } else if (frame >= item.start) {
              if (
                !item.char ||
                Math.random() < 0.28
              ) {
                item.char = randomChar();
              }

              output +=
                `<span class="velmora-text-scramble__dud">` +
                item.char +
                `</span>`;
            } else {
              // Keep the previous character visible
              // until its scramble begins.
              output += item.from;
            }
          }

          setText(output);

          if (complete === queue.length) {
            // Store the NEW actual text only after
            // the transition has completely finished.
            currentText.current = newText;

            resolve();
            return;
          }

          frame++;

          frameRef.current =
            requestAnimationFrame(update);
        }

        update();
      });
    }

    async function run() {
      const currentPhrase =
        phrases[phraseIndex.current];

      // Scramble directly FROM the currently
      // displayed phrase TO the next phrase.
      await scrambleTo(currentPhrase);

      if (cancelled) return;

      timeoutRef.current = setTimeout(() => {
        phraseIndex.current =
          (phraseIndex.current + 1) %
          phrases.length;

        run();
      }, pauseDuration);
    }

    run();

    return () => {
      cancelled = true;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [phrases, chars, pauseDuration]);

  return (
    <span
      {...props}
      className={`velmora-text-scramble ${className}`}
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  );
}

export default TextScramble;
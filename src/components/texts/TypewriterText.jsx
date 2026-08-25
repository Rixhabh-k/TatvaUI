import { useEffect, useState } from "react";
import "../../styles/texts/typewriter.css";

function TypewriterText({
  words = ["Build", "Create", "Design", "Code"],
  typingSpeed = 500,
  deletingSpeed = 300,
  pauseDuration = 1000,
  className = "",
  ...props
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;

    const currentWord = words[wordIndex];

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && text === currentWord) {
      delay = pauseDuration;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));

        if (text.length + 1 === currentWord.length) {
          setIsDeleting(true);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));

        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [
    text,
    isDeleting,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span
      {...props}
      className={`velmora-typewriter ${className}`}
    >
      <span className="velmora-typewriter__text">
        {text}
      </span>

      <span className="velmora-typewriter__cursor" />
    </span>
  );
}

export default TypewriterText;
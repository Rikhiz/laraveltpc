import React, { useState, useEffect } from "react";

const TypingEffect = ({ text, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    // langsung tampilkan karakter pertama tanpa delay
    if (index === 0) {
      setDisplayedText(text[0]);
      setIndex(1);
      return;
    }

    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <span dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

export default TypingEffect;

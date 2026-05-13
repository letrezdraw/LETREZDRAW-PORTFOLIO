import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 50, enabled = true) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!enabled) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return displayedText;
};

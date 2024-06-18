// components/AlphabetCard.tsx

import React, { useState, useEffect } from 'react';
import styles from './styles/Card.module.css';

interface AlphabetCardProps {
  alphabet: string;
  words: string[];
  onNext: () => void;
  onPrev: () => void;
}

const AlphabetCard: React.FC<AlphabetCardProps> = ({ alphabet, words, onNext, onPrev }) => {
  const [flipped, setFlipped] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [randomWord, setRandomWord] = useState<string | null>(null);

  const fetchStory = async (word: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/short-story?word=${word}`);
      const data = await response.json();

      if (data.story) {
        setStory(data.story);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch story');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (randomWord) {
      await fetchStory(randomWord);
    }
  };

  useEffect(() => {
    if (!flipped) {
      setRandomWord(null);
      setStory(null);
    }
  }, [flipped]);

  const handleFlip = () => {
    if (!flipped) {
      const randomIndex = Math.floor(Math.random() * words.length);
      setRandomWord(words[randomIndex]);
    }
    setFlipped(!flipped);
  };

  return (
    <div className={styles.container}>
      {!flipped ? (<button onClick={onPrev} className={styles.navButton}>Previous</button>) :'' }
      <div className={styles.card} onClick={handleFlip}>
        <div className={`${styles.cardInner} ${flipped ? styles.flipped : ''}`}>
          <div className={styles.cardFront}>
            {alphabet}
          </div>
          <div className={styles.cardBack}>
            <div>
              {randomWord}
              <br />
              {randomWord && !story && (
                <div className={styles.storyLink} onClick={handleLinkClick}>
                  Would you like a short story with this word?
                </div>
              )}
              {loading && <p className={styles.story}>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {story && <p className={styles.story}>{story}</p>}
            </div>
          </div>
        </div>
      </div>
      {!flipped ? (<button onClick={onNext} className={styles.navButton}>Next</button>) :'' }
    </div>
  );
};

export default AlphabetCard;
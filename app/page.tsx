// app/page.tsx

'use client';

import React, { useState } from 'react';
import AlphabetCard from './components/AlphabetCard';
import alphabetData from './Data';

const HomePage: React.FC = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % alphabetData.length);
  };

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + alphabetData.length) % alphabetData.length);
  };

  return (
    <div>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <AlphabetCard
          alphabet={alphabetData[index].letter}
          words={alphabetData[index].words}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </main>
    </div>
  );
};

export default HomePage;
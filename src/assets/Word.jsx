import React, { useState, useEffect } from 'react';

// Function to fetch a random word from an API
export async function getRandomWord() { 
  const response = await fetch('https://node-hangman-api-production.up.railway.app/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const data = await response.json();
  return data.word; 
}

// Component to display a random word
export const Word = () => {
  const [word, setWord] = useState(''); //use State to get and set word
  const [error, setError] = useState('');// to handle errors


  useEffect(() => {
    getRandomWord()
      .then(setWord)
      .catch(error => {
        console.error('Error fetching word:', error);
        setError('Failed to load the word. Please try again.'); // Set a error message
      });
  }, []);

  // If there's an error, show an error message instead of the word
  if (error) {
    return <div className="error">{error} ; 
    <button onClick={() => window.location.reload()}>Try Again</button> {/* Reload the page */}
  </div> 
  }

  return <div className="word">{word}</div>; // Display the word if no error 
};


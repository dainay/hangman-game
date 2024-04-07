import React from 'react';
import './Keyboard.css';


 
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Keyboard = ({ onLetterClick, selectedLetters, disabled }) => {
  return (
    <div className="keyboard">
      {letters.map((letter) => ( //mapping letters to have keyboard
        <button
          key={letter}
          disabled={disabled}
          className={`keyboard-key ${selectedLetters.includes(letter) ? 'key-used' : ''}`} //change style once clicked
          onClick={() => onLetterClick(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};
  
  export default Keyboard;
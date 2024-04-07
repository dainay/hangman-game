import React, { useState, useEffect } from 'react';
import Keyboard from './assets/keyboard/Keyboard.jsx';
import './App.css';
import { getRandomWord } from './assets/Word.jsx';


const errorImages = [
  '../img/1.jpg',  
  '../img/2.jpg',  
  '../img/3.jpg',
  '../img/4.jpg',
  '../img/5.jpg',
  '../img/6.jpg',
  '../img/7.jpg',
];

 


function App() {
  const [errors, setErrors] = useState(0); // counting errors from 0
  const [selectedLetters, setSelectedLetters] = useState([]); // handling letters
  const [randomWord, setRandomWord] = useState(''); //getting the world
  const [hintUsed, setHintUsed] = useState(false); //using hint one time only
  const [isImageChanging, setIsImageChanging] = useState(false); // to do litlte animation between images
  const [loading, setLoading] = useState(true); //loader
  const [fetchError, setFetchError] = useState(''); //error message




  useEffect(() => {
    getRandomWord()
      .then(word => {
        setRandomWord(word);
        setLoading(false); // Set loading to false once the word is here
      })
      .catch(error => {
        console.error('Error fetching word:', error);
        setFetchError('Failed to load the word. Please refresh the page.');
        setLoading(false); // loading is set to false even when there's an error
      });
  }, []);//render use effect every time after having first component (word or error)
  




  const handleLetterClick = (letter) => {
    if (!selectedLetters.includes(letter)) { 
      setSelectedLetters([...selectedLetters, letter]);// add the letter in set of choosen letters if it wasnt choosen before it. selectedletters keeps all ckicked letters set

      if (!randomWord.toUpperCase().includes(letter.toUpperCase())) {
        setErrors(errors + 1); // if our word has tge chooseb letter, plus one error
      }
    }
  };

  const displayWord = randomWord.toUpperCase().split('').map(letter =>
    selectedLetters.includes(letter.toUpperCase()) ? letter : '_'
  ).join(' '); // present word as lines. If letter is in selectedLetters, display it, otherwise display _

  

  const gameOver = errors >= 6; //conditions to loose
  const isWordGuessed = !displayWord.includes('_'); // if we dont have lines in display,  user won


  const handleRestart = () => {
    window.location.reload(); // Reload the page to restart the game
  };


  useEffect(() => {
    const handleKeyDown = (event) => { //make it work the same way with a keyboard
     
   
      if (!(gameOver || isWordGuessed) && event.key.length === 1 && /[a-zA-Z]/.test(event.key) && !selectedLetters.includes(event.key.toUpperCase())) {
        handleLetterClick(event.key.toUpperCase()); // checking if game is not over and if we presed a letter. and after compare pressed letter with SELECTED letters
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLetters, errors, displayWord]); // trigger to start the function
  


  useEffect(() => {
    setIsImageChanging(true); //animation for scary atmosphere
    const timeout = setTimeout(() => {
      setIsImageChanging(false);
    }, 500);  

    return () => clearTimeout(timeout);
  }, [errors]);



  const handleHint = () => {
    if (!hintUsed && !gameOver && !isWordGuessed) { //checking if game is still on and we still have a hint
      const unguessedLetters = randomWord.toUpperCase().split('').filter(letter => !selectedLetters.includes(letter));
      if (unguessedLetters.length > 0) {
        const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)]; //choosing from left letters the one to show
        setSelectedLetters([...selectedLetters, randomLetter]); // put new opened letter in set
        setErrors(errors + 1); // add one error
        setHintUsed(true); // put state of hint as used
      }
    }
  };






  if (loading) {
    return <div>Loading...</div>; // Show loading indicator when fetching the word
  }

  if (fetchError) {
    return <div>{fetchError} <button onClick={() => window.location.reload()}>Reload</button></div>;
    // Show error message and a reload button if there's a fetch error
  }


  return (
    <div className="App">
     
<div className='global-container'>

      <div className='image-container'>
     
        <img
          className={`hangman-image ${isImageChanging ? 'hangman-image-changing' : ''}`}
          src={errorImages[errors]}
          alt=""
        />
      </div>


      <div className='text-container'>
<p>
After a long wander among the ruins of the Parthenon, you discover a hidden door. Upon opening it, you find a large hall with a single torch and a small window in the ceiling. As soon as you cross the threshold of the room, the concrete door behind you slams shut, and a thundering voice echoes: <br /> <br /> <i>"You're too curious, mortal... <br /> Solve my riddle if you want to escape. <br /> You have 6 tries.".</i></p><br /><br />
      <h1>Will you find the way out..?</h1>

      <p>Guess the word hidden by the underscores. The ambiance should help you with the theme. If you are too weak, mortal, use a hint. But it will cost you... Try to not die.</p>
        <h2>{displayWord}</h2>
        <Keyboard
          onLetterClick={handleLetterClick}
          selectedLetters={selectedLetters}
          disabled={gameOver || isWordGuessed} //turn off keyboard if game is over or if user won
        />
        
        {gameOver && (
          <div className='game-over-container'>
            <div>So... you are blocked here forever?</div>
            <div>Your answer was <b>{randomWord}</b>, by the way.</div>
<br />
<button onClick={handleRestart}>Next try</button>
          </div>
        )}

        {isWordGuessed &&  <div className='winner-container'>
          <div className='img-winner'> <img src="../img/8.jpg" alt="" /></div>   
          
          <div className='game-over-container'>You are free ! <br /> Well, at least you can think like that...<br />  <br />
          
          
          <button onClick={handleRestart}>I wanna go back and try one more time</button>
          </div> 
        </div>}


        <button onClick={handleHint} disabled={hintUsed || gameOver || isWordGuessed}>I need a hint</button>
      </div>

      </div>
      

      <p className='keyboard-help'>You can use keyboard or screen buttons. Just guess the word finally... Of course if you want to go out.</p>
    </div>
  );
}


export default App;

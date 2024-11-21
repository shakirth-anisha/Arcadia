import './Game3.css';
import SingleCard from './single_card.js'
import { useState, useEffect } from 'react';
import { getUsername } from "../utils/localStorage";
import bg_img from './bg-img.png';

const cardImgs = [
  {"src": "./magicmatchimages/monsters-01.png", matched: false},
  {"src": "./magicmatchimages/monsters-02.png", matched: false},
  {"src": "./magicmatchimages/monsters-03.png", matched: false},
  {"src": "./magicmatchimages/monsters-07.png", matched: false},
  {"src": "./magicmatchimages/monsters-09.png", matched: false},
  {"src": "./magicmatchimages/monsters-11.png", matched: false}
]

function Game3() {
  const[cards, setCards] = useState([])
  const[turns, setTurns] = useState(1000)
  const[choice1, setChoice1] = useState(null)
  const[choice2, setChoice2] = useState(null)
  const[disabled, setDisabled] = useState(false)
  const[gameCompleted, setGameCompleted] = useState(false)

  // New function to submit game results to backend


  const shuffleCards = () => {
    const shuffled = [...cardImgs, ...cardImgs]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({...card, id: Math.random()}))

    setChoice1(null)
    setChoice2(null)
    setCards(shuffled)
    setTurns(1000)
    setGameCompleted(false)
  }

  const handleChoice = (card) => {
    if(choice1){
      {setChoice2(card)}
    }
    else{
      setChoice1(card);
    }
  }

  useEffect(() => {
    // Check if all cards are matched
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameCompleted(true);
      submitGameResults();
    }
  }, [cards]);

  useEffect(() => {
    // Check if turns have run out
    if (turns <= 0) {
      setGameCompleted(true);
      submitGameResults();
    }
  }, [turns]);

  useEffect(() => {
        if(choice1 && choice2){
          setDisabled(true)
          if(choice1.src === choice2.src){
            setCards(prevCards => {
              return(
                  prevCards.map(card => {
                    if(card.src === choice1.src){
                      return{...card, matched: true}
                    }
                    else{
                      return card
                    }
                  })
              )
            })
            resetTurn()
          }
          else{
            setTimeout(() => resetTurn(),
                1000
            )
          }
        }
      },
      [choice1, choice2])

  const resetTurn = () => {
    setChoice1(null)
    setChoice2(null)
    setTurns(prevTurns => prevTurns - 50)
    setDisabled(false)
  }

  useEffect(() => {
    shuffleCards()
  }, [])

  const submitGameResults = async () => {
    try {
      const username = getUsername(); // Assuming this returns the current user's username

      const response = await fetch('http://localhost:80/api/updateHighScore', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          gameName: 'MagicMatch',
          newScore: turns,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update game stats');
      }

      const data = await response.json();
      console.log('Game stats updated:', data);
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };


  return (
    <>
      <img src={`${bg_img}`} className="bg_img"></img>
      <div className="App">
        <h1>MAGIC MATCH</h1>
        <button
            onClick={shuffleCards}
            className='mm_button'
            disabled={!gameCompleted}
        >
          <span>New Game</span>
        </button>
        <p id='turns'>Exp: {turns}</p>

        <div className='cardGrid'>
          {cards.map(card => (
              <SingleCard
                  key={card.id}
                  id={card.id}
                  card={card}
                  handleChoice={handleChoice}
                  flipped={card === choice1 || card === choice2 || card.matched}
                  disabled={disabled || gameCompleted}
              />
          ))}
        </div>

        {gameCompleted && (
            <div className="game-over-message">
              {turns > 0
                  ? "Congratulations! You won!"
                  : "Game Over! Try again."}
            </div>
        )}
      </div>
      </>
  );
}

export default Game3;
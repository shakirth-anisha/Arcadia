import React, { useState } from 'react';
import './Game7.css';
import bg_img from './bg-img.png';

function Game7() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerOne, setPlayerOne] = useState('PlayerOne');
  const [playerTwo, setPlayerTwo] = useState('PlayerTwo');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [tie, setTie] = useState(false); 

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6], 
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: lines[i] };
      }
    }
    return null;
  };

  const checkTie = (board) => {
    return board.every(cell => cell !== null);
  };

  const handleClick = (index) => {
    if (board[index] || winner || tie) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult.winner);
      setWinningLine(gameResult.line);
    } else if (checkTie(newBoard)) {
      setTie(true); 
    }
  };

  const renderSquare = (index) => {
    return (
      <button
        className={`ttt-square ${board[index] ? `ttt-${board[index]}` : ''} ${winningLine?.includes(index) ? 'ttt-winner-line' : ''}`}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  const startGame = () => {
    setIsGameStarted(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setTie(false); 
    setWinningLine(null);
  };

  return (
    <>
        <img src={`${bg_img}`} className="bg_img"></img>
        <div className="ttt-game">
        {!isGameStarted ? (
            <div className="ttt-start-popup">
            <h2 className='ttt-popup-header'>Enter Player Names</h2>
            <input
                type="text"
                placeholder="Player One"
                value={playerOne}
                onChange={(e) => setPlayerOne(e.target.value)}
            />
            <input
                type="text"
                placeholder="Player Two"
                value={playerTwo}
                onChange={(e) => setPlayerTwo(e.target.value)}
            />
            <button className="ttt-start-button" onClick={startGame}>
                Start Game
            </button>
            </div>
        ) : (
            <>
            <h1 className="ttt-header">Tic-Tac-Toe</h1>
            {winner && (
                <div className="ttt-winner">
                Winner: {winner === 'X' ? playerOne : playerTwo}
                </div>
            )}
            {!winner && !tie && (
                <div className="ttt-next">
                Next player: {isXNext ? playerOne : playerTwo}
                </div>
            )}
            {tie && !winner && (
                <div className="ttt-tie">Tie Game!</div> // Display tie message
            )}
            <div className="ttt-board">
                {board.map((_, index) => renderSquare(index))}
            </div>
            <button className="ttt-play-again" onClick={resetGame}>
                Play Again
            </button>
            </>
        )}
        </div>
    </>
  );
}

export default Game7;

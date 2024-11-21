import React, {useState, useEffect} from 'react';
import './RPS.css';
import rock_img from './Rock.png';
import paper_img from './Paper.png';
import scissors_img from './Scissors.png';
import bg_img from './bg-img.png';
import {getUsername} from "../utils/localStorage";

const choices = [
    {name: 'rock', image: rock_img},
    {name: 'paper', image: paper_img},
    {name: 'scissors', image: scissors_img},
];

const getResult = (userChoice, computerChoice) => {
    if (userChoice === computerChoice) return 'It\'s a tie!';
    if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'You win!';
    }
    return 'You lose!';
};

function Game5() {
    const [userChoice, setUserChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [result, setResult] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentImage, setCurrentImage] = useState(choices[0].image);

    // API call to update points using fetch
    const updatePoints = async (gameResult) => {
        try {
            const username = getUsername(); // Assuming this returns the current user's username

            let pointsToUpdate = 0;
            switch (gameResult) {
                case 'You win!':
                    pointsToUpdate = 100;
                    break;
                case 'You lose!':
                    pointsToUpdate = 0;
                    break;
                case 'It\'s a tie!':
                    pointsToUpdate = 50;
                    break;
                default:
                    return;
            }

            const response = await fetch('http://localhost:80/api/updateHighScore', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    gameName: 'RPS',
                    newScore: pointsToUpdate,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update points');
            }

            const data = await response.json();
            // Optional: Handle successful point update
            console.log('Points updated:', data);
        } catch (error) {
            console.error('Error updating points:', error);
            // Optional: Add user-facing error handling
            // You might want to show a toast or error message
        }
    };

    useEffect(() => {
        let interval;
        if (isAnimating) {
            interval = setInterval(() => {
                const randomImage = choices[Math.floor(Math.random() * choices.length)].image;
                setCurrentImage(randomImage);
            }, 100);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isAnimating]);

    const handleClick = (choice) => {
        setUserChoice(choice);

        const randomComputerChoice = choices[Math.floor(Math.random() * choices.length)];
        setComputerChoice(randomComputerChoice.name);

        setIsAnimating(true);

        setTimeout(() => {
            setIsAnimating(false);
            setCurrentImage(randomComputerChoice.image);

            const gameResult = getResult(choice, randomComputerChoice.name);
            setResult(gameResult);

            // Call API to update points
            updatePoints(gameResult);
        }, 2500);
    };

    return (
        <>
            <img src={`${bg_img}`} className="bg_img" alt="Background"></img>
            <div className="app-container">
                <h1 className="rps_title">Rock Paper Scissors</h1>
                <div className="choice-container">
                    {userChoice && (
                        <div className="vs-container">
                            <img
                                src={choices.find(c => c.name === userChoice).image}
                                alt={`Image of ${userChoice}`}
                                className="choice-image vs-image"
                            />
                            <span className="vs-text">vs</span>
                            <img
                                src={currentImage}
                                alt="Computer choice or animation"
                                className="choice-image vs-image"
                            />
                        </div>
                    )}
                </div>
                <div className="buttons-container">
                    {choices.map((choice) => (
                        <button
                            key={choice.name}
                            onClick={() => handleClick(choice.name)}
                            className="choice-button"
                        >
                            <img src={choice.image} alt={`Image of ${choice.name}`} className="choice-image"/>
                        </button>
                    ))}
                </div>
            </div>
            {result && (
                <div className="result-container">
                    <p className="result-text">{result}</p>
                </div>
            )}
        </>
    );
}

export default Game5;

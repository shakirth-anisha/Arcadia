import React, {useState, useEffect} from 'react';
import './Game8.css';
import bg_img from './bg-img.png';
import {getUsername} from "../utils/localStorage";

const Game8 = () => {
    const randomSentences = [
        "A giant penguin danced on a trampoline under the moonlight.",
        "The unicorn ate rainbow pancakes for breakfast.",
        "A squirrel wearing a top hat raced across the park.",
        "The purple cactus played the banjo in the desert.",
        "I once saw a kangaroo jump over a skateboard.",
        "A dragon hiccupped and accidentally set off fireworks.",
        "The jellyfish wore sunglasses and surfed the waves.",
        "A mischievous raccoon hid donuts in the mailbox.",
        "The pirate captain sang opera while searching for treasure.",
        "The mischievous cat juggled three flamingos at the circus.",
        "Bananas make great hats if you're a monkey.",
        "The flamingo danced the tango with a zebra.",
        "A dragon made pancakes while flying over the ocean.",
        "The detective's pet parrot solved the mystery in no time.",
        "A group of turtles formed a rock band and toured the world.",
        "A purple octopus tap-danced on a rainbow-colored mat.",
        "The chocolate cake ran away from the hungry chef.",
        "The astronaut found a sandwich floating in space.",
        "A dog in a tuxedo played poker with a raccoon.",
        "The owl wore glasses and read a book under the stars.",
        "A walrus rode a bicycle through the snowstorm.",
        "The ninja cat secretly practiced yoga in the garden.",
        "A group of squirrels hosted a circus for the forest animals.",
        "The pizza delivery man was chased by a giant taco.",
        "A wizard made popcorn using magic spells and enchanted butter.",
        "The purple dragon baked cupcakes in a volcano.",
        "A giraffe wore a scarf and rode a skateboard down the hill.",
        "The superhero chicken saved the day with a big egg.",
        "A detective mouse cracked the case of the missing cheese.",
        "The penguin learned to snowboard and did a backflip.",
    ];


    const username = getUsername();
    const [text, setText] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [sentence, setSentence] = useState(randomSentences[0]);

    // Effect to change the sentence when the component loads or resets
    const getNewSentence = () => {
        setSentence(randomSentences[Math.floor(Math.random() * randomSentences.length)]);
    };

    useEffect(() => {
        getNewSentence();
    }, []);

    // Update elapsed time every 100ms
    useEffect(() => {
        let interval;
        if (startTime && !isFinished) {
            interval = setInterval(() => {
                setElapsedTime((new Date().getTime() - startTime) / 1000);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [startTime, isFinished]);

    const handleChange = (e) => {
        const inputText = e.target.value;
        setText(inputText);

        if (!startTime) {
            setStartTime(new Date().getTime());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (isFinished) {
                handleReset();
            } else {
                setIsFinished(true);
                setElapsedTime((new Date().getTime() - startTime) / 1000);
                calculateResults(text);
                //connect to backend
            }
        }
    };

    const calculateResults = (inputText) => {
        const correctChars = inputText.split('').filter((char, index) => char === sentence[index]).length;
        const accuracy = (correctChars / sentence.length) * 100;
        const speed = (inputText.length / 5) / (elapsedTime / 60);

        setAccuracy(accuracy.toFixed(2));
        setSpeed(speed.toFixed(2));

        if (accuracy >= 90) {
            updateScore(speed);
        }
    };

    const updateScore = async (wpm) => {
        try {
            const response = await fetch('http://localhost:80/api/updateHighScore', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    gameName: 'WPM',
                    newScore: Math.floor(wpm)}),
            });
            if (response.ok) {
                console.log('Score updated successfully !');
            } else {
                console.error('Failed to update score:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating score:', error);
        }
    };

    const handleReset = () => {
        setText('');
        setStartTime(null);
        setElapsedTime(0);
        setIsFinished(false);
        setAccuracy(0);
        setSpeed(0);
        getNewSentence();
    };

    const renderText = () => {
        return sentence.split('').map((char, index) => {
            let className = 'wpm-text-gray';
            if (index < text.length) {
                // Check for spaces and treat them the same way as other characters
                className = text[index] === char ? 'wpm-text-black' : 'wpm-text-red';
            }
            return (
                <span key={index} className={className} style={{opacity: index < text.length ? 1 : 0.5}}>
          {char === ' ' ? '\u00A0' : char}
        </span>
            );
        });
    };

    return (
        <>
            <img src={`${bg_img}`} className="bg_img" alt="background"/>
            <h1 className="wpm-title">Wpm Tracker</h1>
            <div className="wpm-game-container">
                <p className="wpm-sentence">{renderText()}</p>
                <textarea
                    className="wpm-input-area"
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    disabled={isFinished}
                    placeholder="Start typing..."
                />
                {isFinished && (
                    <div className="wpm-result">
                        <p>Time: {elapsedTime}</p>
                        <p style={{color: accuracy >= 90 ? '#a5ffa9' : '#ffa5a5'}}>Accuracy: {accuracy}%</p>
                        <p>Speed: {speed}</p>
                    </div>
                )}
                <button className="wpm-reset-button" onClick={handleReset}>
                    {isFinished ? 'Restart' : 'Reset'}
                </button>
            </div>
        </>
    );
};

export default Game8;
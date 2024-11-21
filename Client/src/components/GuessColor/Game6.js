import {useState, useEffect} from "react";
import {getUsername} from "../utils/localStorage";
import "./Game6.css";
import bg_img from './hex-bg.png';

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return {
        rgb: `rgb(${r}, ${g}, ${b})`,
        hex: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    };
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

function Game6() {
    const username = getUsername();
    const [targetColor, setTargetColor] = useState(getRandomColor());
    const [colors, setColors] = useState([]);
    const [selectedColors, setSelectedColors] = useState({});
    const [colorFormat, setColorFormat] = useState("rgb");
    const [score, setScore] = useState(0); // Track the score
    const [gameOver, setGameOver] = useState(false); // Track if the game is over
    const [correctColor, setCorrectColor] = useState(null); // Track the correct color for overlay

    useEffect(() => {
        const newColors = [targetColor];
        while (newColors.length < 6) {
            newColors.push(getRandomColor());
        }
        setColors(shuffleArray(newColors));
        setSelectedColors({});
        setGameOver(false); // Reset game over state for the new round
        setCorrectColor(null); // Reset correct color
    }, [targetColor]);


    const handleColorClick = (color) => {
        if (gameOver) return; // Prevent further interaction if the game is over

        const isCorrect = color[colorFormat] === targetColor[colorFormat];
        setSelectedColors((prev) => ({
            ...prev, [color[colorFormat]]: isCorrect
        }));

        if (!isCorrect) {
            // If the selection is incorrect, enable the overlay for the correct answer
            setCorrectColor(targetColor);
        } else {
            // If the selection is correct, increase the score and send to backend
            const newScore = score + 50;
            setScore(newScore);
            console.log("New score:", newScore);
            sendScoreToBackend(newScore); // Update backend with new score
        }

        setGameOver(true); // End the game after the first selection
    };

    const sendScoreToBackend = async (score) => {
        try {
            const response = await fetch("http://localhost:80/api/updateHighScore", {
                method: "PUT", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({username: username,
                    gameName: 'GuessColor',
                    newScore: score})
            });

            if (!response.ok) {
                console.error("Failed to send score to the backend.");
            } else {
                console.log("Score successfully sent to the backend.");
            }
        } catch (error) {
            console.error("Error sending score to backend:", error);
        }
    };

    const handleNext = () => {
        setTargetColor(getRandomColor());
    };

    return (<>
        <img src={`${bg_img}`} className="bg_img" alt="background"></img>
        <div className="color-game-container">
            <h1 className="title">Color Guessing Game</h1>
            <p className="subtitle">
                <span className="color-code">{targetColor[colorFormat]}</span>
            </p>
            <div className="button-group">
                <button
                    className={`format-button ${colorFormat === "rgb" ? "active" : ""}`}
                    onClick={() => setColorFormat("rgb")}
                >
                    RGB
                </button>
                <button
                    className={`format-button ${colorFormat === "hex" ? "active" : ""}`}
                    onClick={() => setColorFormat("hex")}
                >
                    HEX
                </button>
            </div>
            <div className="color-grid">
                {colors.map((color, index) => {
                    const isSelected = color[colorFormat] in selectedColors;
                    const isCorrect = selectedColors[color[colorFormat]];

                    return (<div
                        key={index}
                        className={`color-box ${isSelected ? (isCorrect ? "correct" : "wrong") : ""}`}
                        style={{backgroundColor: color.rgb}}
                        onClick={() => !isSelected && handleColorClick(color)}
                    >
                        {isSelected && (<div className="overlay">
                            {isCorrect ? "✅" : "❌"}
                        </div>)}
                        {/* Show overlay for correct color if the user made an incorrect choice */}
                        {correctColor && color[colorFormat] === correctColor[colorFormat] && !isCorrect && (
                            <div className="overlay">
                                ✅
                            </div>)}
                    </div>);
                })}
            </div>
            {gameOver && (<button className="next-button" onClick={handleNext}>
                Next
            </button>)}
        </div>
    </>);
}

export default Game6;
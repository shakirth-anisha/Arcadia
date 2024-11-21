import {getUsername} from "../utils/localStorage";
import {useEffect} from "react";

export default function GameOver({onRestart, finalScore}) {
    // console.log("i entered this page !!!")
    const submitScore= async () => {
        const username = (getUsername())
        try {
            const response = await fetch('http://localhost:80/api/updateHighScore', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    gameName: 'The2048',
                    newScore: finalScore,
                }),
            });

            if (response.ok) {
                console.log('Score submitted successfully');
            } else {
                const errorDetails = await response.json();
                console.error('Failed to submit score:', errorDetails.message);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };


    useEffect(() => {

        if (finalScore > 0) {
            submitScore();
        }
    }, [finalScore]); // Limit dependency to `finalScore`

    return (
        <div className="game-over">
            <h1>Game Over!</h1>
            <button onClick={() => {
                submitScore();
                onRestart();
            }}>Restart
            </button>
        </div>
    );
}
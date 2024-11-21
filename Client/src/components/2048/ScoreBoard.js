import React from 'react';

export default function ScoreBoard({ score }) {
    return (
        <div className="score-board">
            <h2>Score: {score}</h2>
        </div>
    );
}

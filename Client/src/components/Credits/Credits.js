// src/components/Credits.js
import React from 'react';
import Nav from '../Navbar/navbar';
import Snowfall from './Snowfall';
import './Credits.css';

const colors = {
    "Shakirth Anisha": "rgba(195, 177, 225, 0.5)",
    "Shresht Ahuja": "rgba(64 , 224, 208, 0.5)",
    "Siddhartha Rao": "rgba(252, 164, 161, 0.725)",
}

const creditsData = [
    { work: "Fuzzle", name: "Shakirth Anisha"},
    { work: "Shadow Strike", name: "Shresht Ahuja"},
    { work: "Magic Match", name: "Shresht Ahuja"},
    { work: "2048", name: "Siddhartha Rao"},
    { work: "Rock Paper Scissors", name: "Shakirth Anisha"},
    { work: "Hex Hackers", name: "Shakirth Anisha"},
    { work: "Tic Tac Toe", name: "Shresht Ahuja"},
    { work: "WPM", name: "Shakirth Anisha"},
    { work: "Login/Sign Up Page", name: "Shakirth Anisha"},
    { work: "Login/Sign Up Backend", name: "Shakirth Anisha"},
    { work: "Login/Sign Up Backend", name: "Shresht Ahuja"},
    { work: "Login/Sign Up Backend", name: "Siddhartha Rao"},
    { work: "Home Page", name: "Shakirth Anisha"},
    { work: "Profile Page", name: "Shresht Ahuja"},
    { work: "Profile Backend", name: "Shresht Ahuja"},
    { work: "Leaderboard Page", name: "Shresht Ahuja"},
    { work: "Leaderboard Backend", name: "Siddhartha Rao"},
    { work: "Credits Page", name: "Shakirth Anisha"},
    { work: "Contact Us Page", name: "Shakirth Anisha"},
];

function Credits() {
    return (
        <>
            {Nav()}
            <Snowfall />
            <div className="credits-container">
                <h1 className="credits-title">Credits</h1>
                <div className="credits-list">
                    {creditsData.map((credit , index) => (
                        <div key={index} className="credit-item" style={{ backgroundColor: colors[credit.name] }}>
                            <span className="credit-work">{credit.work}</span>
                            <span className="credit-name">{credit.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Credits;
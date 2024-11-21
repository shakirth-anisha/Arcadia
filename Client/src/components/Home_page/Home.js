// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../Navbar/navbar';
import './Home.css'
import fuzzle_img from './fuzzle.png'
import shadowstrike_img from './shadowstrike.png'
import magic_match_img from './magicmatch.png'
import game_2048_img from './2048.png'
import rps_img from './RPS.png'
import color_img from './color.png'
import ttt_img from './ttt.png'
import wpm_img from './wpm.png'

const games = [
    {
        id: 1,
        schema: null,
        title: "Fuzzle",
        description: "Pokemon style RPG Game",
        image: fuzzle_img,
    },
    {
        id: 2,
        schema: null,
        title: "Shadow Fight",
        description: "Street Fighting Game",
        image: shadowstrike_img,
    },
    {
        id: 3,
        schema: "MagicMatch",
        title: "Magic Match",
        description: "Monster Memory Game",
        image: magic_match_img,
    },
    {
        id: 4,
        schema: "The2048",
        title: "2048",
        description: "Block Puzzle Game",
        image: game_2048_img,
    },
    {
        id: 5,
        schema: "RPS",
        title: "RPS",
        description: "Classic Game",
        image: rps_img,
    },
    {
        id: 6,
        schema: "GuessColor",
        title: "Hex Hacker",
        description: "Color Guessing Game",
        image: color_img,
    },
    {
        id: 7,
        schema: null,
        title: "Tic Tac Toe",
        description: "Fun 2P Game",
        image: ttt_img,
    },
    {
        id: 8,
        schema: null,
        title: "\'W\'pm",
        description: "Speed Type Tester",
        image: wpm_img,
    },
];


function Home() {
    document.getElementById("exp").style.opacity = 0;
    return (
        <>
        ${Nav()}
        <div className="container">
            <h1 class="home_h1">Game Gallery</h1> <br></br>
            <div id="game-gallery" className="grid">
                {games.map((game, index) => (
            <Link to={`/game${game.id}`}>
                    <div key={index} className="game-card">
                        <img src={game.image} className="game-image" />
                        <h2 className="game-title">{game.title}</h2>
                        <p className="game-description">{game.description}</p>
                    </div>
            </Link>
                ))}
            </div>
        </div>
        </>
    );
}

export {Home, games};

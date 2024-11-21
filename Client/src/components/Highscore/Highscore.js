import React, { useEffect, useState } from 'react';
import Nav from '../Navbar/navbar';
import { games } from '../Home_page/Home';
import './Highscore.css';
import { getUsername } from '../utils/localStorage';



function Leaderboard() {
    const [scores, setScores] = useState({});
    const lead_games = games.filter(game => game.schema != null && scores[game.schema] != 0);
    console.log(lead_games)
    const username = getUsername();

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch(`http://localhost:80/api/user-scores/${username}`);
                const data = await response.json();

                if (response.ok) {
                    setScores(data.scores);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching scores:', error.message);
            }
        };

        if (username) {
            fetchScores();
        }
    }, [username]);

    return (
        <>
            <Nav />
            <div className="container">
                <h1 className="leaderboard_h1">Highscores</h1>
                <br />
                <h3>{lead_games.length=='0' ? 'Nothing Yet! Play Games at Home.':''}</h3>
                <div id="leaderboard-gallery" className="grid">
                    {lead_games.map((game, index) => (
                        <div key={index} className="leaderboard-card">
                            <img src={game.image} alt={game.title} className="leaderboard-image" />
                            <div className="overlay"></div>
                            <div className="score">
                                <h3>{scores[game.schema]=='0' ? '':scores[game.schema]}</h3>
                            </div>
                            <h2 className="leaderboard-title">{game.title}</h2>
                            <p className="leaderboard-description">{game.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Leaderboard;

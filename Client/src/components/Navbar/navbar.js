import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { getUsername } from '../utils/localStorage';
import { handleLogout } from '../utils/handleLogout'; 

function Nav() {
    const navigate = useNavigate();  
    const username = getUsername(); 

    return (
        <navigator className='home_navigator'>
            <div className='nav_a'>
                <Link to="/profile">
                    Profile
                </Link>
            </div>
            <div className='nav_a'>
                <Link to="/home">
                    Home
                </Link>
            </div>
            <div className='nav_a'>
                <Link to="/leaderboard">
                    Highscores
                </Link>
            </div>
            <div className='nav_a'>
                <Link to="/credits">
                    Credits
                </Link>
            </div>
            {username && (
                <div className='nav_a' onClick={(e) => handleLogout(e, navigate)}>
                    Log Out
                </div>
            )}
            <div className='nav_a'>
                <Link to="/contact">
                    Contact Us
                </Link>
            </div>
        </navigator>
    );
}

export default Nav;

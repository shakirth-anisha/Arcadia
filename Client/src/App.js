// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import { Home } from './components/Home_page/Home';
import Profile from './components/Profile/Profile';
import ContactUs from './components/Contact/Contact';
import Leaderboard from './components/Highscore/Highscore';
import Credits from './components/Credits/Credits';
import Game1 from './components/Fuzzle/Game1';
import Game2 from './components/ShadowStrike/Game2';
import Game3 from './components/MagicMatch/Game3';
import Game4 from './components/2048/Game4';
import Game5 from './components/RPS/Game5';
import Game6 from './components/GuessColor/Game6';
import Game7 from './components/TicTacToe/Game7';
import Game8 from './components/Wpm/Game8';
import { getUsername } from './components/utils/localStorage';

const ProtectedRoute = ({ children }) => {
    const username = getUsername();

    return username ? children : <Navigate to="/" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<Login />} />

                {/* The Protected Routes to implement Log Out */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/contact"
                    element={
                        <ProtectedRoute>
                            <ContactUs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leaderboard"
                    element={
                        <ProtectedRoute>
                            <Leaderboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/credits"
                    element={
                        <ProtectedRoute>
                            <Credits />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/game1"
                    element={
                        <ProtectedRoute>
                            <Game1 />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/game2"
                    element={
                        <ProtectedRoute>
                            <Game2 />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/game3"
                    element={
                        <ProtectedRoute>
                            <Game3 />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/game4"
                    element={
                        <ProtectedRoute>
                            <Game4 />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/game5"
                    element={
                        <ProtectedRoute>
                            <Game5 />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/game6"
                    element={
                        <ProtectedRoute>
                            <Game6 />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/game7"
                    element={
                        <ProtectedRoute>
                            <Game7 />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/game8"
                    element={
                        <ProtectedRoute>
                            <Game8 />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;

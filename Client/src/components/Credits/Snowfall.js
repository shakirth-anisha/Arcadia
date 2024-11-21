// src/components/Snowfall.js
import React from 'react';
import './Snowfall.css';

const Snowfall = () => {
    return (
        <div className="snowfall">
            {Array.from({ length: 100 }).map((_, index) => (
                <div className="snowflake" key={index} style={{ left: `${Math.random() * 100}vw` }}> {/* Random left position */}
                    ❄️
                </div>
            ))}
        </div>
    );
};

export default Snowfall;
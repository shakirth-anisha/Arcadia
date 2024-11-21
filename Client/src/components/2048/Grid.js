import React from 'react';
import Tiles from './Tiles';

export default function Grid({ tiles }) {
    return (
        <div className="2048_grid">
            {tiles.map((row, rowIndex) => (
                <div key={rowIndex} className="tile-row">
                    {row.map((value, colIndex) => (
                        <Tiles key={colIndex} value={value} />
                    ))}
                </div>
            ))}
        </div>
    );
}

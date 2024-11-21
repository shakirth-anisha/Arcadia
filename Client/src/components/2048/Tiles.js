import React from 'react';

export default function Tiles({ value }) {
    const tileStyle = value > 0 ? `tile tile-${value}` : 'tile empty-tile';
    return <div className={tileStyle}>{value > 0 && value}</div>;
}

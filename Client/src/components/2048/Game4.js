import React, {useState, useEffect, useCallback} from 'react';
import Grid from './Grid';
import ScoreBoard from './ScoreBoard';
import GameOver from './GameOver';
import './2048.css'
import bg_img from './bg-img.png';

export default function Game4() {
    const initializeGrid = () => Array(4).fill(0).map(() => Array(4).fill(0));
    const [tiles, setTiles] = useState(initializeGrid());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const initializeGame = useCallback(() => {
        const newGrid = initializeGrid();
        addInitialTiles(newGrid);
        setTiles(newGrid);
        setScore(0);
        setGameOver(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const addInitialTiles = (grid) => {
        for (let i = 0; i < 2; i++) {
            const emptyTiles = [];
            grid.forEach((row, rowIndex) =>
                row.forEach((tile, colIndex) => {
                    if (tile === 0) emptyTiles.push({rowIndex, colIndex});
                })
            );

            if (emptyTiles.length === 0) {
                setGameOver(true);
                return;
            }

            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[randomTile.rowIndex][randomTile.colIndex] = Math.random() > 0.5 ? 2 : 4;
        }
    };

    const addNewTile = (grid) => {
        const emptyTiles = [];
        grid.forEach((row, rowIndex) =>
            row.forEach((tile, colIndex) => {
                if (tile === 0) emptyTiles.push({rowIndex, colIndex});
            })
        );

        if (emptyTiles.length === 0) {
            setGameOver(true);
            return grid;
        }

        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        const newGrid = grid.map(row => [...row]);
        newGrid[randomTile.rowIndex][randomTile.colIndex] = Math.random() > 0.5 ? 2 : 4;
        return newGrid;
    };

    const handleMove = useCallback((direction) => {
        // Prevent move if game is over
        if (gameOver) return;

        let moved = false;
        let newTiles = tiles.map(row => [...row]);
        let currentScore = score;

        const mergeRow = (row) => {
            // Remove zeros
            row = row.filter(val => val !== 0);

            // Merge adjacent equal tiles
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    currentScore += row[i];
                    row.splice(i + 1, 1);
                }
            }

            return row;
        };

        const moveLeft = () => {
            for (let i = 0; i < 4; i++) {
                // Remove zeros and keep non-zero tiles
                let row = newTiles[i].filter(val => val !== 0);

                // Merge tiles
                row = mergeRow(row);

                // Pad with zeros to maintain 4 tile length
                while (row.length < 4) row.push(0);

                // Check if row has changed
                if (row.join(',') !== newTiles[i].join(',')) {
                    moved = true;
                }

                newTiles[i] = row;
            }
        };

        const moveRight = () => {
            for (let i = 0; i < 4; i++) {
                // Remove zeros and keep non-zero tiles
                let row = newTiles[i].filter(val => val !== 0);

                // Merge tiles
                row = mergeRow(row).reverse();

                // Pad with zeros to maintain 4 tile length
                while (row.length < 4) row.unshift(0);

                // Check if row has changed
                if (row.join(',') !== newTiles[i].join(',')) {
                    moved = true;
                }

                newTiles[i] = row;
            }
        };

        const moveUp = () => {
            for (let col = 0; col < 4; col++) {
                // Extract column
                let column = [
                    newTiles[0][col],
                    newTiles[1][col],
                    newTiles[2][col],
                    newTiles[3][col]
                ].filter(val => val !== 0);

                // Merge tiles
                column = mergeRow(column);

                // Pad with zeros to maintain 4 tile length
                while (column.length < 4) column.push(0);

                // Update column and check for changes
                for (let row = 0; row < 4; row++) {
                    if (newTiles[row][col] !== column[row]) {
                        moved = true;
                    }
                    newTiles[row][col] = column[row];
                }
            }
        };

        const moveDown = () => {
            for (let col = 0; col < 4; col++) {
                // Extract column
                let column = [
                    newTiles[0][col],
                    newTiles[1][col],
                    newTiles[2][col],
                    newTiles[3][col]
                ].filter(val => val !== 0);

                // Merge tiles and reverse
                column = mergeRow(column).reverse();

                // Pad with zeros to maintain 4 tile length
                while (column.length < 4) column.unshift(0);

                // Update column and check for changes
                for (let row = 0; row < 4; row++) {
                    if (newTiles[row][col] !== column[row]) {
                        moved = true;
                    }
                    newTiles[row][col] = column[row];
                }
            }
        };

        // Execute move based on direction
        switch (direction) {
            case 'LEFT':
                moveLeft();
                break;
            case 'RIGHT':
                moveRight();
                break;
            case 'UP':
                moveUp();
                break;
            case 'DOWN':
                moveDown();
                break;
            default:
                return;
        }

        // If tiles moved, update state and add a new tile
        if (moved) {
            const updatedTiles = addNewTile(newTiles);
            setTiles(updatedTiles);
            setScore(currentScore);
            console.log(score)
        }
    }, [tiles, score, gameOver]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    handleMove('UP');
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    handleMove('DOWN');
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    handleMove('LEFT');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    handleMove('RIGHT');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMove]);

    return (
        <>
            <img src={`${bg_img}`} className="bg_img"></img>
            <h1 className="title_2048">2048 Game</h1>
            <div className="game-board">
                <ScoreBoard score={score}/>
                <Grid tiles={tiles}/>

                {gameOver && <GameOver onRestart={initializeGame} finalScore={score}/>}
            </div>
        </>
    );
}
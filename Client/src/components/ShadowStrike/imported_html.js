import React from 'react';
import "./imported_html.css";

const ImportantContent = () => {
  return (
    <div style={{ backgroundColor: '#282c34', minHeight: '100vh' }}>
      {/* Container div */}
      <div style={{ position: 'relative', display: 'inline-block', left: '20px' }}>
        
        {/* Smaller red container div */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          {/* Player health */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '4px solid white',
              borderLeft: '4px solid white',
              borderBottom: '4px solid white',
            }}
          >
            <div style={{ backgroundColor: 'red', height: '60px', width: '100%' }}></div>
            <div className="playerHP"></div>
          </div>

          {/* Timer */}
          <div className="timer">100</div>

          {/* Enemy health */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderTop: '4px solid white',
              borderBottom: '4px solid white',
              borderRight: '4px solid white',
            }}
          >
            <div style={{ backgroundColor: 'red', height: '60px' }}></div>
            <div className="enemyHP"></div>
          </div>
        </div>

        <div className="result">Tie</div>

        <canvas style={{marginTop: '20px'}}></canvas>
      </div>

      {/* Replay Button */}
      <div className="replay">
        <button className="replay_btn" onClick={() => window.location.reload()}>
          <img className="btn_img" src="./shadowstrikeimages/replay.png" alt="Replay" />
        </button>
        </div>
    </div>
  );
};

export default ImportantContent;
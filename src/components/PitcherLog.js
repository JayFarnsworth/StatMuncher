import React from 'react';

export default function PitcherLog({Logs}) {
  return (
    <div className='pitcher-game-log'>
      <div className='pitcher-game a'>
        <h2>W</h2>
        <h2>7 IP</h2>
        <h2>3 ER</h2>
        <h2>+30 GS</h2>
      </div>
      <div className='pitcher-game b'>
        <h2>ND</h2>
        <h2>5.2 IP</h2>
        <h2>4 ER</h2>
        <h2>+18 GS</h2>
      </div>
      <div className='pitcher-game c'>
        <h2>W</h2>
        <h2>6 IP</h2>
        <h2>2 ER</h2>
        <h2>+32 GS</h2>
      </div>
      <div className='pitcher-game d'>
        <h2>W</h2>
        <h2>5.2 IP</h2>
        <h2>1 ER</h2>
        <h2>+37 GS</h2>
      </div>
      <div className='pitcher-game e'>
        <h2>L</h2>
        <h2>6.1 IP</h2>
        <h2>5 ER</h2>
        <h2>+5 GS</h2>
      </div>
    </div>
  );

}
import React from 'react';
import logo from '../assets/logo.png'

export default function GameInfo( gameObj ) {
  return (
    <div className='game-info'>
      <h2>{gameObj.location}</h2>
    </div>
  );

}
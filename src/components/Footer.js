import React from 'react';
import logo from '../assets/StatMuncher.png'

export default function Footer() {
  return (
    <footer>
      <div id='footer-left'>
        <img src={logo} className='footer-logo'/>
        <h2>Built with love by Jay Farnsworth</h2>
      </div>
      <nav>
        <h3>Build</h3>
        <h3>Algorithms</h3>
        <h3>Sources</h3>
        <h3>Contact</h3>
      </nav>
    </footer>
  );

}
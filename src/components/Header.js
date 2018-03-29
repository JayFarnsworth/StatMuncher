import React from 'react';
import logo from '../assets/logo.png';
import StatMuncher from '../assets/StatMuncher.png';

export default function Header() {
  return (
    <header>
      <img src={logo} id='logo' alt='' />
      <img src={StatMuncher} className='header-title'/>
    </header>
  );

}
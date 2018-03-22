import React from 'react';

export default function Teams({ homeTeam, awayTeam, homeColors, awayColors }) {
  // team names
  if (homeTeam) {
    var homeTeamName = homeTeam.City + ' ' + homeTeam.Name;
  } else var homeTeamName = 'Home Team';
  if (awayTeam) {
    var awayTeamName = awayTeam.City + ' ' + awayTeam.Name;
  } else var awayTeamName = 'Away Team';
  // team colors
  if (homeColors) var homeStyle = {
    'backgroundColor': homeColors.colors.primary,
    border: '6px solid ' + homeColors.colors.secondary,
    'borderRight': 'none'
  }
  if (awayColors) var awayStyle = {
    'backgroundColor': awayColors.colors.primary,
    border: '6px solid ' + awayColors.colors.secondary,
    'borderLeft': 'none'
  }


  return (
    <div className='team-container'>
      {(awayColors) ? <div className='visiting-team' style={awayStyle}>
        <img src={awayColors.logo} className='away-logo' />
        <h1>{awayTeamName}</h1>
      </div>
        : ''}<h1 id='at'>@</h1>
      {(homeColors) ? <div className='home-team' style={homeStyle}>
        <h1>{homeTeamName}</h1>
        <img src={homeColors.logo} className='home-logo' />
      </div> : ''}


    </div>
  );

}
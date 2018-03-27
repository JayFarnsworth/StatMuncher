import React from 'react';

export default function Teams({ gameObj, homeColors, awayColors }) {
  var awayBorder = gameObj.awayTeam.pitcher.Team.Border;
  var homeBorder = gameObj.homeTeam.pitcher.Team.Border;
  var homeTeamName = gameObj.homeTeam.city + ' ' + gameObj.homeTeam.name;
  var awayTeamName = gameObj.awayTeam.city + ' ' + gameObj.awayTeam.name;
  var homeLogo = gameObj.homeTeam.pitcher.Team.logo;
  var awayLogo = gameObj.awayTeam.pitcher.Team.logo;

  return (
    <div className='team-container'>
      <div className='visiting-team' style={awayBorder}>
        <img src={awayLogo} className='away-logo' />
        <h1>{awayTeamName}</h1>
      </div>
        <h1 id='at'>@</h1>
      <div className='home-team' style={homeBorder}>
        <h1>{homeTeamName}</h1>
        <img src={homeLogo} className='home-logo' />
      </div>


    </div>
  );

}
import React, { Component } from 'react';
import PitcherLog from './PitcherLog';
import player_list from '../assets/playerObject.json';

class Pitchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHomePitcher: false,
      statYear: '2017',
      homeExpand: false,
      awayExpand: false
    }
  }
  componentDidMount(){
    this.setState({
      players: player_list
    })
  }
  showAwayPitcherGames = (event) => {
    let show = this.state.showHomePitcher;
    this.setState({showHomePitcher: !show})
    this.setLogs();
  }
  setLogs = () => {
    var homeLogs = this.props.gameObj.homeTeam.pitcher.logs[0].cum10Game;
    var awayLogs = this.props.gameObj.awayTeam.pitcher.logs[0].cum10Game;
    console.log(homeLogs)
    this.setState({homeLogs: homeLogs})
  }
  // getPitcherInfo = (home, away) => {
  //   let players = this.state.players;
  //   let homeId = this.props.gameData.game.homeTeam.Abbreviation;
  //   let awayId = this.props.gameData.game.awayTeam.Abbreviation;
  //   let homeTeam = players.homeID;
  //   let awayTeam = players.awayID;
  //   let homePitcherInfo = homeTeam.homeId;
  //   let awayPitcherInfo = awayTeam.awayId;
  //   this.setState({
  //     homePitcher: homePitcherInfo,
  //     awayPitcher: awayPitcherInfo
  //   });

  // }
  // getPitcherData = (homePitcher, awayPitcher) => {
  //   let homeUrlId = homePitcher.bref_id;
  //   let awayUrlId = awayPitcher.bref_id;
  //   let homeID = homePitcher.ID;
  //   let awayID = awayPitcher.ID;
  //   var homeStats = async () => {
  //     const response = await fetch('http://localhost:4000/scrapepitcher/?pitcher=' + homeUrlId)
  //     const json = await response.json()
  //     if (json.length > 0) {
  //       this.setState({ homePitcherStats: json[0] }, () => {
  //         this.setState({ homeStatsFiltered: this.filterStatYear(json[0])[0] }, () => {homeOPS()})
  //       })
  //     }
  //   }
  //   var awayStats = async () => {
  //     const response = await fetch('http://localhost:4000/scrapepitcher/?pitcher=' + awayUrlId)
  //     const json = await response.json()
  //     console.log(json)
  //     if (json.length > 0){
  //       this.setState({ awayPitcherStats: json[0] }, () => {
  //         this.setState({ awayStatsFiltered: this.filterStatYear(json[0])[0] }, () => {awayOPS()})
  //       })
  //     }
  //   }
  //   var homeOPS = async () => {
  //     var headers = {
  //       'Authorization': 'Basic a3Vicmlja2FuOkgzbHRvbjE3MTcu',
  //       'content-type': 'application/json'
  //     };
  //     var url = 'https://api.mysportsfeeds.com/v1.2/pull/mlb/' + this.state.statYear + '-regular/cumulative_player_stats.json?playerstats=OPS&player=' + homeID;
  //     const response = await fetch(url, {
  //       credentials: 'same-origin',
  //       headers: headers,
  //       method: 'GET',
  //       mode: 'cors'
  //     });
  //     const json = await response.json();
  //     if (json.cumulativeplayerstats.playerstatsentry) {
  //       var OPS = json.cumulativeplayerstats.playerstatsentry[0].stats.PitcherOnBasePlusSluggingPct['#text'];
  //       var homeStats = this.state.homeStatsFiltered;
  //       homeStats.OPS = OPS;
  //       this.setState({homeStats: homeStats, homeOPS: OPS})
  //     }
  //   }
  //   var awayOPS = async () => {
  //     var headers = {
  //       'Authorization': 'Basic a3Vicmlja2FuOkgzbHRvbjE3MTcu',
  //       'content-type': 'application/json'
  //     };
  //     var url = 'https://api.mysportsfeeds.com/v1.2/pull/mlb/' + this.state.statYear + '-regular/cumulative_player_stats.json?playerstats=OPS&player=' + awayID;
  //     const response = await fetch(url, {
  //       credentials: 'same-origin',
  //       headers: headers,
  //       method: 'GET',
  //       mode: 'cors'
  //     });
  //     const json = await response.json();
  //     if (json.cumulativeplayerstats.playerstatsentry) {
  //       var OPS = json.cumulativeplayerstats.playerstatsentry[0].stats.PitcherOnBasePlusSluggingPct['#text'];
  //       var awayStats = this.state.awayStatsFiltered;
  //       awayStats.OPS = OPS;
  //       this.setState({ awayStats: awayStats, awayOPS: OPS })
  //     }
  //   }
  //   homeStats();
  //   awayStats();
  // }


  filterStatYear = (pitcherStats) => {
    let statYear = this.state.statYear;
    let yearFiltered = pitcherStats.filter(year=>{
      if (statYear === year.Year && ((year.Lg == 'NL') || (year.Lg == 'AL'))) return year
    })
    console.log(yearFiltered)
    return yearFiltered;
  }
  sendPitcherData = (home, away) => {
    this.props.getPitcherData(home, away)
  }
  getGameColor = (game) => {
    var red = { backgroundColor: 'rgba(147, 61, 70, 0.788)' };
    var green = { backgroundColor: 'rgba(70, 120, 57, 0.788)' };
    if (Number(game.IP) > 6 && Number(game.ER) < 3) {
      return green;
    } else if (Number(game.W) === 1) {
      return green;
    } else if (Number(game.IP) > 5 && Number(game.ERA) < 3) {
      return green;
    } else if (Number(game.OPS) < .500) {
      return green;
    } else if (Number(game.IP) < 4 && Number(game.ER) > 5) {
      return red;
    } else if (Number(game.ER) >= 5 && Number(game.L) === 1) {
      return red;
    } else if (Number(game.OPS) > 1.2 && Number(game.L) === 1) {
      return red;
    } else if (Number(game.IP) < 3) {
      return red;
    } else if (Number(game.ER) > 5) {
      return red;
    }
  }
  homeExpand = (event) => {
    var homeExpand = this.state.homeExpand;
    homeExpand = !homeExpand;
    this.setState({homeExpand: homeExpand})
  }
  awayExpand = (event) => {
    var awayExpand = this.state.awayExpand;
    awayExpand = !awayExpand;
    this.setState({ awayExpand: awayExpand })
  }
  getMatchHotColor = (score) => {
    if (score > 30) {
      return {color: 'rgb(0, 102, 0)'};
    } if (score < -30) {
      return {color: 'rgb(170, 0, 0)'};
    }
  }
  addPlusSign = (score) => {
    if (Number(score) > 0) {
      return '+' + score;
    } else return score;
  }
  invertNumber = (number) => {
    if (Number(number) > 0) {
      return Number(number) - (Number(number) * 2)
    } if (Number(number) < 0) {
      return Math.abs(number)
    } else return 0
  }

  render(props) {
    var gameObj = this.props.gameObj;
    var homePitcher = gameObj.homeTeam.pitcher;
    var awayPitcher = gameObj.awayTeam.pitcher;
    var homeImgBorder = homePitcher.Team.Border;
    // homeImgBorder.borderWidth = '3px';
    var awayImgBorder = awayPitcher.Team.Border;
    // awayImgBorder.borderWidth = '3px';
    var home10Cum = homePitcher.logs[0].cumTenGame;
    var away10Cum = awayPitcher.logs[0].cumTenGame;
    function calculatePitcherHotness(stats){
      var averageOPS = .750;
      var OPSDifference = ((Number(averageOPS) - Number(stats.OPS)) * 500)
      var wins = Number(stats.W) * 20;
      var losses = Number(stats.L) * 20;
      var IP = Number(stats.IP);
      IP = Math.floor(IP) * 5;
      var ER = Number(stats.ER) * 5;
      var hotnessScore = ((OPSDifference + wins - losses + IP - ER));
      return hotnessScore;
    }
    var homeHotness = calculatePitcherHotness(home10Cum);
    var awayHotness = calculatePitcherHotness(away10Cum);

    return (
      <div>
        <div className={(this.state.awayExpand) ? 'pitcher-container left' : 'pitcher-container left pitcher-margins'}>
          <div className='full-pitcher-cont left' onClick={this.awayExpand}>
            <div className={(this.state.awayExpand) ? 'logs-cont' : 'logs-cont collapsed logs-hover'}>
              <div className='pitcher-logs-border' style={{backgroundColor: this.props.awayColors.colors.secondary}}></div>
              <div className='pitcher-logs'>
              {awayPitcher.logs[0].gameLogs.map((game, i)=>{
                 if (i < 5) {
                   return (
                     <div className='game-log' style={this.getGameColor(game.stats)}>
                       <div className='log-date' style={{backgroundColor: this.props.awayColors.colors.primary}}>
                         <h3>{game.date.slice(6).replace("-", '/')} vs {game.teamFaced}</h3>
                       </div>
                       <div className='game-stats-container'>
                         <h3>{(game.stats.W == 1) ? 'W' : (game.stats.L == 1) ? 'L' : 'ND'} {game.stats.IP} IP</h3>
                         <h3>{game.stats.ER} ER</h3>
                         <h3>{game.stats.H}H {game.stats.BB}BB</h3>
                       </div>
                     </div>
                   )
                 }
              })}
              </div>
            </div>
            <div className='pitcher-card left' onClick={this.showPitcherGames} style={awayPitcher.Team.Border}>
            
              <img src={awayPitcher.Image} className='pitcher-pic' alt='' style={awayImgBorder}/>
              <div className='pitcher-text'>
                <h2 className='pitcher-name'>{awayPitcher.LastName}, {awayPitcher.FirstName}</h2>
                <h2>{awayPitcher.Handedness.Throws}H Starting Pitcher</h2>
                <h2>#{awayPitcher.JerseyNumber} - Age {awayPitcher.Info.Age}</h2>
                <h2>{awayPitcher.Stats.W}-{awayPitcher.Stats.L} : {awayPitcher.Stats.ERA} ERA</h2>
              </div>
              <div className='player-scores pitcher-scores'>
                <h3 style={this.getMatchHotColor(this.invertNumber(this.props.homeCum))} className='match-hot'>{this.addPlusSign(this.invertNumber(this.props.homeCum))}</h3>
                <h3>MATCH</h3>
                <h3>HOT</h3>
                <h3 style={this.getMatchHotColor(awayHotness)} className='match-hot'>{(awayHotness > 0) ? '+' : null}{awayHotness.toFixed(0)}</h3>
              </div>
            </div>
            <div className={(this.state.awayExpand) ? 'pitcher-stat-dropdown' : 'pitcher-stat-dropdown pitcher-stat-collapsed collapsed-hover'}>
              <div className='pitcher-dropdown-main'>
                <table>
                  <tr>
                    <th></th>
                    <th>W-L</th>
                    <th>IP</th>
                    <th>ERA</th>
                    <th>WHIP</th>
                    <th>OPS</th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>2017</td>
                      <td>{awayPitcher.Stats.W} - {awayPitcher.Stats.L}</td>
                      <td>{awayPitcher.Stats.IP}</td>
                      <td>{awayPitcher.Stats.ERA}</td>
                      <td>{awayPitcher.Stats.WHIP}</td>
                      <td>{awayPitcher.Stats.OPS}</td>
                    </tr>
                    <tr>
                      <td>vs Today's Lineup</td>
                      <td>3 - 1</td>
                      <td>14.2</td>
                      <td>3.21</td>
                      <td>1.143</td>
                      <td>.760</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='pitcher-logs-border' style={{ backgroundColor: this.props.awayColors.colors.secondary }}></div>
            </div>
            </div>
            <h1 id='vs'>vs</h1>
            
          <div className={(this.state.homeExpand) ? 'pitcher-container right' : 'pitcher-container right pitcher-margins'}>
            <div className='full-pitcher-cont right' onClick={this.homeExpand}>
              <div className={(this.state.homeExpand) ? 'logs-cont' : 'logs-cont collapsed logs-hover'}>
                <div className='pitcher-logs-border' style={{ backgroundColor: this.props.homeColors.colors.secondary }}></div>
                <div className='pitcher-logs'>
                  {homePitcher.logs[0].gameLogs.map((game, i) => {
                    if (i < 5) {
                      return (
                        <div className='game-log' style={this.getGameColor(game.stats)}>
                          <div className='log-date' style={{ backgroundColor: this.props.homeColors.colors.primary }}>
                            <h3>{game.date.slice(6).replace("-", '/')} vs {game.teamFaced}</h3>
                          </div>
                          <div className='game-stats-container'>
                            <h3>{(game.stats.W == 1) ? 'W' : (game.stats.L == 1) ? 'L' : 'ND'} {game.stats.IP} IP</h3>
                            <h3>{game.stats.ER} ER</h3>
                            <h3>{game.stats.H}H {game.stats.BB}BB</h3>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
              <div className='pitcher-card right' style={homePitcher.Team.Border}>

                <img src={homePitcher.Image} className='pitcher-pic' alt='' style={homeImgBorder} />
                <div className='pitcher-text'>
                  <h2 className='pitcher-name'>{homePitcher.LastName}, {homePitcher.FirstName}</h2>
                  <h2>{homePitcher.Handedness.Throws}H Starting Pitcher</h2>
                  <h2>#{homePitcher.JerseyNumber} - Age {homePitcher.Info.Age}</h2>
                  <h2>{homePitcher.Stats.W}-{homePitcher.Stats.L} : {homePitcher.Stats.ERA} ERA</h2>
                </div>
                <div className='player-scores pitcher-scores'>
                  <h3 style={this.getMatchHotColor(this.invertNumber(this.props.awayCum))} className='match-hot'>{this.addPlusSign(this.invertNumber(this.props.awayCum))}</h3>
                  <h3>MATCH</h3>
                  <h3>HOT</h3>
                  <h3 style={this.getMatchHotColor(homeHotness)} className='match-hot'>{this.addPlusSign(homeHotness.toFixed(0))}</h3>
                </div>
              </div>
              <div className={(this.state.homeExpand) ? 'pitcher-stat-dropdown' : 'pitcher-stat-dropdown pitcher-stat-collapsed collapsed-hover'}>
                <div className='pitcher-dropdown-main'>
                  <table>
                    <tr>
                      <th></th>
                      <th>W-L</th>
                      <th>IP</th>
                      <th>ERA</th>
                      <th>WHIP</th>
                      <th>OPS</th>
                    </tr>
                    <tbody>
                      <tr>
                        <td>2017</td>
                        <td>{homePitcher.Stats.W} - {homePitcher.Stats.L}</td>
                        <td>{homePitcher.Stats.IP}</td>
                        <td>{homePitcher.Stats.ERA}</td>
                        <td>{homePitcher.Stats.WHIP}</td>
                        <td>{homePitcher.Stats.OPS}</td>
                      </tr>
                      <tr>
                        <td>vs Today's Lineup</td>
                        <td>2 - 2</td>
                        <td>23.1</td>
                        <td>5.34</td>
                        <td>1.675</td>
                        <td>1.340</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='pitcher-logs-border' style={{ backgroundColor: this.props.homeColors.colors.secondary }}></div>
              </div>
            </div>
        </div>
        </div>
      </div>
    );
  }
}

export default Pitchers;

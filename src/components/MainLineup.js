import React, { Component } from 'react';
import player_list from '../assets/playerList0320.json';

class MainLineup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchDelay: 2000,
      batterData: {

      },
      homeHidden: true,
      awayHidden: false,
      playerDetailsExpand: false,
      detailsHover: false
    }
  }

  componentDidMount(){
    if (this.props.gameObj) {
      this.getPitcherStats(this.props.gameObj);
    }
  }
  toggleHome = (event) => {
    let homeHidden = this.state.homeHidden;
    let awayHidden = this.state.awayHidden;
    homeHidden = !homeHidden;
    if (!awayHidden) awayHidden = !awayHidden;
    this.setState({
      homeHidden: homeHidden,
      awayHidden: awayHidden
    })
  }
  toggleAway = (event) => {
    let homeHidden = this.state.homeHidden;
    let awayHidden = this.state.awayHidden;
    awayHidden = !awayHidden;
    if (!homeHidden) homeHidden = !homeHidden;
    this.setState({
      homeHidden: homeHidden,
      awayHidden: awayHidden
    })
  }
  toggleDetails = (event) => {
    let expandDetails = this.state.playerDetailsExpand;
    expandDetails = !expandDetails;
    this.setState({playerDetailsExpand: expandDetails})
  }
  // fetchBatter = (batter) => {
  //   let id = batter.info.bref_id;
  //   var batterStats = async () => {
  //     const response = await fetch('http://localhost:4000/scrapebatter/?batter=' + id)
  //     const json = await response.json()
  //     if (json.length > 0) {
  //       return json
  //       }
  //     }
  //   batterStats().then(resp=>{
  //     let batterData = this.state.batterData;
  //     if (resp.length > 0) batterData[batter.player.LastName] = resp[0];
  //     this.setState({ batterData: batterData }, () => {
  //       this.filterBatterData();
  //     })
  //   })
  // }
  // delay = (msec) => {
  //   return new Promise(resolve => {
  //     setTimeout(resolve, msec);
  //   })
  // }
  // getJSON(player, index) {
  //   return Promise.resolve()
  //     .then(() => {
  //       return this.delay(index * (this.state.fetchDelay));
  //     })
  //     .then(() => {
  //       return this.fetchBatter(player)
  //     })
  //     .then(() => {
  //       return this.fetchMatchup(player)
  //     })
  // }
  // filterBatterData = () => {
  //   let year = this.props.selectedYear;
  //   let lineup = this.state.awayLineup
  //   lineup.map((player, i) => {
  //     var batter = player.player.LastName;
  //     if (this.state.batterData[batter]) {
  //       let data = this.state.batterData[batter];
  //       let a = data.filter(row => {
  //         if (row.Year == year && (row.Lg === 'NL' || row.Lg === 'AL')) return row;
  //       })
  //       player.stats = a[0]
  //     }
  //   })
  //   this.setState({filteredLineup: lineup})
  // }

  getMatchupScore = (stats) => {
    if (stats == 'no data') {
      return 'No History'
    } else {
      var AB = Number(stats.AB) * -1;
      var H = Number(stats.H) * 2;
      var Double = Number(stats['2B']) * 2;
      var Triple = Number(stats['3B']) * 3;
      var HR = Number(stats.HR) * 4;
      var RBI = Number(stats.RBI) * 2;
      var SO = Number(stats.SO) * -1;
      var BB = Number(stats.BB) * 1;
      var OPSDifference = (Number(stats.OPS) - .750) * 10;
      var OPSScore = Number(stats.AB) * OPSDifference;
      var matchupScore = AB + H + Double + Triple + HR + RBI + SO + BB
      if (Number(stats.AB > 5)) matchupScore += OPSScore;
      return matchupScore.toFixed(1);
    }
  }
  getPitcherStats = () => {
    var awayPitcherStats = this.props.gameObj.awayTeam.pitcher.stats;
    var homePitcherStats = this.props.gameObj.homeTeam.pitcher.stats;
    this.setState({
      homePitcherStats: homePitcherStats,
      awayPitcherStats: awayPitcherStats
    })
  }
  getBAColor = (matchupStats, pitcherStats) => {
    var color;
    var matchupBA = Number(matchupStats.BA);
    var pitcherBA = Number(pitcherStats.BA);
    var green = {
      color: '#c2ffc1'
    }
    var red = {
      color: '#ffc6cc'
    }
    if (Number(matchupStats.AB) > 5) {
      if (pitcherBA + .050 < matchupBA) {
        color = green;
      } else if (pitcherBA -.050 > matchupBA) {
        color = red;
      } 
    } else {
      if (pitcherBA + .199 < matchupBA) {
        color = green;
      } 
    }
    return color;
  }
  getOPSColor = (matchupStats, pitcherStats) => {
    var color;
    var matchupOPS = Number(matchupStats.OPS);
    var pitcherOPS = Number(pitcherStats.OPS);
    var green = {
      color: '#c2ffc1'
    }
    var red = {
      color: '#ffc6cc'
    }
    if (Number(matchupStats.AB) > 5) {
      if (pitcherOPS + .200 < matchupOPS) {
        color = green;
      } else if (pitcherOPS - .200 > matchupOPS) {
        color = red;
      }
    } else {
      if (pitcherOPS + .200 < matchupOPS) {
        color = green;
      }
    }
    return color;
  }
  getRBIColor = (matchupStats, pitcherStats) => {
    var color;
    var matchupRBIrt = Number(matchupStats.RBI / matchupStats.AB);
    var pitcherRBIrt = Number(pitcherStats.ER / pitcherStats.PAB);
    var green = {
      color: '#c2ffc1'
    }
    var red = {
      color: '#ffc6cc'
    }
    if (pitcherRBIrt + 1 < matchupRBIrt) {
      color = green;
    } else if (pitcherRBIrt - 2 > matchupRBIrt && matchupStats.PAB > 14) {
      color = red;
    }
    return color;
  }
  getLogColor = (game) => {
    var red = { backgroundColor: 'rgba(147, 61, 70, 0.788)' };
    var green = { backgroundColor: 'rgba(70, 120, 57, 0.788)' };
    if (Number(game.BA) > 0.500 || game.HR > 0 || Number(game.OPS) > 1.5) {
      var color = green;
    } else if (Number(game.SO) > 3 || (Number(game.AB) > 3 && Number(game.OPS) < .250)) {
      var color = red;
    } else {
      var color = { backgroundColor: 'rgba(94, 94, 94, 0.8)' }
    }
    return color;
  }
  getHistoryLength = (matchup) => {
    if (Number(matchup.AB) < 6) {
      return 'Short'
    } else if (Number(matchup.AB) >= 6 && Number(matchup.AB) < 20) {
      return 'Familiar'
    } else if (Number(matchup.AB) >= 20) {
      return 'Long'
    } else if (Number(matchup.AB) === 0 || matchup.AB === null || matchup.AB === undefined) {
      return 'First Meeting'
    }
  }
  getBatterSuccess = (matchup) => {
    if (Number(matchup.AB) < 6) {
      if (Number(matchup.OPS) > 1) {
        return 'Power'
      } else if (Number(matchup.BA) > .400) {
        return 'Average'
      } else if (Number(matchup.BB) / Number(matchup.SO) > 2 || (Number(matchup.BB) > 2 && Number(matchup.SO) === 0)){
        return 'Count'
      } else if (Number(matchup.RBI) > 2) {
        return 'Runs'
      } else if (Number(matchup.BA) === 0 && Number(matchup.BB) < 2) {
        return 'None'
      }
  } else if (Number(matchup.AB) >= 6) {
      if (Number(matchup.OPS) > 1) {
        return 'Power'
      } else if (Number(matchup.BA) > .400) {
        return 'Average'
      } else if (Number(matchup.BB) / Number(matchup.SO) > 2 || (Number(matchup.BB) > 2 && Number(matchup.SO) === 0)) {
        return 'Count'
      } else if (Number(matchup.RBI) > 2) {
        return 'Runs'
      } else if (Number(matchup.BA) === 0 && Number(matchup.BB) < 2) {
        return 'None'
      }
  }
  }
  getHotnessScore = (stats) => {
    var OPSDifference = Number(stats.OPS) - .750;
    var AB = Number(stats.AB)
    var HR = Number(stats.HR);
    var RBI = Number(stats.RBI);
    var BB = Number(stats.BB);
    var SO = Number(stats.SO);
    var score = (OPSDifference * AB * 10) + (HR * 4) + (RBI * 3) + BB + (SO * -2);
    return score.toFixed(0);
  } 

  render() {
    if (this.props.awayColors) { var awayStyle = {
      border: '6px solid ' + this.props.awayColors.colors.secondary,
      'borderLeft': '0',
      backgroundColor: this.props.awayColors.colors.primary,
    };
    var awayImgBorder = {
        border: '3px solid ' + this.props.awayColors.colors.secondary,
      } 
    } 
    if (this.props.homeColors) {
      var homeStyle = {
        border: '6px solid ' + this.props.homeColors.colors.secondary,
        'borderRight': '0',
        backgroundColor: this.props.homeColors.colors.primary,
      }
      var homeImgBorder = {
        border: '3px solid ' + this.props.homeColors.colors.secondary,
      }
      
    } 
    var awayPitcherStats = this.props.gameObj.awayTeam.pitcher.Stats;
    var homePitcherStats = this.props.gameObj.homeTeam.pitcher.Stats;
    var green = {
      backgroundColor: 'rgba(2, 114, 0, 0.79)'
    }
    var red = {
      backgroundColor: 'rgba(160, 0, 16, 0.788)'
    }
    return (
      <div className='roster-wrapper'>
        <div className={(this.state.awayHidden) ? 'away-container away-hidden' : 'away-container'} >
          {(true) ? this.props.gameObj.awayTeam.lineup.map((player, i)=>{
            var s = player.stats.stats;
            return (
          <div className={(this.state.playerDetailsExpand) ? 'player-container' : 'player-container collapsed-space'}>
                <div className={(this.state.playerDetailsExpand) ? 'popup-top' : 'popup-top collapsed hidden'}>
                  <div className={(this.state.playerDetailsExpand) ? 'pop-border' : 'pop-border'} style={{backgroundColor: this.props.awayColors.colors.secondary}}></div>
              <div className={(this.state.playerDetailsExpand) ? 'top-pop' : 'top-pop'}>
              {player.logs.gameLogs.map(game=>{
                return(
                  <div className={(this.state.playerDetailsExpand) ? 'game-log' : 'game-log'} style={this.getLogColor(game.stats)}>
                    <div className={(this.state.playerDetailsExpand) ? 'log-date' : 'log-date'}>
                      <h3>{(game.date).slice(6).replace("-", '/')}</h3>
                    </div>
                    <div className='game-stats-container'>
                      <h3>{game.stats.H} / {game.stats.AB}</h3>
                      <h3>{(game.stats.HR === 1) ? 'HR' : (game.stats.HR > 1) ? game.stats.HR + ' HR' : null} {(game.stats.RBI === 1) ? 'RBI' : (game.stats.RBI > 1) ? game.stats.RBI + ' RBI' : null}</h3>
                      <h3>{(game.stats['2B'] === 1) ? '2B' : (game.stats['2B'] > 1) ? game.stats['2B'] + ' 2B' : null} {(game.stats['3B'] === 1) ? ' 3B' : (game.stats.BB === 1) ? ' BB' : (game.stats.BB > 1) ? game.stats.BB + ' BB' : null}</h3>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
            <div className='player away' style={awayStyle} onClick={this.toggleDetails} onMouseHover={this.detailsHover}>
                  <img src={player.info.Image} className='lineup-pic' style={awayImgBorder} />
                  <div>
                    <div className='lineup-header'>
                        <h2>{player.batOrder}) {player.info.LastName}, {player.info.FirstName} {player.position}</h2>
                    </div>
                    <div className='player-scores'>
                        <h3>Matchup: {this.getMatchupScore(player.matchup)}</h3>
                        <h3>Hotness: {this.getHotnessScore(player.logs.cumTenGame)}</h3>
                    </div>
                  </div>
                <div className='lastten'>
                  <h3>Last Ten Days:</h3>
                    <h3>AVG {(Math.round(((Number(player.logs.cumTenGame.BA) - Number(player.stats.stats.BA)) / Number(player.stats.stats.BA)) * 100) > 0) ? ' ↑ ' : ' ↓ ' }{Math.round(((Number(player.logs.cumTenGame.BA) - Number(player.stats.stats.BA)) / Number(player.stats.stats.BA)) * 100)}%</h3>
                    <h3>SLG{(((Number(player.logs.cumTenGame.SLG) - Number(player.stats.stats.SLG) / Number(player.stats.stats.SLG) * 100)) > 0) ? ' ↑ ' : ' ↓ '}{(Number(player.logs.cumTenGame.SLG) - Number(player.stats.stats.SLG) / Number(player.stats.stats.SLG))}%</h3>
                </div>
                <div className='vspitcher'>
                  <h3>VS {this.props.gameObj.homeTeam.pitcher.LastName}:</h3>
                  <div className='history'>
                    <h3>{this.getHistoryLength(player.matchup)} History</h3>
                  </div>
                </div>
              </div>
              <div className={(this.state.playerDetailsExpand) ? 'below-container' : 'below-contianer bottom-collapsed' }>
                <div className={(this.state.playerDetailsExpand) ? 'stats-below' : 'stats-below hidden a'}>
                   <table className='delay'>
                      <tr>
                        <th></th>
                        <th>AB</th>
                        <th>AVG</th>
                        <th>RBI</th>
                        <th>HR</th>
                        <th>BB%</th>
                        <th>SO%</th>
                        <th>OPS</th>
                      </tr>
                      <tr>
                        <td>2017</td>
                        <td>{player.stats.stats.AB}</td>
                        <td>{s.BA}</td>
                        <td>{player.stats.stats.RBI}</td>
                        <td>{player.stats.stats.HR}</td>
                        <td>{((player.stats.stats.BB / player.stats.stats.PA) * 100).toFixed(0)}%</td>
                        <td>{((player.stats.stats.SO / player.stats.stats.PA) * 100).toFixed(0)}%</td>
                        <td>{player.stats.stats.OPS}</td>
                      </tr>
                      <tr>
                        <td>vs {this.props.gameObj.homeTeam.pitcher.LastName}</td>
                        <td>{player.matchup.AB}</td>
                        <td style={this.getBAColor(player.matchup, homePitcherStats)}>{player.matchup.BA}</td>
                        <td style={this.getRBIColor(player.matchup, homePitcherStats)}>{player.matchup.RBI}</td>
                        <td>{player.matchup.HR}</td>
                        <td>{((player.matchup.BB / player.matchup.PA) * 100).toFixed(0)}%</td>
                        <td>{((player.matchup.SO / player.matchup.PA) * 100).toFixed(0)}%</td>
                        <td style={this.getOPSColor(player.matchup, homePitcherStats)}>{player.matchup.OPS}</td>
                      </tr>
                    </table>

                </div>
                  <div className='pop-border' style={{ backgroundColor: this.props.awayColors.colors.secondary }}>
                </div>
              </div>
            </div>)
          }) : ''}
        </div>
        <div className={(this.state.homeHidden) ? 'home-container home-hidden' : 'home-container'} onClick={this.toggleHome}>
          {this.props.gameObj.homeTeam.lineup.map(player=>{
            return (
              <div className='player home' style={homeStyle}>
                
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default MainLineup;

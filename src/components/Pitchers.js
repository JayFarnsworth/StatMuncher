import React, { Component } from 'react';
import PitcherLog from './PitcherLog';
import player_list from '../assets/playerObject.json';

class Pitchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHomePitcher: false,
      statYear: '2017'
    }
  }
  componentDidMount(){
    this.setState({
      players: player_list
    })
  }
  showPitcherGames = (event) => {
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
      var OPSDifference = ((Number(averageOPS) - Number(stats.OPS)) * 1000)
      var wins = Number(stats.W) * 20;
      var losses = Number(stats.L) * -20;
      var IP = Number(stats.IP);
      IP = Math.floor(IP) * 2;
      var ER = Number(stats.ER) * -4;
      var hotnessScore = OPSDifference + wins + losses + IP + ER;
      return hotnessScore;
    }
    var homeHotness = calculatePitcherHotness(home10Cum);
    var awayHotness = calculatePitcherHotness(away10Cum);

    return (
      <div>
        <div className='pitcher-container left'>
          <div className='pitcher-card left' onClick={this.showPitcherGames} style={awayPitcher.Team.Border}>
            <img src={awayPitcher.Image} className='pitcher-pic' alt='' style={awayImgBorder}/>
            <div className='pitcher-text'>
              <h2 className='pitcher-name'>{awayPitcher.LastName}, {awayPitcher.FirstName}</h2>
              <div className='pitcher-stat-main'>
                <table>
                  <tr>
                    <th>W-L</th>
                    <th>IP</th>
                    <th>ERA</th>
                    <th>WHIP</th>
                    <th>OPS</th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>{awayPitcher.Stats.W} - {awayPitcher.Stats.L}</td>
                      <td>{awayPitcher.Stats.IP}</td>
                      <td>{awayPitcher.Stats.ERA}</td>
                      <td>{awayPitcher.Stats.WHIP}</td>
                      <td>{awayPitcher.Stats.OPS}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='analysis-scores'>
                <h2>Matchup: +40</h2>
                <h2>Hotness: {Math.ceil(awayHotness)}</h2>
              </div>
            </div>
          </div>
          <h1>vs</h1>
          <div className='pitcher-card right' onClick={this.showPitcherGames} style={homePitcher.Team.Border}>
            <img src={homePitcher.Image} className='pitcher-pic' alt='' style={homeImgBorder} />
            <div className='pitcher-text'>
              <h2 className='pitcher-name'>{homePitcher.LastName}, {homePitcher.FirstName}</h2>
              <div className='pitcher-stat-main'>
                <table>
                  <tr>
                    <th>W-L</th>
                    <th>IP</th>
                    <th>ERA</th>
                    <th>WHIP</th>
                    <th>OPS</th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>{homePitcher.Stats.W} - {homePitcher.Stats.L}</td>
                      <td>{homePitcher.Stats.IP}</td>
                      <td>{homePitcher.Stats.ERA}</td>
                      <td>{homePitcher.Stats.WHIP}</td>
                      <td>{homePitcher.Stats.OPS}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='analysis-scores'>
                <h2>Matchup: +40</h2>
                <h2>Hotness: {Math.ceil(homeHotness)}</h2>
              </div>
            </div>
          </div>
        </div>

        {(this.state.showHomePitcher) ? <PitcherLog
          homeLogs={this.homeLogs}
          /> : ''}
      </div>
    );
  }
}

export default Pitchers;

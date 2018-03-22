import React, { Component } from 'react';
import PitcherLog from './PitcherLog';
import player_list from '../assets/playerList0320.json';

class Pitchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHomePitcher: false,
      statYear: '2017'
    }
  }
  componentDidMount(){
    this.setState({players: player_list}, () => {
      this.getPitcherInfo(this.props.homePitcher, this.props.awayPitcher)
    })
  }
  showPitcherGames = (event) => {
    let show = this.state.showHomePitcher;
    this.setState({showHomePitcher: !show})
  }
  getPitcherInfo = (home, away) => {
    let players = this.state.players;
    let homeId = home.ID;
    let awayId = away.ID;
    let homeFull = players.filter(player=>{
      if (player.player.ID === homeId) return player;
    })
    let awayFull = players.filter(player=>{
      if (player.player.ID === awayId) return player;
    })
    console.log(homeFull)
    if (homeFull.length > 0) {
      this.setState({
        homePitcher: homeFull[0].player,
      })
    }
    if (awayFull.length > 0) {
      this.setState({
        awayPitcher: awayFull[0].player
      }, () => {
        this.sendPitcherData(homeFull[0].player, awayFull[0].player)
      })
    }
    if (awayFull.length > 0 && homeFull.length > 0) {
      this.getPitcherData(homeFull[0].player, awayFull[0].player)
    }
  }
  getPitcherData = (homePitcher, awayPitcher) => {
    let homeUrlId = homePitcher.bref_id;
    let awayUrlId = awayPitcher.bref_id;
    var homeStats = async () => {
      const response = await fetch('http://localhost:4000/scrapepitcher/?pitcher=' + homeUrlId)
      const json = await response.json()
      if (json.length > 0) {
        this.setState({ homePitcherStats: json[0] }, () => {
          this.setState({ homeStatsFiltered: this.filterStatYear(json[0])[0] })
        })
      }
    }
    var awayStats = async () => {
      const response = await fetch('http://localhost:4000/scrapepitcher/?pitcher=' + awayUrlId)
      const json = await response.json()
      if (json.length > 0){
        this.setState({ awayPitcherStats: json[0] }, () => {
          this.setState({ awayStatsFiltered: this.filterStatYear(json[0])[0] })
        })
      }
    }
    homeStats();
    awayStats();
  }
  filterStatYear = (pitcherStats) => {
    let statYear = this.state.statYear;
    let yearFiltered = pitcherStats.filter(year=>{
      if (statYear === year.Year && ((year.Lg == 'NL') || (year.Lg == 'AL'))) return year
    })
    return yearFiltered;
  }
  sendPitcherData = (home, away) => {
    this.props.getPitcherData(home, away)
  }

  render(props) {
    var home = this.props.homeStatsFiltered;
    var homeFull = this.props.homePitcher.LastName + ', ' + this.props.homePitcher.FirstName;
    var awayFull = this.props.awayPitcher.LastName + ', ' + this.props.awayPitcher.FirstName;
    if (this.props.awayColors) {
      var awayStyle = {
        backgroundColor: this.props.awayColors.colors.primary,
        border: '3px solid ' + this.props.awayColors.colors.secondary
      }
    }
    if (this.props.homeColors) {
      var homeStyle = {
        backgroundColor: this.props.homeColors.colors.primary,
        border: '3px solid ' + this.props.homeColors.colors.secondary
      }
    }


    return (
      <div>
        {(this.state.homePitcher) ? <div className='pitcher-container left'>
          <div className='pitcher-card left' onClick={this.showPitcherGames} style={awayStyle}>
            <img src={this.state.awayPitcher.officialImageSrc} className='pitcher-pic' alt='' style={awayStyle}/>
            <div className='pitcher-text'>
              <h2 className='pitcher-name'>{awayFull}</h2>
              <div className='pitcher-stat-main'>
                {(this.state.awayStatsFiltered) ? <table>
                  <tr>
                    <th>W-L</th>
                    <th>IP</th>
                    <th>ERA</th>
                    <th>WHIP</th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>{this.state.awayStatsFiltered.W + '-' + this.state.awayStatsFiltered.L}</td>
                      <td>{this.state.awayStatsFiltered.IP}</td>
                      <td>{this.state.awayStatsFiltered.ERA}</td>
                      <td>{this.state.awayStatsFiltered.WHIP}</td>
                    </tr>
                  </tbody>
                </table> : '' }
              </div>
              <div className='analysis-scores'>
                <h2>Matchup: +40</h2>
                <h2>Streak: +60</h2>
              </div>
            </div>
          </div>
          <h1>vs</h1>
          <div className='pitcher-card right' onClick={this.showPitcherGames} style={homeStyle}>
            <img src={this.state.homePitcher.officialImageSrc} className='pitcher-pic' alt='' style={homeStyle} />
            <div className='pitcher-text'>
              <h2 className='pitcher-name'>{homeFull}</h2>
              <div className='pitcher-stat-main'>
                {(this.state.homeStatsFiltered) ? <table>
                  <tr>
                    <th>W-L</th>
                    <th>IP</th>
                    <th>ERA</th>
                    <th>WHIP</th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>{this.state.homeStatsFiltered.W + '-' + this.state.homeStatsFiltered.L}</td>
                      <td>{this.state.homeStatsFiltered.IP}</td>
                      <td>{this.state.homeStatsFiltered.ERA}</td>
                      <td>{this.state.homeStatsFiltered.WHIP}</td>
                    </tr>
                  </tbody>
                </table> : ''}
              </div>
              <div className='analysis-scores'>
                <h2>Matchup: +40</h2>
                <h2>Streak: +60</h2>
              </div>
            </div>
          </div>
        </div> : ''}

        {(this.state.showHomePitcher) ? <PitcherLog /> : ''}
      </div>
    );
  }
}

export default Pitchers;

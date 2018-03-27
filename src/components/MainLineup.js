import React, { Component } from 'react';
import player_list from '../assets/playerList0320.json';

class MainLineup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchDelay: 2000,
      batterData: {

      },
      matchupData: {
        
      }

    }
  }

  componentDidMount(){
    // var players = player_list;
    // let homeLineup = this.props.homeLineup;
    // let home = homeLineup.actual.starter.filter(position=>{
    //   if (position.position[0] == 'B') return position;
    // })
    // home.sort((a,b)=>{
    //   if (a.position[2] > b.position[2]) return 1;
    //   if (a.position[2] < b.position[2]) return -1;
    // })
    // this.setState({homeLineup: home})
    // let awayLineup = this.props.awayLineup;
    // let away = awayLineup.actual.starter.filter(position=>{
    //   if (position.position[0] == 'B') return position;
    // })
    // away.sort((a,b) => {
    //   if (a.position[2] > b.position[2]) return 1;
    //   if (a.position[2] < b.position[2]) return -1;
    // })
    // away.map(player=>{
    //   var id = player.player.ID;
    //   var info = players.filter(player=>{
    //     if (player.player.ID === id) return player
    //   })
    //   player.info = info[0].player;
    //   return player;
    // })
    // this.setState({awayColors: this.props.awayColors})
    
    // this.setState({awayLineup: away}, () => {
    //   away.map((player, i)=>{
    //     // this.getJSON(player, i)
    //   })
    // })
  }
  fetchBatter = (batter) => {
    let id = batter.info.bref_id;
    var batterStats = async () => {
      const response = await fetch('http://localhost:4000/scrapebatter/?batter=' + id)
      const json = await response.json()
      if (json.length > 0) {
        return json
        }
      }
    batterStats().then(resp=>{
      let batterData = this.state.batterData;
      if (resp.length > 0) batterData[batter.player.LastName] = resp[0];
      this.setState({ batterData: batterData }, () => {
        this.filterBatterData();
      })
    })
  }
  delay = (msec) => {
    return new Promise(resolve => {
      setTimeout(resolve, msec);
    })
  }
  getJSON(player, index) {
    return Promise.resolve()
      .then(() => {
        return this.delay(index * (this.state.fetchDelay));
      })
      .then(() => {
        return this.fetchBatter(player)
      })
      .then(() => {
        return this.fetchMatchup(player)
      })
  }
  filterBatterData = () => {
    let year = this.props.selectedYear;
    let lineup = this.state.awayLineup
    lineup.map((player, i) => {
      var batter = player.player.LastName;
      if (this.state.batterData[batter]) {
        let data = this.state.batterData[batter];
        let a = data.filter(row => {
          if (row.Year == year && (row.Lg === 'NL' || row.Lg === 'AL')) return row;
        })
        player.stats = a[0]
      }
    })
    this.setState({filteredLineup: lineup})
  }
  fetchMatchup = (batter, ) => {
    var batterId = batter.info.bref_id;
    var pitcherId = this.props.homePitcher.bref_id;
    var matchupStats = async () => {
      const response = await fetch('http://localhost:4000/scrape/?batter=' + batterId + '&pitcher=' + pitcherId)
      const json = await response.json()
      if (json.length > 0) {
        return json
      }
    }
    matchupStats().then(resp=>{
      let matchupData = this.state.matchupData;
      if (resp.length > 0) matchupData[batter.player.LastName] = resp[0];
      this.setState({ matchupData: matchupData }, ()=>{
        this.filterMatchupData();
      })
    })
  }
  filterMatchupData = () => {
    let lineup = this.state.awayLineup
    lineup.map((player, i) => {
      var batter = player.player.LastName;
      if (this.state.matchupData[batter]) {
        let data = this.state.matchupData[batter];
        let a = data.filter(row => {
          if(row.Year == "RegSeason") return row
        })
        player.matchup = a[0];
      }
    })
    this.setState({ filteredLineup: lineup })
  }
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



  render() {
    if (this.props.awayColors) { var awayStyle = {
      border: '6px solid ' + this.props.awayColors.colors.secondary,
      borderLeft: 'none',
      backgroundColor: this.props.awayColors.colors.primary,
    } } 
    return (
      <div>
        {(true) ? this.props.gameObj.awayTeam.lineup.map((player, i)=>{
          return (
          <div className='home-player' >
          <div className='pos-bo'>
            <h1>{player.batOrder})</h1>
            <h1>{player.position}</h1>
          </div>
              <img src={player.info.Image} className='lineup-pic' />
            <div className='lineup-text'>
              <div>
                <div className='lineup-header'>
                  <h2>{player.info.LastName}, {player.info.FirstName}</h2>
                </div>
                <div className='player-scores'>
                    <h3>Matchup: {this.getMatchupScore(player.matchup)}</h3>
                </div>
              </div>
                <table>
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
                    <td>{player.stats.stats.BA}</td>
                    <td>{player.stats.stats.RBI}</td>
                    <td>{player.stats.stats.HR}</td>
                    <td>{((player.stats.stats.BB / player.stats.stats.PA) * 100).toFixed(1)}%</td>
                    <td>{((player.stats.stats.SO / player.stats.stats.PA) * 100).toFixed(1)}%</td>
                    <td>{player.stats.stats.OPS}</td>
                  </tr>
                  <tr>
                    <td>vs {this.props.gameObj.homeTeam.pitcher.LastName}</td>
                    <td>{player.matchup.AB}</td>
                    <td>{player.matchup.BA}</td>
                    <td>{player.matchup.RBI}</td>
                    <td>{player.matchup.HR}</td>
                    <td>{((player.matchup.BB / player.matchup.PA) * 100).toFixed(1)}%</td>
                    <td>{((player.matchup.SO / player.matchup.PA) * 100).toFixed(1)}%</td>
                    <td>{player.matchup.OPS}</td>
                  </tr>
                </table>
            </div>
          </div>)
        }) : ''}

      </div>
    );
  }
}

export default MainLineup;

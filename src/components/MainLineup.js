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
    var players = player_list;
    let homeLineup = this.props.homeLineup;
    let home = homeLineup.actual.starter.filter(position=>{
      if (position.position[0] == 'B') return position;
    })
    home.sort((a,b)=>{
      if (a.position[2] > b.position[2]) return 1;
      if (a.position[2] < b.position[2]) return -1;
    })
    this.setState({homeLineup: home})
    let awayLineup = this.props.awayLineup;
    let away = awayLineup.actual.starter.filter(position=>{
      if (position.position[0] == 'B') return position;
    })
    away.sort((a,b) => {
      if (a.position[2] > b.position[2]) return 1;
      if (a.position[2] < b.position[2]) return -1;
    })
    away.map(player=>{
      var id = player.player.ID;
      var info = players.filter(player=>{
        if (player.player.ID === id) return player
      })
      player.info = info[0].player;
      return player;
    })
    this.setState({awayColors: this.props.awayColors})
    
    this.setState({awayLineup: away}, () => {
      away.map((player, i)=>{
        this.getJSON(player, i)
      })
    })
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



  render() {
    if (this.props.awayColors) { var awayStyle = {
      border: '6px solid ' + this.props.awayColors.colors.secondary,
      borderLeft: 'none',
      backgroundColor: this.props.awayColors.colors.primary,
    } } 
    return (
      <div>
        {(this.state.awayLineup) ? this.state.awayLineup.map((player, i)=>{
          return (
          <div className='home-player' style={awayStyle}>
          <div className='pos-bo'>
            <h1>{i + 1})</h1>
            <h1>{player.player.Position}</h1>
          </div>
              <img src={player.info.officialImageSrc} className='lineup-pic' style={{
                border: '3px solid ' + this.props.awayColors.colors.secondary,}}/>
            <div className='lineup-text'>
              <div>
                <div className='lineup-header'>
                  <h2>{player.player.FirstName + ' ' + player.player.LastName}</h2>
                </div>
                <div className='player-scores'>
                    {(player.stats) ? <div><h3>Matchup: {this.state.homeOPS - player.stats.OPS}</h3>
                      <h3>Hotness +46</h3></div> : null}
                </div>
              </div>
                {(player.stats) ? <table>
                  <tr>
                    <th></th>
                    <th>PA</th>
                    <th>AVG</th>
                    <th>RBI</th>
                    <th>HR</th>
                    <th>BB%</th>
                    <th>SO%</th>
                    <th>OPS</th>
                  </tr>
                  <tr>
                    <td>2017</td>
                    <td>{player.stats.PA}</td>
                    <td>{player.stats.BA}</td>
                    <td>{player.stats.RBI}</td>
                    <td>{player.stats.HR}</td>
                    <td>{((player.stats.BB / player.stats.PA) * 100).toFixed(1)}%</td>
                    <td>{((player.stats.SO / player.stats.PA) * 100).toFixed(1)}%</td>
                    <td>{player.stats.OPS}</td>
                  </tr>
                  <tr>
                    <td>vs Pitcher</td>
                    <td>{(player.matchup) ? player.matchup.PA : 'N/A'}</td>
                    <td>{(player.matchup) ? player.matchup.BA : 'N/A'}</td>
                    <td>{(player.matchup) ? player.matchup.RBI : 'N/A'}</td>
                    <td>{(player.matchup) ? player.matchup.HR : 'N/A'}</td>
                    <td>{(player.matchup) ? ((player.matchup.BB / player.matchup.PA) * 100).toFixed(1) : 'N/A'}%</td>
                    <td>{(player.matchup) ? ((player.matchup.SO / player.matchup.PA) * 100).toFixed(1) : 'N/A'}%</td>
                    <td>{(player.matchup) ? player.matchup.OPS : 'N/A'}</td>
                  </tr>
                </table> : ''}
            </div>
          </div>)
        }) : ''}

      </div>
    );
  }
}

export default MainLineup;

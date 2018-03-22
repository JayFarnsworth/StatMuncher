import React, { Component } from 'react';

class Games extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: 20170404,
      year: 2017,
      games: [],
      selectedGame: undefined
    }
  }
  componentDidMount = () => {
    let url = 'https://api.mysportsfeeds.com/v1.2/pull/mlb/2017-regular/daily_game_schedule.json?fordate=20170905';
    let headers = {
      'Authorization': 'Basic a3Vicmlja2FuOkgzbHRvbjE3MTcu',
      'content-type': 'application/json'
    }
    var games = async () => {
      const response = await fetch(url, {
        credentials: 'same-origin',
        headers: headers,
        method: 'GET',
        mode: 'cors'
      });
      const json = await response.json();
      let gameList = json.dailygameschedule.gameentry;
      this.setState({ games: gameList });
    } 
    games();
  }
  fetchDailyStarters = (event) => {
    var gameId = event.currentTarget.id;
    this.setState({selectedGame: gameId});
    let url = 'https://api.mysportsfeeds.com/v1.2/pull/mlb/2017-regular/game_startinglineup.json?gameid=' + gameId;
    let headers = {
      'Authorization': 'Basic a3Vicmlja2FuOkgzbHRvbjE3MTcu',
      'content-type': 'application/json'
    };
    var lineup = async () => {
      const response = await fetch(url, {
        credentials: 'same-origin',
        headers: headers,
        method: 'GET',
        mode: 'cors'
      });
      const json = await response.json();
      let gameData = json.gamestartinglineup;
      this.setState({ gameData: gameData });
      this.sendGameData(gameData)
    }
    lineup();
    
  }
  sendGameData = (data) => {
    this.props.setGameData(data)
  }

  
  

  render() {
    return (
      <div id='games-bar'>
        {this.state.games.map(game=>{
          return <div key={game.id} id={game.id}className={(this.state.selectedGame === game.id) ? 'game-container selected-game' : 'game-container'} onClick={this.fetchDailyStarters}>
            <h2>{game.time}</h2>
            <h1>{game.awayTeam.Abbreviation}</h1>
            <h1>{game.homeTeam.Abbreviation}</h1>
          </div>
        })}
      </div>
    );
  }
}

export default Games;

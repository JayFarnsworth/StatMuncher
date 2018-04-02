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
    let url = 'https://statmuncher-server.herokuapp.com/gamesfetch/?date=20170920';
    // var games = async () => {
    //   const response = await fetch(url, {
    //     credentials: 'same-origin',
    //     method: 'GET',
    //     mode: 'cors'
    //   });
    //   const json = await response.json();
    //   this.setState({ games: json });
    // } 
    // games();
    fetch(url, {
      credentials: 'same-origin',
      method: 'GET',
      mode: 'cors'
    }).then(resp=>resp.json())
    .then(resp=>{
      this.setState({ games: resp });
    })
  }
  fetchDailyStarters = (event) => {
    var gameId = event.currentTarget.id;
    this.sendGameData(gameId)
    this.setState({selectedGame: gameId})
  }
    
  
  
  sendGameData = (id) => {
    this.props.setGameData(id)
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

import React, { Component } from 'react';
import Header from './components/Header';
import Pitchers from './components/Pitchers';
import Teams from './components/Teams';
import Player from './components/Player';
import Games from './components/Games';
import colors from './assets/teamColors.json';
import MainLineup from './components/MainLineup';
import parks from './assets/parks.json';
import Footer from './components/Footer';
import Options from './components/Options';
import player_list from './assets/playerObject.json';
import gameObj from './assets/gameObjFull20170920a.json';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedYear: '2017'
    }
  }
  componentDidMount(){
    this.setState({ colors: colors.mlbColors })
    this.setState({gameObj: gameObj}, ()=>{
      this.getFullGameObject()
    })
    this.setState({parks: parks})
    this.getDate();
  }
  getFullGameObject = () => {
        var resp = this.state.gameObj;
        for (let game of resp) {
          let id = game.id;
          this.setState({
            [id]: game
          }, ()=>{
            var colors = this.state.colors;
            var selectedGame = this.state[id];
            let home = selectedGame.homeTeam;
            let away = selectedGame.awayTeam;
            let homeColors = colors.filter(color => {
              if (color.name === home.Name) {
                return color
              }
            });
            let awayColors = colors.filter(color => {
              if (color.name === away.Name) {
                return color
              }
            })
            this.setState({
              homeColors: homeColors[0],
              awayColors: awayColors[0]})
          })
        }
  }
  getDate = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    var todaysDate = yyyy + '-' + mm + '-' + dd;
    this.setState({todaysDate: todaysDate})
  }
  setGameData = (id) => {
    var selectedGame = this.state[id];
    this.setState({
      selectedGame: selectedGame
    })
    let park = selectedGame.location;
    let home = selectedGame.homeTeam;
    let away = selectedGame.awayTeam;
    let time = selectedGame.time;
    let colors = this.state.colors;
    let homeColors = colors.filter(color=>{
      if (color.name === home.Name){
        return color
      }});
    let awayColors = colors.filter(color=>{
      if (color.name === away.Name){
        return color
      }
    })
    this.setState({
      park: park,
      homeTeam: home,
      awayTeam: away,
      homeBorder: selectedGame.homeTeam.pitcher.Team.Border,
      awayBorder: selectedGame.awayTeam.pitcher.Team.Border,
      homeColors: this.getTeamColors(home),
      awayColors: this.getTeamColors(away),
    }, () => {
      this.getPark();
    })
  }


  getTeamColors = (team) => {
    var name = team.name;
    let colors = this.state.colors;
    let color = colors.filter(color => {
      return name === color.name
    })
    return color[0]
  }
  getPark = (team) => {
    let parks = this.state.parks;
    let homeTeam = this.state.homeTeam.name;
    let park = parks[homeTeam];
    var randomBackground = park[Math.floor(Math.random() * park.length)];
    console.log(randomBackground)
    this.setState({backgroundStyle: {
      backgroundImage: "url(" + randomBackground + ")",
      backgroundPosition: 'center bottom',
      backgroundSize: '100%'
    }})
  }
  getYear = (year) => {
    this.setState({selectedYear: year});
  }
  // getPitcherData = (home, away) => {
  //   this.setState({
  //     homePitcher: home,
  //     awayPitcher: away
  //   })
  // }


  render() {
    return (
      <div className="App">
        <Header />
        <div className='preload-container'>
        <div className={(this.state.selectedGame) ? 'matchup-container ' : 'matchup-container preload'} style={this.state.backgroundStyle}>
        <Games
          setGameData={this.setGameData}
        />
        {(this.state.selectedGame) ? 
          <div className='lineup-wrapper'>
            <Teams
              gameObj={this.state.selectedGame}
              homeColors={this.state.homeColors}
              awayColors={this.state.awayColors}
            />
            <Pitchers
              gameObj={this.state.selectedGame}
            />

            <Options
              getYear={this.getYear}
            />
            <MainLineup
              homeColors={this.state.homeColors}
              awayColors={this.state.awayColors}
              selectedYear={this.state.selectedYear}
              gameObj={this.state.selectedGame}
            />
          </div>

        : <div className='empty-space'></div>}
        <Footer />
        </div>
        </div>
      </div>
    );
  }
}

export default App;

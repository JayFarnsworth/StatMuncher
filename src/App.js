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

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedYear: '2017'
    }
  }
  componentDidMount(){
    this.setState({colors: colors.mlbColors})
    this.setState({parks: parks})
  }
  setGameData = (data) => {
    this.setState({gameData: data})
    let park = data.game.location;
    let home = data.game.homeTeam;
    let away = data.game.awayTeam;
    let homeLineup = data.teamLineup[1];
    let awayLineup = data.teamLineup[0];
    let time = data.game.time;
    for (let player of homeLineup.expected.starter) {
      if (player.position === "P") {
        var homePitcher = player.player;
      }
    }
    for (let player of awayLineup.expected.starter) {
      if (player.position === "P") {
        var awayPitcher = player.player;
      }
    }
    this.setState({
      park: park,
      homeTeam: home,
      awayTeam: away,
      homeLineup: homeLineup,
      awayLineup: awayLineup,
      time: time,
      homePitcher: homePitcher,
      awayPitcher: awayPitcher,
      colors: colors.mlbColors
    }, () => {
      let homeColors = this.getTeamColors(home);
      let awayColors = this.getTeamColors(away);
      this.setState({
        awayColors: awayColors[0],
        homeColors: homeColors[0],
      })
      this.getPark(away)
    })

  }
  getTeamColors = (team) => {
    var name = team.Name;
    let colors = this.state.colors;
    let color = colors.filter(color => {
      return name === color.name
    })
    return color
  }
  getPark = (team) => {
    let parks = this.state.parks;
    let homeTeam = this.state.homeTeam.Name;
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
  getPitcherData = (home, away) => {
    this.setState({
      homePitcher: home,
      awayPitcher: away
    })
  }


  render() {
    return (
      <div className="App">
        <Header />
        <div className='preload-container'>
        <div className={(this.state.homePitcher) ? 'matchup-container ' : 'matchup-container preload'} style={this.state.backgroundStyle}>
        <Games
          setGameData={this.setGameData}
        />
        {(this.state.homePitcher) ? 
          <div>
                <Teams
                  homeTeam={this.state.homeTeam}
                  awayTeam={this.state.awayTeam}
                  homeColors={this.state.homeColors}
                  awayColors={this.state.awayColors}
                />
          <Pitchers
            homePitcher={this.state.homePitcher}
            awayPitcher={this.state.awayPitcher}
            homeColors={this.state.homeColors}
            awayColors={this.state.awayColors}
            getPitcherData={this.getPitcherData}
          />

          <Options
          getYear={this.getYear}
          />
          <MainLineup
            selectedYear={this.state.selectedYear}
            homeLineup={this.state.homeLineup}
            awayLineup={this.state.awayLineup}
            homeColors={this.state.homeColors}
            awayColors={this.state.awayColors}
            awayPitcherId={this.state.awayPitcherId}
            homePitcher={this.state.homePitcher}
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

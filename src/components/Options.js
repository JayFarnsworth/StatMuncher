import React, { Component } from 'react';

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: '2017'
    }
  }
  setYear = (event) => {
    var year = event.currentTarget.id;
    this.setState({selectedYear: year}, () => {
      this.sendYear(year)
    });
  }
  sendYear = (year) => {
    this.props.getYear(year)
  }





  render() {
    return (
      <div id='options-bar'>
        <div className='options'><h3>Year:</h3></div>
        <div id='2017' className={(this.state.selectedYear === '2017') ? 'options select selected' : 'options select'} onClick={this.setYear}><h3>2017</h3></div>
        <div id='2018' className={(this.state.selectedYear === '2018') ? 'options select selected' : 'options select'} onClick={this.setYear}><h3>2018</h3></div>
        <div id='all' className={(this.state.selectedYear === 'all') ? 'options select op-end selected' : 'options select op-end'} onClick={this.setYear}><h3>All</h3></div>
      </div>
    );
  }
}

export default Options;
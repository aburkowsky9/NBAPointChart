import React from 'react';
import Chart from 'chart.js';
import TeamSelection from './TeamSelection.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NBAStats: null,
      allTeams: [],
      errorFetching: false,
      graphType: 'line',
      teamsSelected: [],
      filteredStats: [],
    };

    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.fetchNBAData = this.fetchNBAData.bind(this);
  }

  getDateRange() {
    const dates = new Set();
    this.state.filteredStats.forEach((team) => {
      let lastAdded = team.data[0].Date;
      dates.add(lastAdded);
      for (let i = 1; i < team.data.length; i += 1) {
        if (team.data[i].Date !== lastAdded) {
          lastAdded = team.data[i].Date;
          dates.add(lastAdded);
        }
      }
    });
    return [...dates.values()].sort();
  }

  getPointsScored(team) {
    return this.state.filteredStats[0].data.map(row => (row['Visitor/Neutral'] === team ? row.PTSVisitor : row.PTSHome));
  }

  renderChart() {
    console.log('filteredStats: ', this.state.filteredStats);
    const { node } = this;
    let dates = null;
    const datasets = [];
    if (this.state.filteredStats.length > 0) {
      dates = this.getDateRange();
      this.state.filteredStats.forEach((team) => {
        datasets.push({
          label: team.teamName,
          data: this.getPointsScored(team.teamName),
          fill: false,
        });
      });
    }
    console.log(datasets);
    if (window.chart) {
      window.chart.destroy();
    }
    window.chart = new Chart(node, {
      type: this.state.graphType,
      data: {
        labels: dates,
        datasets,
      },
    });
  }

  filterData(lastTeamSelected) {
    const filteredData = this.state.NBAStats.filter(row => row['Visitor/Neutral'] === lastTeamSelected
      || row['Home/Neutral'] === lastTeamSelected);
    return {
      teamName: lastTeamSelected,
      data: filteredData,
    };
  }

  handleTeamChange({ target: { value } }) { // value = team name
    if (!this.state.teamsSelected.includes(value)) {
      this.setState({
        teamsSelected: [...this.state.teamsSelected, value],
        filteredStats: [...this.state.filteredStats, this.filterData(value)],
      }, () => {
        this.renderChart();
      });
    }
  }

  async fetchNBAData() {
    try {
      const response = await fetch('/pointsData');
      if (response.ok) {
        const data = await response.json();
        this.setState({
          NBAStats: data.NBAStats,
          allTeams: data.teamsAvailable,
        }, () => {
          this.renderChart();
        });
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      console.log(err);
      this.setState({ errorFetching: true });
    }
  }

  componentDidMount() {
    this.renderChart();
    this.fetchNBAData();
  }

  render() {
    return (
      <div className="chartContainer">
        <h1>Points Scored in NBA By Team</h1>
        <div className="chart">
        {this.state.errorFetching
          ? <p> Sorry! There was an error processing your request. Please try again. </p>
          : <canvas ref={(node) => { this.node = node; }} />
        }
        </div>
        <TeamSelection
          handleTeamChange={ this.handleTeamChange }
          allTeams = { this.state.allTeams }
        />
      </div>
    );
  }
}

export default App;

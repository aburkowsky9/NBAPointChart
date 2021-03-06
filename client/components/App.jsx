import React from 'react';
import Chart from 'chart.js';
import TeamSelection from './TeamSelection.jsx';
import GameLocationFilter from './GameLocationFilter.jsx';
import DataInputArea from './DataInputArea.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NBAStats: null, // data in format from fetch request
      allTeams: [], // all Teams available
      errorFetching: false,
      graphType: 'line',
      teamsSelected: [], // names of teams selected for plotting
      filteredStats: [], // filtered by teams selected
      locationFilter: 'Both',
      textAreaInput: '',
    };

    this.handleTextAreaInputChange = this.handleTextAreaInputChange.bind(this);
    this.handleTextAreaSubmit = this.handleTextAreaSubmit.bind(this);
    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.fetchNBAData = this.fetchNBAData.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getPointsScored(gamesData, teamName) {
    // get x(date) and y(points) value for all games played by team
    if (this.state.locationFilter === 'Both') {
      return gamesData.map(game => ({
        x: new Date(game.Date),
        y: game['Visitor/Neutral'] === teamName ? game.PTSVisitor : game.PTSHome,
      }));
    }

    if (this.state.locationFilter === 'Home') {
      return gamesData.reduce((acc, game) => {
        if (game['Home/Neutral'] === teamName) {
          acc.push({
            x: new Date(game.Date),
            y: game.PTSHome,
          });
        }
        return acc;
      }, []);
    }
    // if locationFilter === 'Away'
    return gamesData.reduce((acc, game) => {
      if (game['Visitor/Neutral'] === teamName) {
        acc.push({
          x: new Date(game.Date),
          y: game.PTSVisitor,
        });
      }
      return acc;
    }, []);
  }

  renderChart(pointsData = this.state.filteredStats) {
    const { node } = this;
    const datasets = [];
    if (pointsData.length > 0) {
      pointsData.forEach((team) => {
        // eslint-disable-next-line no-bitwise
        const borderColor = `#${((1 << 24) * Math.random() | 0).toString(16)}`;
        datasets.push({
          label: team.teamName,
          data: this.getPointsScored(team.data, team.teamName),
          fill: false,
          borderColor,
        });
      });
    }

    if (window.chart) {
      window.chart.destroy();
    }
    window.chart = new Chart(node, {
      type: this.state.graphType,
      data: {
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
          }],
        },
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

  parseDataInput() {
    const labels = ['Date', 'Start(ET)', 'Visitor/Neutral', 'PTSVisitor', 'Home/Neutral', 'PTSHome', 'DataType', 'OT?', 'Attend.', 'Notes'];
    const dataArray = this.state.textAreaInput.split('\n')
      .map(row => row.split(','));
    const teams = new Set();
    const NBAStats = dataArray.reduce((acc, row) => {
      const map = {};
      row.forEach((val, i) => {
        const key = labels[i];
        if (key === 'Visitor/Neutral' || key === 'Home/Neutral') {
          teams.add(val);
        }
        map[key] = val;
      });
      acc.push(map);
      return acc;
    }, []);

    return {
      NBAStats,
      teamsAvailable: [...teams.values()].sort(),
    };
  }

  handleTextAreaSubmit(e) {
    e.preventDefault();
    const formattedData = this.parseDataInput();
    this.setState({
      NBAStats: formattedData.NBAStats,
      allTeams: formattedData.teamsAvailable,
      // reset chart values
      teamsSelected: [],
      filteredStats: [],
      textAreaInput: '',
    }, () => {
      this.renderChart(); // reset chart
    });
  }

  handleTextAreaInputChange({ target: { value } }) {
    this.setState({
      textAreaInput: value,
    });
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

  handleLocationChange({ target: { value } }) {
    if (value !== this.state.locationFilter) {
      this.setState({
        locationFilter: value,
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
        <GameLocationFilter handleLocationChange={ this.handleLocationChange }/>
        <DataInputArea
          handleTextAreaInputChange={ this.handleTextAreaInputChange }
          handleTextAreaSubmit={ this.handleTextAreaSubmit }
          textAreaInput={ this.state.textAreaInput }
          />
      </div>
    );
  }
}

export default App;

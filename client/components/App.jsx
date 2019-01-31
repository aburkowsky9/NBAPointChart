import React from 'react';
import Chart from 'chart.js';
import TeamSelection from './TeamSelection.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NBAPointData: {},
      errorFetching: false,
      graphType: 'line',
      teamsSelected: [],
    };

    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.fetchNBAData = this.fetchNBAData.bind(this);
  }

  renderChart() {
    const { node } = this;
    const dates = null;
    const values = null;
    if (window.chart) {
      window.chart.destroy();
    }
    window.chart = new Chart(node, {
      type: this.state.graphType,
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Placeholder for team names',
            data: values,
          },
        ],
      },
    });
  }

  handleTeamChange({ target: { value } }) {
    if (!this.state.teamsSelected.includes(value)) {
      this.setState({ teamsSelected: [...this.state.teamsSelected, value] }, () => {
        this.renderChart();
      });
    }
  }

  async fetchNBAData() {
    try {
      const response = await fetch('/');
      if (response.ok) {
        const NBAPointData = await response.json();
        this.setState({
          NBAPointData,
          errorFetching: false,
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
  }

  render() {
    console.log(this.state.teamsSelected);
    return (
      <div className="chartContainer">
        <h1>Points Scored in NBA By Team</h1>
        <div className="chart">
        {this.state.errorFetching
          ? <p> Sorry! There was an error processing your request. Please try again. </p>
          : <canvas ref={(node) => { this.node = node; }} />
        }
        </div>
        <TeamSelection handleTeamChange={ this.handleTeamChange }/>
      </div>
    );
  }
}

export default App;

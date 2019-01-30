import React from 'react';
// import Chart from 'chart.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: 'hello, world!',
    };
  }

  render() {
    return (
      <h1>{ this.state.initial }</h1>
    );
  }
}

export default App;

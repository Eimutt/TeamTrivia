import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Welcome from './Welcome/Welcome';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Team Trivia',
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="header">{this.state.title}</div>

          {/* We rended diffrent component based on the path */}
          <Route exact path="/" component={Welcome}/>

        </header>
      </div>
    );
  }
}

export default App;

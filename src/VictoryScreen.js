import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class VictoryScreen extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    this.state = {
      sortedTeamList: [],

    }
    console.log(this);
  }

  compare = (a,b) => {
    if (a.teamInfo.score < b.teamInfo.score)
      return 1;
    if (a.teamInfo.score > b.teamInfo.score)
      return -1;
    return 0;
  }

  componentDidMount() {
    this.setState({
      sortedTeamList: this.props.finalScores.sort(this.compare),
    });
  }

  render() {
    return (
      <div>
        {JSON.stringify(this.state.sortedTeamList)}
      </div>
    );
  }
}


export default VictoryScreen;

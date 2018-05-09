import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    this.state = {
      status: 'INITIAL',
      teams: {}
    }
  }

  componentDidMount = () => {
    var pathArray = window.location.hash.split( '/' );
    this.state.lobbyID = pathArray[2];
    const database = firebaseApp.database();
    const teams = database.ref("Lobbies/" + this.state.lobbyID + "/Teams");
    teams.on("value", (snapshot) => {
      var snapshot = snapshot.val();
      this.setState({
        status: 'Ready',
        teams: snapshot
      })
    })
  }

  render() {
    var scores;

    switch (this.state.status) {
      case 'Initial':
          scores = <div></div>
        break;
      default:
        var activeTeams=Object.keys(this.state.teams);

        scores =
        <div className>
        {Object.keys(this.state.teams).map((key) =>
          <div>
            <div>{key + " has score: "}</div>
            <div>{this.state.teams[key].score}</div>
          </div>
        )}
        </div>
    }


    return (
      <div className>
        {scores}
      </div>
    );
  }
}

export default ScoreBoard;

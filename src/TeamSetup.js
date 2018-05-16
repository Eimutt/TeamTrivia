import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Team from "./Team";

class TeamSetup extends Component {
  constructor(props) {
    super(props);
    // we put on state the properties we want to use and modify in the component
    this.state = {
      numTeams: 2,
      categories: [],
      lobbyID: ""
    }
    const database = firebaseApp.database();
    this.database = database.ref("Lobbies/" + this.props.status.lobbyId);
  }

  addTeam = () => {
    this.setState({
      numTeams: this.state.numTeams + 1
    })
    console.log(this.state.numTeams);
  };

  joinTeam = (e) => {
    const database = firebaseApp.database();
    console.log("Lobbies/" + this.props.status.lobbyId);
    const team = database.ref("Lobbies/" + this.props.status.lobbyId);
    const members = team.child("Team" + e);
    var user = firebaseApp.auth().currentUser;
    members.push({
      id: user.uid,
      name: user.displayName,
    });
  }

  render() {
    var teams;
    console.log(this.state.numTeams);
    switch (this.state.numTeams) {
      case 2:
      teams = <div className="TeamSetup">
                <Team teamid="1" status="active"/>
                <Team teamid="2" status="active"/>
                <Team teamid="3" status="inactive"/>
                <Team teamid="4" status="inactive"/>
              </div>
        break;
      case 3:

      teams = <div className="TeamSetup">
                <Team teamid="1" status="active"/>
                <Team teamid="2" status="active"/>
                <Team teamid="3" status="active"/>
                <Team teamid="4" status="inactive"/>
              </div>

        break;
        case 4:
        teams = <div className="TeamSetup">
                  <Team teamid="1" status="active"/>
                  <Team teamid="2" status="active"/>
                  <Team teamid="3" status="active"/>
                  <Team teamid="4" status="active"/>
                </div>
        break;
      default:
        teams = <b>Failed to load data, please try again</b>
        break;
    }

    return (
      <div >
        {teams}
      </div>
    );
  }
}

export default TeamSetup;

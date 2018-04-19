import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class Team extends Component{
  constructor(props) {
    super(props);
    // we put on state the properties we want to use and modify in the component
    this.state = {
      members: [],
      lobbyID: "",
      status: "inactive"
    }
    this.Id = this.props.teamid;
  }

  joinTeam = () => {
    const database = firebaseApp.database();
    const team = database.ref("Lobbies/" + this.state.lobbyID);
    const members = team.child("Team" + this.Id + "/members");
    var user = firebaseApp.auth().currentUser;
    console.log(members.path);
    members.push({
      id: user.uid,
      name: user.displayName,
    });
    console.log(this.state.members);
  }

  addTeam = () => {
    this.setState({
      status: "active"
    })
    const database = firebaseApp.database();
    const team = database.ref("Lobbies/" + this.state.lobbyID + "/Team" + this.Id);
    team.on("value", (snapshot) => {
      if (snapshot.child("members").exists())
        this.setState({
          members : snapshot.val().members,
        })
    })
    console.log(this.state.members);
  }

  componentDidMount = () => {
    var pathArray = window.location.pathname.split( '/' );
    this.state.lobbyID = pathArray[2];
    if (this.props.active == "yes" || this.state.statue == "active") {
      this.state.status = "active";
      console.log(this.state.lobbyID);
      const database = firebaseApp.database();
      const team = database.ref("Lobbies/" + this.state.lobbyID + "/Team" + this.Id);
      team.on("value", (snapshot) => {
        if (snapshot.child("members").exists())
          this.setState({
            members : snapshot.val().members,
          })
      })
    }
    else
      this.state.status = "inactive";
  }

  render() {
    var retDiv;
    switch (this.state.status) {
      case "active":
        console.log(this.state.members);
        retDiv = (
          <li>
            <li>Team is Active!</li>
            {Object.keys(this.state.members).map((key) =>
              <li key={key}>{this.state.members[key].name}</li>
            )}
            <button type="button" class="btn btn-primary btn-sm" onClick={() => this.joinTeam()}>Join Team</button>
          </li>
        );
        break;
      default:
        retDiv = (
          <li>Team is Inactive!
            <button type="button" class="btn btn-primary btn-sm" onClick={() => this.addTeam()}>Add Team</button>
          </li>
        )
    }
    return (
      <ul className="Team">
          {retDiv}
      </ul>
    )
  }
}

export default Team;

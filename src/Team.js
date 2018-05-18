import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class Team extends Component{
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      lobbyID: "",
    }
    this.Id = this.props.teamid;
  }

  joinTeam = () => {
    const database = firebaseApp.database();
    const lobby = database.ref("Lobbies/" + this.state.lobbyID);
    const members = lobby.child("Teams/Team" + this.Id + "/members");
    var user = firebaseApp.auth().currentUser;
    if (user.photoURL != this.Id) {
      const prevTeam = lobby.child("Teams/Team" + user.photoURL + "/members");
      prevTeam.once("value", (snapshot) => {
        if (snapshot.exists()) {
          Object.keys(snapshot.val()).forEach(function(key) {
              if (snapshot.val()[key].id == user.uid){
                prevTeam.child(key).remove();
              }
          });
        }
      })
    }
    user.updateProfile({
      photoURL: this.props.teamid
    }).then(function() {

    }, function(error) {
      console.error('joinTeam() API Error:');
      alert('joinTeam() API Error:');
    });
    members.push({
      id: user.uid,
      name: user.displayName,
    });
  }

  addTeam = () => {
    const database = firebaseApp.database();
    const team = database.ref("Lobbies/" + this.state.lobbyID + "/Teams/Team" + this.Id);
    team.on("value", (snapshot) => {
      if (snapshot.child("members").exists())
        this.setState({
          members : snapshot.val().members,
        })
    })
  }

  componentDidMount = () => {
    var pathArray = window.location.hash.split( '/' );
    this.state.lobbyID = pathArray[2];
    const database = firebaseApp.database();
    const team = database.ref("Lobbies/" + this.state.lobbyID + "/Teams/Team" + this.Id);
    team.on("value", (snapshot) => {
      if (snapshot.child("members").exists())
        this.setState({
          members : snapshot.val().members,
        })
      else
        this.setState({
          members: {},
        })
    })
  }

  render() {
    var joinTeamButton = <div></div>;
    var user = firebaseApp.auth().currentUser;
    var found = false;
    for (var member in this.state.members) {
      if (this.state.members[member].id == user.uid) {
        found = true;
        break;
      }
    }
    if (Object.keys(this.state.members).length < 7 && found === false)
      joinTeamButton = (<button type="button" class="btn btn-primary btn-sm" onClick={() => this.joinTeam()}>Join Team</button>)
    var retDiv;
      retDiv = (
        <ul className="TeamList">
          <li className="TeamName">{"Team " + this.Id} </li>
          {Object.keys(this.state.members).map((key) =>
            <li key={key}>{this.state.members[key].name}</li>
          )}
          {joinTeamButton}
        </ul>
      );
    return (
      <div className="Team">
          {retDiv}
      </div>
    )
  }
}

export default Team;

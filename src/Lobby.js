import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class GameSetup extends Component {

  handleChange = () => {
    const database = firebaseApp.database();
    const team = database.ref("Lobby").child("Team");
    const members = team.child("member")
    members.push({
      id: 1,
      name: "Emil",
      points: 5
    });
    members.push({
      id: 2,
      name: "Isak",
      points: 100
    });
  }


  render() {
    return (
      <div className="Lobby">
        <div class="btnhandler">
          <button id="startbutton" type="button" class="btn btn-primary btn-lg">Create Lobby</button>
        </div>
      </div>
    );
  }
}

export default Lobby;

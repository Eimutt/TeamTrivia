import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import GameSetup from './GameSetup';

class Welcome extends Component {

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
      <GameSetup/>
    );
  }
}

export default Welcome;

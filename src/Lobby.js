import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";

class Lobby extends Component {

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
        <GameOptions/>
        <Teams/>
      </div>
    );
  }
}


class GameOptions extends React.Component {

  render() {
    return (
      <div className="GameOptions">ENus</div>
    );
  }
}

class Teams extends React.Component {

  render() {
    return (
      <div>Benis</div>
    );
  }
}


export default Lobby;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';


class GameState extends Component{
  constructor(props) {
    super(props);
    // we put on state the properties we want to use and modify in the component
    this.state = {
      members: [],
      lobbyID: "",
      //status: this.props.status
    }
    this.Id = this.props.teamid;
  }

  render() {
    return (
      <div className="Team">
          Its a work
      </div>
    )
  }
}

export default GameState;

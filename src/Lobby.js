import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class Lobby extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    this.state = {
      status: 'INITIAL',
      numQ:0,
      categories: []
    }

  }

  componentDidMount = () => {
    var pathArray = window.location.pathname.split( '/' );
    this.lobbyID = pathArray[2];
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    lobbydata.once("value", (snapshot) => {
      this.setState({
        numQ : snapshot.val().numberOfQuestions,
        categories : snapshot.val().categories
      })
      console.log(this.state.categories);
    })
  }



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
        <div>{this.state.lobbyID}</div>
        <div>{this.state.numQ}</div>
        <div>
          {this.state.categories.map((category) =>
            <div>{category.categoryname}</div>
          )}
        </div>
      </div>
    );
  }
}

class TeamSetup{}





export default Lobby;

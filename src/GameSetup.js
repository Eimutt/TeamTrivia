import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebaseApp from "./firebase";
import GridItem from "./GridItem";
import {Col, Container, Row} from 'react-grid-system';
import Categories from './Categories'

class GameSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfQuestions: 10,
      currentcategories: [],
      lobbyID: "",
    }
  }

  onLobbyIDChange = (e) => {
    this.setState({
      lobbyID: e,
    })
  }

  handleChange = () => {
    const database = firebaseApp.database();
    const Lobbies = database.ref("Lobbies");
    var newLobID = Lobbies.push().getKey();
    this.onLobbyIDChange(newLobID);
    var user = firebaseApp.auth().currentUser;
    Lobbies.child(newLobID).set({
      host:({
        hostId: user.uid,
        hostName: user.displayName
      }),
      numberOfQuestions: this.state.numberOfQuestions,
      categories: this.state.currentcategories,
      status: "INITIAL"
    });
    this.props.history.push("/lobby/" + newLobID);
  }

  onNumberOfGuestsChanged = (e) => {
    this.setState({
      numberOfQuestions: e.target.value,
    })
  }

  addCategory = (id, name) => {
    var currcats = this.state.currentcategories;
    var category = {id, name};
    var found = false;
    for (var i = 0; i < currcats.length; i++) {
        if (currcats[i].id == id) {
          currcats.splice(i,1);
          found = true;
          break;
        }
      }
      if (!found)
        currcats.push(category);

    this.setState({
      currentcategories: currcats,
    })
  }

  componentDidMount() {
  }

  isPositiveInteger = (n) => {
    return n >>> 1 === parseFloat(n);
  }

  render() {
    var confirmButton;
    confirmButton = (
      <div class="btnhandler">
        <button id="startbutton" disabled={this.isPositiveInteger(this.state.numberOfQuestions) || this.state.currentcategories.length == 0} type="button" class="btn btn-primary btn-lg" onClick={() => this.handleChange()}>Create Lobby</button>
      </div>
    )

    return (
      <div className="Lobby">
        <div className="GameOptions">
          Game setup
          <div className = "buttonContainer">
            <div>Number of Questions:</div>
            <input id="numberOfQuestions" type="number" min="1" input="number" value={this.state.numberOfQuestions} onChange={this.onNumberOfGuestsChanged}></input>
          </div>
          <Categories callback={this.addCategory}/>
        </div>
        {confirmButton}
      </div>
    );
  }
}

export default withRouter(GameSetup);

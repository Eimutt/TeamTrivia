import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebaseApp from "./firebase";
import GridItem from "./GridItem";
import {Col, Container, Row} from 'react-grid-system';
import Categories from './Categories'

class GameSetup extends React.Component {
  constructor(props) {
    super(props)
    // we put on state the properties we want to use and modify in the component
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
    //console.log(newLobID);
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
    //var currentcategories = this.state.categories;
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
    //console.log("Current categories: " + JSON.stringify(this.state.currentcategories));
  }

  componentDidMount() {
    /*this.fetchCategories().then((json) => {
      console.log(json);
      this.setState({
        categories: json.trivia_categories,
      })
    });*/
  }

  render() {
    console.log("Current categories: " + JSON.stringify(this.state.currentcategories));
    var confirmButton = "";
    //console.log("Number of total categories: " + this.state.categories.length);
    console.log("Number of current categories: " + this.state.currentcategories.length);
    if (this.state.currentcategories.length == 0) {
      confirmButton = (
        <div class="btnhandler">
          <button id="startbutton" disabled type="button" class="btn btn-primary btn-lg" onClick={() => this.handleChange()}>Create Lobby</button>
        </div>
      )
    } else {
      confirmButton = (
        <div class="btnhandler">
          <button id="startbutton"  type="button" class="btn btn-primary btn-lg" onClick={() => this.handleChange()}>Create Lobby</button>
        </div>
      )
    }
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

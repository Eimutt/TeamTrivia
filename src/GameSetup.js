import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import GridItem from "./GridItem";
import Grid from 'react-css-grid';
import {Col, Container, Row} from 'react-grid-system';

class GameSetup extends React.Component {
  constructor(props) {
    super(props)
    // we put on state the properties we want to use and modify in the component
    this.state = {
      numberOfQuestions: 10,
      currentcategories: [],
      lobbyID: ""
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
    var toPrintLink = "";
    if(this.state.lobbyID !== "")
      toPrintLink = (
        <div className="gameLink">
          <div>Here is your game link, give it to your friends and then click on it</div>
          <Link to = {"/lobby/" + this.state.lobbyID}>{window.location + "lobby/" + this.state.lobbyID}</Link>
        </div>
      )
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
          <div className = "buttonConatiner">
            <div>Number of Questions:</div>
            <input id="numberOfQuestions" type="number" min="1" input="number" value={this.state.numberOfQuestions} onChange={this.onNumberOfGuestsChanged}></input>
          </div>
          <Categories callback={this.addCategory}/>
        </div>
        {confirmButton}
        {toPrintLink}
      </div>
    );
  }
}

class Categories extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    //  <GridItem categoryID={9} categoryName={"General Knowledge"} callback1={this.handleClick}/>
    this.state = {
      categories: [],
      status: "loading"
    }
  }

  componentDidMount() {
    this.fetchCategories().then((json) => {
      console.log(json);
      this.setState({
        categories: json.trivia_categories,
        status: "ready"
      })
    });
  }

  fetchCategories = () => {
    const url = 'https://opentdb.com/api_category.php';
    return fetch(url)
      .then(this.processResponse)
      .catch(this.handleError);
  }

  processResponse = function (response) {
    if (response.ok) {
      return response.json()
    }
    throw response;
  }

  handleError = function (error) {
    if (error.json) {
      error.json().then(error => {
        console.error('fetchCategories() API Error:', error.message || error)
      })
    } else {
      console.error('fetchCategories() API Error:', error.message || error)
    }
  }

  handleClick(categoryid, categoryname) {
    this.props.callback(categoryid, categoryname);
  }

  render() {
    var toRender = "";
    switch (this.state.status) {
      case "loading":
        toRender = (<div className="loader"></div>);
        break;

      default:
        var categories = this.state.categories;
        var sequence = 0;
        var rowamount = (categories.length/4);
        var remainder = (categories.length % 4);
        if (remainder != 0)
          rowamount++;
        var rows = [];
        for (var i = 0; i < rowamount; i++) {
          var row = [];
          for (var j = 0; j < 4; j++) {
            row.push(categories[j+sequence*4]);
          }
          sequence++;
          rows.push(row);
        }
        toRender = (
          <div className = "CategoryContainer">
            <div className= "categoryTitle">{"Categories"}</div>
            <Container>
              {rows.map((row) =>
                <Row>
                  {row.map((category) =>
                    <Col sm={3} className="griditem">
                      <div className="categoryname">{category.name.replace("Entertainment: ", "").replace("Science: ", "")}</div>
                      <label class="switch">
                        <input type="checkbox" onClick={() => this.handleClick(category.id, category.name)}></input>
                        <span class="slider round"></span>
                      </label>
                    </Col>
                  )}
                </Row>
              )}
            </Container>
          </div>
        );
        console.log(rows);
        break;
    }
    return (
      <div>{toRender}</div>
    );
  }
}

export default GameSetup;

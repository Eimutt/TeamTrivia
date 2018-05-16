import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import GridItem from "./GridItem";
import Grid from 'react-css-grid';

class GameSetup extends React.Component {
  constructor(props) {
    super(props)
    // we put on state the properties we want to use and modify in the component
    this.state = {
      numberOfQuestions: 10,
      categories: [],
      currentcategories: [],
      //categories: [{"categoryid":15,"categoryname":"Video Games"},{"categoryid":10,"categoryname":"Books"},{"categoryid":31,"categoryname":"Anime and Manga"},{"categoryid":17,"categoryname":"Science and Nature"},{"categoryid":12,"categoryname":"Music"},{"categoryid":11,"categoryname":"Film"},{"categoryid":9,"categoryname":"General Knowledge"},{"categoryid":14,"categoryname":"Television"},{"categoryid":22,"categoryname":"Geography"},{"categoryid":20,"categoryname":"Mythology"},{"categoryid":19,"categoryname":"Mathematics"},{"categoryid":18,"categoryname":"Computers"},{"categoryid":23,"categoryname":"History"},{"categoryid":24,"categoryname":"Politics"},{"categoryid":27,"categoryname":"Animals"},{"categoryid":26,"categoryname":"Celebrities"}],
      lobbyID: ""
    }
  }

  onLobbyIDChange = (e) => {
    this.setState({
      lobbyID: e,
    })
  }

  //TODO: USE THIS FOR DYNAMIC CATEGORYFETCHING
  //ALSO TODO: FIX DYNAMIC CATEGORYSELECTION IN categories.render
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
      categories: this.state.categories,
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
    this.fetchCategories().then((json) => {
      console.log(json);
      this.setState({
        categories: json.trivia_categories,
      })
    });
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
    console.log("Number of total categories: " + this.state.categories.length);
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
          <Categories categories={this.state.categories} callback={this.addCategory}/>
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
  }

  handleClick(categoryid, categoryname) {
    this.props.callback(categoryid, categoryname);
  }

  render() {
    var categories = this.props.categories;
    var columnsize = (categories.length/4);
    var remainder = (categories.length % 4);
    var columns = [];
    for (var i = 0; i < 4; i++) {
      currentcolumnsize = columnsize;
      var column = [];
      if (remainder != 0) {
        var currentcolumnsize = columnsize + 1;
        remainder--;
      }
      for (var j = 0; j < currentcolumnsize; j++) {
        column.push(categories[j]);
      }
      categories.splice(0,currentcolumnsize);
      columns.push(column);
    }
    console.log(columns);
    return (
      <div className = "CategoryContainer">
        <div className= "categoryTitle">{"Categories"}</div>
        <Grid
          width={0}
          gap={0}>
          {columns.map((column) =>
            <div id="column">
              {column.map((category) =>
                <div className= "griditem">
                  <div className="categoryname">{category.name.replace("Entertainment: ", "").replace("Science: ", "")}</div>
                  <label class="switch">
                    <input type="checkbox" onClick={() => this.handleClick(category.id, category.name)}></input>
                    <span class="slider round"></span>
                  </label>
                </div>
              )}
            </div>
          )}
        </Grid>
      </div>
    );
  }
}

export default GameSetup;

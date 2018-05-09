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
      categories: [{"categoryid":15,"categoryname":"Video Games"},{"categoryid":10,"categoryname":"Books"},{"categoryid":31,"categoryname":"Anime and Manga"},{"categoryid":17,"categoryname":"Science and Nature"},{"categoryid":12,"categoryname":"Music"},{"categoryid":11,"categoryname":"Film"},{"categoryid":9,"categoryname":"General Knowledge"},{"categoryid":14,"categoryname":"Television"},{"categoryid":22,"categoryname":"Geography"},{"categoryid":20,"categoryname":"Mythology"},{"categoryid":19,"categoryname":"Mathematics"},{"categoryid":18,"categoryname":"Computers"},{"categoryid":23,"categoryname":"History"},{"categoryid":24,"categoryname":"Politics"},{"categoryid":27,"categoryname":"Animals"},{"categoryid":26,"categoryname":"Celebrities"}],
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

  addCategory = (categoryid, categoryname) => {
    var currentcategories = this.state.categories;
    var category = {categoryid, categoryname};
    var found = false;
    for (var i = 0; i < currentcategories.length; i++) {
        if (currentcategories[i].categoryid == categoryid) {
          currentcategories.splice(i,1);
          found = true;
          break;
        }
      }
      if (!found)
        currentcategories.push(category);

    this.setState({
      categories: currentcategories,
    })
    console.log(JSON.stringify(this.state.categories));
  }

  componentDidMount() {

  }

  render() {
    var toPrintLink = "";
    if(this.state.lobbyID !== "")
      toPrintLink = (
        <div className="gameLink">
          <div>Here is your game link, give it to your friends and then click on it</div>
          <Link to = {"/lobby/" + this.state.lobbyID}>{window.location + "lobby/" + this.state.lobbyID}</Link>
        </div>
      )
    var confirmButton = "";
    console.log("Number of categories: " + this.state.categories.length);
    if (this.state.categories.length == 0) {
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
  }

  handleClick(categoryid, categoryname) {
    this.props.callback(categoryid, categoryname);
  }

  render() {
    return (
      <div className = "CategoryContainer">
        <div className= "categoryTitle">{"Categories"}</div>
        <Grid
          width={0}
          gap={0}>
          <div id="column">
            <div className= "griditem">
              <div className="categoryname">General Knowledge</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(9, "General Knowledge")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Film</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(11, "Film")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Music</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(12, "Music")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Television</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(14, "Television")}></input>
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div id="column">
            <div className= "griditem">
              <div className="categoryname">Video Games</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(15, "Video Games")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Books</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(10, "Books")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Anime and Manga</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(31, "Anime and Manga")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Science and Nature</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(17, "Science and Nature")}></input>
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div id="column">
            <div className= "griditem">
              <div className="categoryname">Computers</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(18, "Computers")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Mathematics</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(19, "Mathematics")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Mythology</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(20, "Mythology")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Geography</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(22, "Geography")}></input>
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div id= "column">
            <div className= "griditem">
              <div className="categoryname">{"History"}</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(23, "History")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Politics</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(24, "Politics")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Animals</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(27, "Animals")}></input>
                <span class="slider round"></span>
              </label>
            </div>
            <div className= "griditem">
              <div className="categoryname">Celebrities</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(26, "Celebrities")}></input>
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

export default GameSetup;

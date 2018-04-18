import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class GameSetup extends React.Component {
  constructor(props) {
    super(props)
    // we put on state the properties we want to use and modify in the component
    this.state = {
      numberOfQuestions: 10,
      categories: [],
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
    console.log(newLobID);
    Lobbies.child(newLobID).set({
      numberOfQuestions: this.state.numberOfQuestions,
      categories: this.state.categories
    });
  }

  onNumberOfGuestsChanged = (e) => {
    this.setState({
      numberOfQuestions: e.target.value,
    })
  }

  addCategory = (categoryid, categoryname) => {
    var category = {categoryid, categoryname};
    if(this.state.categories.includes(categoryid)){
      var index = this.state.categories.indexOf(categoryid);
      this.state.categories.splice(index,1);
    } else {
      this.state.categories.push(category);
    }
    console.log(this.state.categories);
  }

  componentDidMount() {

  }

  render() {
    var toPrintLink = "";
    if(this.state.lobbyID !== "")
      toPrintLink = (
        <div>
          <div>Here is your game link, give it to your friends and then click on it</div>
          <Link to = {"/lobby/" + this.state.lobbyID}>/{this.state.lobbyID}</Link>
        </div>
      )
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
        <div class="btnhandler">
          <button id="startbutton" type="button" class="btn btn-primary btn-lg" onClick={() => this.handleChange()}>Create Lobby</button>
        </div>
        {toPrintLink}
      </div>
    );
  }
}

class Categories extends React.Component {
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
                <input type="checkbox" onClick={() => this.handleClick(14, "Televisioni")}></input>
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div id="column">
            <div className= "griditem">
              <div className="categoryname">Video Games</div>
              <label class="switch">
                <input type="checkbox" onClick={() => this.handleClick(15, "VideoGames")}></input>
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

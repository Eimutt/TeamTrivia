import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';
import GameState from "./GameState";
import TeamSetup from "./TeamSetup";
import VictoryScreen from "./VictoryScreen";

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'INITIAL',
      numQ:0,
      categories: [],
      lobbyId: "",
      hostId: "",
      hostName: "",
      numTeams: 0,
      finalScores: [],
    }
  }

  componentDidMount = () => {
    var pathArray = window.location.hash.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    lobbydata.on("value", (snapshot) => {
      this.setState({
        lobbyId : pathArray[2],
        numQ : snapshot.val().numberOfQuestions,
        categories : snapshot.val().categories,
        hostId : snapshot.val().host.hostId,
        hostName: snapshot.val().host.hostName,
        status: snapshot.val().status,
        finalScores: snapshot.val().finalScores
      })
    })
  }

  makethegame = () => {
    const database = firebaseApp.database();
    const lobby = database.ref("Lobbies/" + this.state.lobbyId);
    const teams = database.ref("Lobbies/" + this.state.lobbyId + "/Teams/");
    var id = this.state.lobbyId;
    var nTeams = 0;
    var token;
    this.getSessionToken().then((json) => {
      token = json.token;
      teams.once("value", (snapshot) => {
        var data = snapshot.val();
        Object.keys(data).map(function(objectKey, index) {
            const team = database.ref("Lobbies/" + id + "/Teams/" + objectKey);
            team.update({
              score: 0
            })
            nTeams++;
        });
        lobby.update({
          numTeams: nTeams
        })
      })
      lobby.update({
        status: "InProgress",
        token: token
      })
      this.setState({
        numTeams : nTeams
      })
    })
  }

  getSessionToken = () => {
    const url = 'https://opentdb.com/api_token.php?command=request';
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
        console.error('getSessionToken() API Error:', error.message || error);
        alert('getSessionToken() API Error:', error.message || error);
      })
    } else {
      console.error('getSessionToken() API Error:', error.message || error);
      alert('getSessionToken() API Error:', error.message || error);
    }
  }

  endGame = () => {
    const database = firebaseApp.database();
    const lobby = database.ref("Lobbies/" + this.state.lobbyId);
    const teams = database.ref("Lobbies/" + this.state.lobbyId + "/Teams/");
    var id = this.state.lobbyId;
    var teamScores = [];
    teams.once("value", (snapshot) => {
      var data = snapshot.val();
      Object.keys(data).map(function(objectKey, index) {
          teamScores.push({teamNum: objectKey, teamInfo: data[objectKey]});
      });
    })
    lobby.update({
        status : "GameEnded",
        finalScores : teamScores,
    })
  }

  render() {
    var lobbyView;
    switch(this.state.status){
      case 'INITIAL':
      var beginButton = (
        <div>
          <button disabled id="startbutton" type="button" class="btn btn-primary btn-lg">Start Game</button>
        </div>
      );
      var user = firebaseApp.auth().currentUser;
      const database = firebaseApp.database();
      const lobby = database.ref("Lobbies/" + this.state.lobbyId);
      var teamexists = false;
      lobby.on("value", (snapshot) => {
        if(snapshot.numChildren() > 4)
          teamexists = true;
      })
      if(this.state.hostId == user.uid && teamexists){
        beginButton = (
          <div class="btnhandler">
            <button id="startbutton" type="button" class="btn btn-primary btn-lg" onClick={() => this.makethegame()}>Start Game</button>
          </div>
        );
      }
        lobbyView = (
          <div className="Lobby">
            <div className="LobbyGreet">{"Hello " + this.props.displayname}</div>
            <div>{"Number of Questions: " + this.state.numQ}</div>
            <div>{"Categories chosen by host " + this.state.hostName + ":"}</div>
            <Grid id="lobbyCatGrid" width={0} gap={0}>
              {this.state.categories.map((category) =>
                <div>{category.categoryname}</div>
              )}
            </Grid>
            <TeamSetup status={this.state}/>
            {beginButton}
          </div>
        );
        break;
      case 'InProgress':
        lobbyView = (
          <div>
            <GameState teams={this.state.numTeams} endGame={() => this.endGame()}/>
          </div>
        )
        break;
      case 'GameEnded':
        lobbyView = (
          <VictoryScreen finalScores={this.state.finalScores}/>
        )
        break;
    }
    return (
      <div>
        {lobbyView}
      </div>
    );
  }
}

export default Lobby;

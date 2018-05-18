import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';
import GameState from "./GameState";
import TeamSetup from "./TeamSetup";
import VictoryScreen from "./VictoryScreen";
import Beforeunload from 'react-beforeunload';
import SpectatorWarning from "./SpectatorWarning";
import Chat from "./Chat";

class Lobby extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    this.state = {
      status: 'INITIAL',
      numQ:0,
      categories: [],
      lobbyId: "",
      hostId: "",
      hostName: "",
      numTeams: 0,
      finalScores: [],
      showchat: true
    }
  }

  componentDidMount = () => {
    var user = firebaseApp.auth().currentUser;
    this.user = user;
    var pathArray = window.location.hash.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    this.setState({
      lobbyId : pathArray[2],
    })
    lobbydata.on("value", (snapshot) => {
      this.setState({
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
        console.error('getAllDishes() API Error:', error.message || error)
      })
    } else {
      console.error('getAllDishes() API Error:', error.message || error)
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




  removefromTeam = () => {
    var user = this.user;
    if(this.user.photoURL != 0){
      const database = firebaseApp.database();
      const lobby = database.ref("Lobbies/" + this.state.lobbyId);
      const teamdata = database.ref("Lobbies/" + this.state.lobbyId + "/Teams/Team" + user.photoURL);

      teamdata.once("value", (snapshot) => {
        var members = snapshot.child("members").val();
        Object.keys(members).map(function(objectKey, index) {
            if(members[objectKey].id == user.uid){
              teamdata.child("members").child(objectKey).remove();
            }
        });
        if (snapshot.child("members").numChildren() == 1){
          teamdata.remove();
          lobby.child("numTeams").transaction(function(numTeams){
            return numTeams-1;
          });
        }
      })
    }
  }

  togglechat = () => {
    if(this.state.showchat == false){
      this.setState({
        showchat: true
      })
    } else {
      this.setState({
        showchat: false
      })
    }
  }


  render() {
    var lobbyView;
    var user = this.user;
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
        if(snapshot.child("Teams").exists())
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
          <Beforeunload onBeforeunload={() => {
              this.removefromTeam();
            }
          }>
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
          </Beforeunload>
        );
        break;
      case 'InProgress':
        lobbyView = (
          <div>
            <Beforeunload onBeforeunload={() => {
                this.removefromTeam();
              }
            }>
              <GameState teams={this.state.numTeams} endGame={() => this.endGame()}/>
            </Beforeunload>
            <SpectatorWarning/>
          </div>
        )
        break;
      case 'GameEnded':
        lobbyView = (
          <div>
            <VictoryScreen finalScores={this.state.finalScores}/>
          </div>
        )
        break;
    }
    return (
      <div>
        {lobbyView}
        <div className="chatToggle">
          <div class="btnhandler">
            <button id="chatToggle" type="button" class="btn btn-primary btn-sm" onClick={() => this.togglechat()}>Chat</button>
          </div>
        </div>
        {this.state.showchat ?
          <Chat lobbyId={this.state.lobbyId}/>
          :
          <div></div>
        }
      </div>
    );
  }
}

export default Lobby;

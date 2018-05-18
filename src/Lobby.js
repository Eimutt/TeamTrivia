import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';
import GameState from "./GameState";
import TeamSetup from "./TeamSetup";
import VictoryScreen from "./VictoryScreen";
import Beforeunload from 'react-beforeunload';

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
    }
  }

  componentDidMount = () => {
    var user = firebaseApp.auth().currentUser;
    this.user = user;
    var pathArray = window.location.hash.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    console.log(pathArray[2]);
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
      console.log(snapshot.val().finalScores);
      console.log(snapshot.val());
    })
    console.log(this.state.hostId);
    console.log(this);
  }

  makethegame = () => {
    const database = firebaseApp.database();
    const lobby = database.ref("Lobbies/" + this.state.lobbyId);
    const teams = database.ref("Lobbies/" + this.state.lobbyId + "/Teams/");
    var id = this.state.lobbyId;
    var nTeams = 0;
    var token;
    this.getSessionToken().then((json) => {
      console.log(json);
      token = json.token;
      console.log(token);
      teams.once("value", (snapshot) => {
        var data = snapshot.val();
        console.log(data);
        Object.keys(data).map(function(objectKey, index) {
            //var t = data[objectKey];
            console.log(objectKey);
            console.log(id);
            console.log("Lobbies/" + id + "/Teams/" + objectKey);
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
      console.log(data);
      Object.keys(data).map(function(objectKey, index) {
          //var t = data[objectKey];
          console.log(objectKey);
          console.log(id);
          console.log("Lobbies/" + id + "/Teams/" + objectKey);
          teamScores.push({teamNum: objectKey, teamInfo: data[objectKey]});
      });
    })
    lobby.update({
        status : "GameEnded",
        finalScores : teamScores,
    })
    /*
    this.setState({
      status : "GameEnded",
      finalScores : teamScores,
    })*/
  }

  fug = () => {
    console.log('xd');
  }



  removefromTeam = () => {
    console.log("fukc");
    var user = this.user;
    if(this.user.photoURL != 0){
      const database = firebaseApp.database();
      const lobby = database.ref("Lobbies/" + this.state.lobbyId);
      const teamdata = database.ref("Lobbies/" + this.state.lobbyId + "/Teams/Team" + user.photoURL);
      console.log("Lobbies/" + this.state.lobbyId + "/Teams/Team" + user.photoURL + "/members")

      teamdata.once("value", (snapshot) => {
        var members = snapshot.child("members").val();
        Object.keys(members).map(function(objectKey, index) {
            if(members[objectKey].id == user.uid){
              teamdata.child("members").child(objectKey).remove();
            }
        });
        console.log(snapshot.child("members").numChildren());
        if (snapshot.child("members").numChildren() == 1){
          teamdata.remove();
          lobby.child("numTeams").transaction(function(numTeams){
            return numTeams-1;
          });
        }
      })
    }
  }


  render() {
    var lobbyView;
    console.log(this.state.status);
    switch(this.state.status){
      case 'INITIAL':
      var beginButton = (
        <div>
          <button disabled id="startbutton" type="button" class="btn btn-primary btn-lg">Start Game</button>
        </div>
      );
      var user = firebaseApp.auth().currentUser;
      console.log(user.uid);
      console.log(this.state.hostId);
      const database = firebaseApp.database();
      const lobby = database.ref("Lobbies/" + this.state.lobbyId);
      var teamexists = false;
      lobby.on("value", (snapshot) => {
        if(snapshot.numChildren() > 4)
          teamexists = true;
      })
      console.log(teamexists);
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

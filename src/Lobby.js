import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';
import Team from "./Team";

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
      lobbyId: ""
    }

  }

  componentDidMount = () => {
    var pathArray = window.location.pathname.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    lobbydata.on("value", (snapshot) => {
      this.setState({
        lobbyId : pathArray[2],
        numQ : snapshot.val().numberOfQuestions,
        categories : snapshot.val().categories
      })
    })
    console.log(this);

  }

  /*
  addQuestion = () => {
    var pathArray = window.location.pathname.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);

    lobbydata.update({ numberOfQuestions: this.state.numQ});
  }
  <div class="btnhandler">
    <button id="startbutton" type="button" class="btn btn-primary btn-lg" onClick={this.addQuestion}>Addbenis</button>
  </div>
  */



  /*handleChange = () => {
    const database = firebaseApp.database();
    const team = database.ref("Lobby").child("Team");
    const members = team.child("member");
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
  }*/

  render() {
    return (
      <div className="Lobby">
        <div className="LobbyGreet">{"Hello " + this.props.displayname}</div>
        <div>{"Number of Questions: " + this.state.numQ}</div>
        <div>{"Categories chosen by host:"}</div>
        <Grid id="lobbyCatGrid" width={0} gap={0}>
          {this.state.categories.map((category) =>
            <div>{category.categoryname}</div>
          )}
        </Grid>
        <TeamSetup status={this.state}/>
      </div>
    );
  }
}

class TeamSetup extends Component{
  constructor(props) {
    super(props);
    // we put on state the properties we want to use and modify in the component
    this.state = {
      numTeams: 2,
      categories: [],
      lobbyID: ""
    }
    const database = firebaseApp.database();
    this.database = database.ref("Lobbies/" + this.props.status.lobbyId);
  }

  addTeam = () => {
    this.setState({
      numTeams: this.state.numTeams + 1
    })
    console.log(this.state.numTeams);
  };

  joinTeam = (e) => {
    const database = firebaseApp.database();
    console.log("Lobbies/" + this.props.status.lobbyId);
    const team = database.ref("Lobbies/" + this.props.status.lobbyId);
    const members = team.child("Team" + e)
    var user = firebaseApp.auth().currentUser;
    members.push({
      id: user.uid,
      name: user.displayName,
    });
  }





    render() {

      var teams;
      console.log(this.state.numTeams);
      switch (this.state.numTeams) {
        case 2:
        teams = <div className="TeamSetup">
                  <Team teamid="1" active="yes"/>
                  <Team teamid="2" active="yes"/>
                  <Team teamid="3" active="no"/>
                  <Team teamid="4" active="no"/>
                </div>
          break;
        case 3:

        teams = <div className="TeamSetup">
                  <Team teamid="1" active="yes"/>
                  <Team teamid="2" active="yes"/>
                  <Team teamid="3" active="yes"/>
                  <Team teamid="4" active="no"/>
                </div>

          break;
          case 4:
          teams = <div className="TeamSetup">
                    <Team teamid="1" active="yes"/>
                    <Team teamid="2" active="yes"/>
                    <Team teamid="3" active="yes"/>
                    <Team teamid="4" active="yes"/>
                  </div>
          break;
        default:
          teams = <b>Failed to load data, please try again</b>
          break;
      }




      return (
        <div >
          {teams}
        </div>
      );
    }

  }





export default Lobby;

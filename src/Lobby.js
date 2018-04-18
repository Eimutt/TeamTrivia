import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

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


  }

  /*
  addQuestion = () => {
    var pathArray = window.location.pathname.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);

    lobbydata.update({ numberOfQuestions: this.state.numQ});

  }
  */



  handleChange = () => {
    const database = firebaseApp.database();
    const team = database.ref("Lobby").child("Team");
    const members = team.child("member")
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
  }


  render() {
    return (
      <div className="Lobby">
        <div class="btnhandler">
          <button id="startbutton" type="button" class="btn btn-primary btn-lg" onClick={this.addQuestion}>Addbenis</button>
        </div>
        <div>{this.state.lobbyID}</div>
        <div>{this.state.numQ}</div>
        <div>
          {this.state.categories.map((category) =>
            <div>{category.categoryname}</div>
          )}
        </div>

        <TeamSetup lobbyId={this.state.lobbyId}/>
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
  }

  addTeam = () => {
    this.setState({
      numTeams: this.state.numTeams + 1
    })
    console.log(this.state.numTeams);
  };

  joinTeam = (e) => {
    const database = firebaseApp.database();
    console.log("Lobbies/" + this.props.lobbyId);
    const team = database.ref("Lobbies/" + this.props.lobbyId);
    const members = team.child("Team" + e)
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
  }





  render() {

    var teams;
    var teams12 = <div>
              <ul className="Team">
                <li className="TeamMember">
                  <button type="button" class="btn btn-primary btn-sm" onClick={this.joinTeam}>
                    Add Team
                  </button>
                </li>
                <li className="TeamMember">Second item</li>
                <li className="TeamMember">Third item</li>
              </ul>
              <ul className="Team">
                <li className="TeamMember">Hi again</li>
                <li className="TeamMember">Second item</li>
                <li className="TeamMember">Third item</li>
              </ul>
            </div>
    var team3 = <div></div>
    var team4 = <div></div>
    console.log(this.state.numTeams);
    switch (this.state.numTeams) {
      case 2:

      var


      team4 = <div className="AddTeam">
                <div class="newTeambutton">
                  <button type="button" class="btn btn-primary btn-sm" onClick={() => this.addTeam("1")} >
                    Add Team
                  </button>
                </div>
              </div>

      team3 = <div className="AddTeam">
                <div class="newTeambutton">
                  <button type="button" class="btn btn-primary btn-sm" onClick={this.addTeam}>
                    Add Team
                  </button>
                </div>
              </div>

      teams = <div>
                <div className="Team">
                  <ul className="TeamList">
                  <li className="TeamMember">
                    <button type="button" class="btn btn-primary btn-sm" onClick={() => this.joinTeam("1")}>
                      Add Team
                    </button>
                  </li>
                    <li className="TeamMember">Second item</li>
                    <li className="TeamMember">Third item</li>
                  </ul>
                </div>
                <div className="Team">
                  <ul className="TeamList">
                    <li className="TeamMember">Hi again</li>
                    <li className="TeamMember">Second item</li>
                    <li className="TeamMember">Third item</li>
                  </ul>
                </div>
                {team3}
                {team4}
              </div>


        break;
      case 3:
      team3 = <div className="AddTeam">
                <div class="newTeambutton">
                  <button type="button" class="btn btn-primary btn-sm" onClick={this.addTeam}>
                    Add Team
                  </button>
                </div>
              </div>

      team4 = <div className="AddTeam">
                <div class="newTeambutton">
                  <button type="button" class="btn btn-primary btn-sm" onClick={this.addTeam}>
                    Add Team
                  </button>
                </div>
              </div>

      teams = <div>
                <ul className="Team">
                  <li className="TeamMember">Hi again</li>
                  <li className="TeamMember">Second item</li>
                  <li className="TeamMember">Third item</li>
                </ul>
                <ul className="Team">
                  <li className="TeamMember">Hi again</li>
                  <li className="TeamMember">Second item</li>
                  <li className="TeamMember">Third item</li>
                </ul>
                <ul className="Team">
                  <li className="TeamMember">Hi again</li>
                  <li className="TeamMember">Second item</li>
                  <li className="TeamMember">Third item</li>
                </ul>
                {team4}
              </div>



        break;
        case 4:
        teams = <div>
                  <ul className="Team">
                    <li className="TeamMember">Hi again</li>
                    <li className="TeamMember">Second item</li>
                    <li className="TeamMember">Third item</li>
                  </ul>
                  <ul className="Team">
                    <li className="TeamMember">Hi again</li>
                    <li className="TeamMember">Second item</li>
                    <li className="TeamMember">Third item</li>
                  </ul>
                  <ul className="Team">
                    <li className="TeamMember">Hi again</li>
                    <li className="TeamMember">Second item</li>
                    <li className="TeamMember">Third item</li>
                  </ul>
                  <ul className="Team">
                      <li className="TeamMember">Hi again</li>
                      <li className="TeamMember">Second item</li>
                      <li className="TeamMember">Third item</li>
                  </ul>
                </div>
        break;
      default:
        teams12 = <b>Failed to load data, please try again</b>
        break;
    }




    return (
      <div className="TeamSetup">
        Hello
        {teams}
      </div>
    );
  }

}





export default Lobby;

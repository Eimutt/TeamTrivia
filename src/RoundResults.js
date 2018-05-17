import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class RoundResults extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    console.log(this.props);
    this.state = {
      answerOptions : this.props.questioninfo.answerOptions,
      round: this.props.round,
      lobbyId: this.props.lobbyId,
      choices: {},
      status: 'Initial'
    }
  }

  componentDidMount() {
    const database = firebaseApp.database();
    const teamAns = database.ref("Lobbies/" + this.state.lobbyId + "/Rounds/Round" + this.state.round);
    console.log("Lobbies/" + this.state.lobbyId + "/Rounds/Round" + this.state.round);
    var choices = {};
    teamAns.once("value", (snapshot) => {
      var data = snapshot.val();
      for(var i = 1; i < 5; i++){
        var teamN = 'Team' + i;
        if(snapshot.child(teamN).exists()){
          choices[teamN] = snapshot.child(teamN).val();
        }
      }
    })
    this.setState({
      choices: choices,
      status: 'Ready'
    });

    setTimeout(() => {
      this.props.newRound();
    }, 5000);
  }

  componentWillUnmount() {
  }

  render() {
    var results;
    switch (this.state.status) {
      case 'Initial':
        break;
      case 'Ready':
        results =
          <ul>
          {Object.keys(this.state.choices).map((team) =>
            <li>
            { this.state.answerOptions[this.state.choices[team].choice] == this.props.questioninfo.correctAnswer ?
               <div className = "CorrectAnswer">
                 {this.state.choices[team].pickedBy + " picked「" + this.state.answerOptions[this.state.choices[team].choice] + "」 for " + team + " (+" + this.props.questioninfo.difficulty + ")"}
               </div>
              :
                <div className = "WrongAnswer">
                  {this.state.choices[team].pickedBy + " picked「" + this.state.answerOptions[this.state.choices[team].choice] + "」 for " + team + " (+0)"}
                </div>
             }
            </li>
          )}
          </ul>
        break;
    }

    return (
      <div>
        <div id="question">{this.props.questioninfo.currentQuestion.replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</div>
        <div id="question">{"The correct answer is : " + this.props.questioninfo.correctAnswer.replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</div>
        {results}
      </div>
    );
  }
}


export default RoundResults;

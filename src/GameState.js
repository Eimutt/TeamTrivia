import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';


class GameState extends Component{
  constructor(props) {
    super(props);
    // we put on state the properties we want to use and modify in the component
    this.state = {
      members: [],
      lobbyID: "",
      numberOfQuestions: "",
      categories: [],
      status: 'Initialize',
      gameState: 'Initialize',
      currentQuestion: "",
      answerOptions: [],
      correctAnswer: "",
      round: 0,
      opt1: "",
      opt2: "",
      opt3: ""
    }
    this.numTeams = this.props.teams;
    console.log(this.numTeams)
  }

  componentDidMount = () => {
    var pathArray = window.location.hash.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    const roundinfo = database.ref("Lobbies/" + pathArray[2] + "/Rounds/")
    const roundData = database.ref("Lobbies/" + pathArray[2] + "/RoundData/")
    console.log(pathArray[2]);
    roundinfo.on("value", (snapshot) => {
      if (snapshot.numChildren() > 0){
        var data = snapshot.val()["Round" + this.state.round];
        this.setState({
          currentQuestion: data.currentQuestion,
          answerOptions: data.answerOptions,
          correctAnswer: data.correctAnswer,
          status: 'QuestionMode'
        })
      }
    })
    roundData.on("value", (snapshot) => {
      if (snapshot.numChildren() > 0){
        var data = snapshot.val();
        this.setState({
          round: data.Round,
          gameState: data.GameState
        })
      }
    })



    lobbydata.once("value", (snapshot) => {
      this.setState({
        lobbyId : pathArray[2],
        numQ : snapshot.val().numberOfQuestions,
        categories : snapshot.val().categories,
        hostId : snapshot.val().host.hostId,
        hostName: snapshot.val().host.hostName,
        gameState: 'Ready'
      })
    })

  }

  getRandomCategory = () => {
    const max = this.state.categories.length;
    const rand = (Math.random() * max);
    const index = parseInt(rand);
    return this.state.categories[index];
  }

  fetchQuestion = (category, difficulty) => {
    const url = 'https://opentdb.com/api.php?amount=1&category=' + category + '&difficulty=' + difficulty + '&type=multiple';
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

  handleFetchClick = (catID, difficulty) => {
    var pathArray = window.location.hash.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    this.fetchQuestion(catID, difficulty).then((json) => {
      console.log(json);
      var answerArray = json.results[0].incorrect_answers;
      answerArray.push(json.results[0].correct_answer);
      var randIndex = parseInt(Math.random() * 4);
      var temp = answerArray[3];
      answerArray[3] = answerArray[randIndex];
      answerArray[randIndex] = temp;
      /*this.setState ({
        currentQuestion: json.results[0].question,
        answerOptions: answerArray,
        correctAnswer: json.results[0].correct_answer,
        status: 'QuestionMode'
      });*/
      lobbydata.child("Rounds").child("Round" + this.state.round).set({
        currentQuestion: json.results[0].question,
        answerOptions: answerArray,
        correctAnswer: json.results[0].correct_answer,
      });
      lobbydata.update({
        RoundData: {
          GameState: 'QuestionMode',
          Round: this.state.round
        }
      })
    });


  }

  noAnswer(){
    this.pickAnswer(-1);
  }


  pickAnswer = (ans) => {
    var user = firebaseApp.auth().currentUser;
    var pathArray = window.location.hash.split( '/' );
    this.state.lobbyID = pathArray[2];
    const database = firebaseApp.database();
    const teams = database.ref("Lobbies/" + this.state.lobbyID + "/Teams");
    const round = database.ref("Lobbies/" + this.state.lobbyID + "/Rounds/Round" + this.state.round);
    const team = round.child('Team' + user.photoURL);
    team.set({
      answered: true,
      choice: ans,
    })
    round.once("value", (snapshot) => {
      console.log("fuck" + snapshot.numChildren());
      console.log("shit"+ this.props.teams);
      if(snapshot.numChildren() > (2 + this.props.teams)){
        var choices = snapshot.val();
        console.log(choices);
        for(var i = 0; i < 4; i++){
          var teamN = 'Team' + i;
          console.log(teamN);
          if(snapshot.child(teamN).exists()){
            console.log("bnies");
            if(this.state.correctAnswer == this.state.answerOptions[snapshot.child(teamN).val().choice]){
              const teamscore = teams.child(teamN).child('score');
              teamscore.transaction(function(score){
                return score+1;
              });
            }
          }
        }

        const lobbydata = database.ref("Lobbies/" + this.state.lobbyID);
        lobbydata.update({
          RoundData: {
            GameState: 'Ready',
            Round: this.state.round + 1
          }
        })
      }
    })
  }

  render() {
    var dataloaded;

    switch(this.state.gameState){
      case 'Initialize':
        dataloaded = (
          <div>
            Not loaded yet
          </div>
        )
        break;
      case 'Ready':
        var user = firebaseApp.auth().currentUser;

        var randCat1 = this.getRandomCategory();
        var randCat2 = this.getRandomCategory();
        var randCat3 = this.getRandomCategory();
        dataloaded = (
          <Grid className="AlternativesGrid" width={40} gap={30}>
            <div class="QuestionAlternatives">
              <div>Easy</div>
              <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(randCat1.categoryid, "easy")}>{randCat1.categoryname}</button>
            </div>
            <div class="QuestionAlternatives">
            <div>Medium</div>
              <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(randCat2.categoryid, "medium")}>{randCat2.categoryname}</button>
            </div>
            <div class="QuestionAlternatives">
              <div>Hard</div>
              <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(randCat3.categoryid, "hard")}>{randCat3.categoryname}</button>
            </div>
          </Grid>
        )
        break;
      case 'QuestionMode':
        dataloaded = (
          <div>
            <div id="question">{this.state.currentQuestion.replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</div>
            <Grid className="AlternativesGrid" width={40} gap={30}>
              <div id="column">
                <div className="QuestionAlternatives">
                  <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(0)}>{this.state.answerOptions[0].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                </div>
                <div className="QuestionAlternatives">
                  <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(1)}>{this.state.answerOptions[1].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                </div>
              </div>
              <div id="column">
                <div className="QuestionAlternatives">
                  <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(2)}>{this.state.answerOptions[2].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                </div>
                <div className="QuestionAlternatives">
                  <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(3)}>{this.state.answerOptions[3].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                </div>
              </div>
            </Grid>
            <Timer noAnswer={ () => this.noAnswer()}/>
          </div>
        )
        break;
    }
    return (
      <div>
        {dataloaded}
        <ScoreBoard/>
      </div>
    )
  }
}

export default GameState;

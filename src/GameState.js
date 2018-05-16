import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';
import AnswerOptionsGrid from './AnswerOptionsGrid';


class GameState extends Component{
  constructor(props) {
    super(props);
    // we put on state the properties we want to use and modify in the component
    this.state = {
      members: [],
      lobbyId: "",
      numberOfQuestions: "",
      categories: [],
      status: 'Initialize',
      gameState: 'Initialize',
      currentQuestion: "",
      answerOptions: [],
      correctAnswer: "",
      difficulty: "",
      round: 0,
      Cat1: {},
      Cat2: {},
      Cat3: {}
    }
  }

  componentDidMount = () => {
    var pathArray = window.location.hash.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    const roundinfo = database.ref("Lobbies/" + pathArray[2] + "/Rounds/")
    const roundData = database.ref("Lobbies/" + pathArray[2] + "/RoundData/")
    const catOpts = database.ref("Lobbies/" + pathArray[2] + "/CatOptions/")
    console.log(pathArray[2]);
    roundinfo.on("value", (snapshot) => {
      if (snapshot.numChildren() > 0){
        var data = snapshot.val()["Round" + this.state.round];
        this.setState({
          currentQuestion: data.currentQuestion,
          answerOptions: data.answerOptions,
          correctAnswer: data.correctAnswer,
          difficulty: data.difficulty,
          gameState: 'QuestionMode',

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
    catOpts.on("value", (snapshot) => {
      if (snapshot.numChildren() > 0){
        var data = snapshot.val();
        this.setState({
          Cat1: data.CategoryOptions.Cat1,
          Cat2: data.CategoryOptions.Cat2,
          Cat3: data.CategoryOptions.Cat3,
          gameState: 'Ready'
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
        gameState: 'GetQuestion',
        numTeams: snapshot.val().numTeams
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
        difficulty: json.results[0].difficulty,
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
    const database = firebaseApp.database();
    const teams = database.ref("Lobbies/" + this.state.lobbyId + "/Teams");
    const round = database.ref("Lobbies/" + this.state.lobbyId + "/Rounds/Round" + this.state.round);
    const team = round.child('Team' + user.photoURL);
    team.once("value", (snapshot) => {
      if(!(snapshot.exists())){
        team.set({
          answered: true,
          choice: ans,
          pickedBy: user.displayName
        })
        round.once("value", (snapshot) => {
          if(snapshot.numChildren() > (3 + this.state.numTeams)){
            var choices = snapshot.val();
            for(var i = 1; i < 5; i++){
              var teamN = 'Team' + i;
              if(snapshot.child(teamN).exists()){
                if(this.state.correctAnswer == this.state.answerOptions[snapshot.child(teamN).val().choice]){
                  var questionworth = 0;
                  switch (this.state.difficulty) {
                    case 'easy':
                        questionworth = 1;
                      break;
                    case 'medium':
                        questionworth = 2;
                      break;
                    case 'hard':
                        questionworth = 3;
                      break;
                    }
                  const teamscore = teams.child(teamN).child('score');
                  teamscore.transaction(function(score){
                    return score+questionworth;
                  });
                }
              }
            }

            const lobbydata = database.ref("Lobbies/" + this.state.lobbyId);
            lobbydata.update({
              RoundData: {
                GameState: 'GetQuestion',
                Round: this.state.round + 1
              }
            })
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
      case 'GetQuestion':
        var user = firebaseApp.auth().currentUser;
        if(user.uid == this.state.hostId){
          const database = firebaseApp.database();
          const round = database.ref("Lobbies/" + this.state.lobbyId + "/CatOptions/");
          var randCat1 = this.getRandomCategory();
          var randCat2 = this.getRandomCategory();
          var randCat3 = this.getRandomCategory();
          round.update({
            CategoryOptions: {
              Cat1: {
                catid: randCat1.id,
                name: randCat1.name
              },
              Cat2: {
                catid: randCat2.id,
                name: randCat2.name
              },
              Cat3: {
                catid: randCat3.id,
                name: randCat3.name
              }
            }
          })

        }
        break;
      case 'Ready':
        dataloaded = (
          <Grid className="AlternativesGrid" width={40} gap={30}>
            <div class="QuestionAlternatives">
              <div>Easy</div>
              <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(this.state.Cat1.catid, "easy")}>{this.state.Cat1.name}</button>
            </div>
            <div class="QuestionAlternatives">
            <div>Medium</div>
              <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(this.state.Cat2.catid, "medium")}>{this.state.Cat2.name}</button>
            </div>
            <div class="QuestionAlternatives">
              <div>Hard</div>
              <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(this.state.Cat3.catid, "hard")}>{this.state.Cat3.name}</button>
            </div>
          </Grid>
        )
        break;
      case 'QuestionMode':
        dataloaded = (
          <div>
            <div id="question">{this.state.currentQuestion.replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</div>
            <AnswerOptionsGrid pickAnswer={ (ans) => this.pickAnswer(ans)} round =  {this.state.round} options = {this.state.answerOptions} lobbyId = {this.state.lobbyId}/>
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

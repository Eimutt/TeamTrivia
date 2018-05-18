import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import {Col, Container, Row} from 'react-grid-system';
import Beforeunload from 'react-beforeunload';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';
import AnswerOptionsGrid from './AnswerOptionsGrid';
import RoundResults from './RoundResults';


class GameState extends Component{
  constructor(props) {
    super(props);
    // we put on state the properties we want to use and modify in the component
    this.state = {
      members: [],
      lobbyId: "",
      numQ: "",
      categories: [],
      status: 'Initialize',
      gameState: 'Initialize',
      questioninfo: {},
      round: 0,
      Cat1: {},
      Cat2: {},
      Cat3: {},
      token: ""
    }
  }

  componentDidMount = () => {
    var user = firebaseApp.auth().currentUser;
    this.user = user;
    console.log(this.user);
    var pathArray = window.location.hash.split( '/' );
    const database = firebaseApp.database();
    const lobbydata = database.ref("Lobbies/" + pathArray[2]);
    const numT = database.ref("Lobbies/" + pathArray[2] + "/numTeams");
    const roundinfo = database.ref("Lobbies/" + pathArray[2] + "/Rounds/")
    const roundData = database.ref("Lobbies/" + pathArray[2] + "/RoundData/")
    const catOpts = database.ref("Lobbies/" + pathArray[2] + "/CatOptions/")
    console.log(pathArray[2]);
    roundinfo.on("value", (snapshot) => {
      if (snapshot.numChildren() > 0){
        var data = snapshot.val()["Round" + this.state.round];
        this.setState({
          questioninfo: {
            currentQuestion: data.currentQuestion,
            answerOptions: data.answerOptions,
            correctAnswer: data.correctAnswer,
            difficulty: data.difficulty
          },
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
        token: snapshot.val().token
      })
    })
    numT.on("value", (snapshot) => {
      this.setState({
        numTeams : snapshot.val()
      })
    })

  }

  getRandomCategory = () => {
    const max = this.state.categories.length;
    const rand = (Math.random() * max);
    const index = parseInt(rand);
    return this.state.categories[index];
  }

  getCategories = () => {
    console.log(this.state.categories);
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
        },
        round: this.state.round,
      }
    })
  }

  fetchQuestion = (category, difficulty) => {
    const url = 'https://opentdb.com/api.php?amount=1&category=' + category + '&difficulty=' + difficulty + '&type=multiple&token=' + this.state.token;
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
    if(this.user.photoURL != '0'){
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
        var difficulty = 1;
        switch (json.results[0].difficulty) {
          case 'medium':
            difficulty = 2;
            break;
          case 'hard':
            difficulty = 3;
            break;
        }
        lobbydata.child("Rounds").child("Round" + this.state.round).set({
          currentQuestion: json.results[0].question,
          answerOptions: answerArray,
          correctAnswer: json.results[0].correct_answer,
          difficulty: difficulty,
        });
        lobbydata.update({
          RoundData: {
            GameState: 'QuestionMode',
            Round: this.state.round
          }
        })
      });

    }
  }

  noAnswer(){
    this.pickAnswer(-1);
  }


  pickAnswer = (ans) => {
    if(this.user.photoURL != '0'){
      const database = firebaseApp.database();
      const teams = database.ref("Lobbies/" + this.state.lobbyId + "/Teams");
      const round = database.ref("Lobbies/" + this.state.lobbyId + "/Rounds/Round" + this.state.round);
      const team = round.child('Team' + this.user.photoURL);
      team.once("value", (snapshot) => {
        if(!(snapshot.exists()) || (ans == -1)){
          if(!snapshot.exists()){
            team.set({
              answered: true,
              choice: ans,
              pickedBy: this.user.displayName
            })
          }
          round.once("value", (snapshot) => {
            if(snapshot.numChildren() > (3 + this.state.numTeams) || (ans == -1)){
              var choices = snapshot.val();
              for(var i = 1; i < 5; i++){
                var teamN = 'Team' + i;
                if(snapshot.child(teamN).exists()){
                  if(this.state.questioninfo.correctAnswer == this.state.questioninfo.answerOptions[snapshot.child(teamN).val().choice]){
                    var questionworth = this.state.questioninfo.difficulty;
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
                  GameState: 'RoundResults',
                  Round: this.state.round
                }
              })
            }
          })
        }
      })
    }
  }

  newRound = () => {
    if(this.user.uid == this.state.hostId){
      const database = firebaseApp.database();
      const lobbydata = database.ref("Lobbies/" + this.state.lobbyId);
      lobbydata.update({
        RoundData: {
          GameState: 'GetQuestion',
          Round: this.state.round + 1
        }
      })
      console.log(this.state.round + " > " + this.state.numQ);
      if (this.state.round >= this.state.numQ) {
        this.props.endGame();
      }
    }
  }

  removefromTeam = () => {
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
    console.log(this.state.gameState);
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
        if(this.user.uid == this.state.hostId){
          this.getCategories();
          dataloaded = <div> Generatin CATEGOREIS :DDD </div>
        }
        break;
      case 'Ready':
        dataloaded = (
          <Container className="AlternativesGrid">
              <Row>
                <Col md={4} class="QuestionAlternatives">
                  <div>Easy</div>
                  <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(this.state.Cat1.catid, "easy")}>{this.state.Cat1.name.replace("Entertainment: ", "").replace("Science: ", "")}</button>
                </Col>
                <Col md={4} class="QuestionAlternatives">
                  <div>Medium</div>
                  <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(this.state.Cat2.catid, "medium")}>{this.state.Cat2.name.replace("Entertainment: ", "").replace("Science: ", "")}</button>
                </Col>
                <Col md={4} class="QuestionAlternatives">
                  <div>Hard</div>
                  <button type="button" class="btn btn-primary btn-lg" onClick={() => this.handleFetchClick(this.state.Cat3.catid, "hard")}>{this.state.Cat3.name.replace("Entertainment: ", "").replace("Science: ", "")}</button>
                </Col>
              </Row>
          </Container>
        )
        break;
      case 'QuestionMode':
        dataloaded = (
          <div>
            <div id="question">{this.state.questioninfo.currentQuestion.replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</div>
            <AnswerOptionsGrid pickAnswer={ (ans) => this.pickAnswer(ans)} round =  {this.state.round} options = {this.state.questioninfo.answerOptions} lobbyId = {this.state.lobbyId}/>
            <Timer noAnswer={ () => this.noAnswer()}/>
          </div>
        )
        break;
      case 'RoundResults':
        dataloaded = (
          <div>
            <RoundResults newRound={() => this.newRound()} questioninfo={this.state.questioninfo} round =  {this.state.round} lobbyId = {this.state.lobbyId}/>
          </div>
        )
        break;
    }
    return (
      <div>
          {"Round " + (this.state.round + 1)}
          {dataloaded}
          <ScoreBoard/>
      </div>
    )
  }
}

export default GameState;

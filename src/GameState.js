import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';


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
      currentQuestion: "",
      answerOptions: [],
      correctAnswer: ""
    }
    this.Id = this.props.teamid;
  }

  componentDidMount = () => {
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
        status: 'Ready'
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
    this.fetchQuestion(catID, difficulty).then((json) => {
      console.log(json);
      var answerArray = json.results[0].incorrect_answers;
      answerArray.push(json.results[0].correct_answer);
      var randIndex = parseInt(Math.random() * 4);
      var temp = answerArray[3];
      answerArray[3] = answerArray[randIndex];
      answerArray[randIndex] = temp;
      this.setState ({
        currentQuestion: json.results[0].question,
        answerOptions: answerArray,
        correctAnswer: json.results[0].correct_answer,
        status: 'QuestionMode'
      });
    });
  }

  pickAnswer = (ans) => {
    if (this.state.correctAnswer == this.state.answerOptions[ans]){
      alert("Correct!")
      this.setState({
        status: 'Ready'
      });
    }
    else {
      alert("Wrong! \nCorrect answer is : " + this.state.correctAnswer);
      this.setState({
        status: 'Ready'
      });
    }
  }

  render() {
    var dataloaded;

    switch(this.state.status){
      case 'Initialize':
        dataloaded = (
          <div>
            Not loaded yet
          </div>
        )
        break;
      case 'Ready':
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

          </div>
        )
        break;
    }
    return (
      <div>
        {dataloaded}
      </div>
    )
  }
}

export default GameState;

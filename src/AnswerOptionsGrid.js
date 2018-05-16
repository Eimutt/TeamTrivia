import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class AnswerOptionsGrid extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    console.log(this.props);
    this.state = {
      answerOptions : this.props.options,
      round: this.props.round,
      lobbyId: this.props.lobbyId,
      status: "Initialize"
    }
  }

  componentDidMount() {
    var user = firebaseApp.auth().currentUser;
    const database = firebaseApp.database();
    const teamAns = database.ref("Lobbies/" + this.state.lobbyId + "/Rounds/Round" + this.state.round + "Teams/Team" + user.photoURL);
    teamAns.on("value", (snapshot) => {
      if (snapshot.numChildren() > 0){
        var data = snapshot.val();
        this.setState({
          teamChoice: data.choice,
          pickedBy: data.pickedBy,
          status: "Loaded"
        })
      }
    })

  }

  componentWillUnmount() {
  }

  pickAnswer(a) {
    this.props.pickAnswer(a);
  }

  render() {
    var content;
    switch (this.state.status) {
      case 'Loaded':
          content = <div></div>
        break;
      case 'Loaded':
          content = <div>
                      <Grid className="AlternativesGrid" width={40} gap={30}>
                        <div id="column">
                          {
                            (() => {
                                  console.log(this.state.teamChoice);
                              switch(this.state.teamChoice) {
                                  case '0':
                                      return (
                                            <div className="QuestionAlternatives2">
                                              <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(0)}>{this.state.answerOptions[0].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                                            </div>)
                                    break;
                                  default:
                                      return (
                                        <div className="QuestionAlternatives">
                                          <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(0)}>{this.state.answerOptions[0].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                                        </div>
                                      )
                              }})()
                          }
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
          break;
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}


export default AnswerOptionsGrid;

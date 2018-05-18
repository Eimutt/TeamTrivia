import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';
import {Col, Container, Row} from 'react-grid-system';

class AnswerOptionsGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answerOptions : this.props.options,
      round: this.props.round,
      lobbyId: this.props.lobbyId,
    }
  }

  componentDidMount() {
    var user = firebaseApp.auth().currentUser;
    const database = firebaseApp.database();
    const teamAns = database.ref("Lobbies/" + this.state.lobbyId + "/Rounds/Round" + this.state.round + "/Team" + user.photoURL);
    teamAns.on("value", (snapshot) => {
      if (snapshot.numChildren() > 0){
        var data = snapshot.val();
        this.setState({
          teamChoice: data.choice,
          pickedBy: data.pickedBy,
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
    var content = (
          <div>
            <Container className="AlternativesGrid">
                <Row>
                  <Col md={6} id="column">
                    { this.state.teamChoice == 0 ?
                      <div className="QuestionAlternatives2">
                        <div className="pickedBy">{"Picked by " + this.state.pickedBy}</div>
                        <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(0)}>{this.state.answerOptions[0].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                      </div> :
                      <div className="QuestionAlternatives">
                        <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(0)}>{this.state.answerOptions[0].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                      </div>
                    }
                  </Col>
                  <Col md={6} id="column">
                    { this.state.teamChoice == 1 ?
                      <div className="QuestionAlternatives2">
                        <div className="pickedBy">{"Picked by " + this.state.pickedBy}</div>
                        <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(1)}>{this.state.answerOptions[1].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                      </div> :
                      <div className="QuestionAlternatives">
                        <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(1)}>{this.state.answerOptions[1].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                      </div>
                    }
                  </Col>
                </Row>
                <Row>
                  <Col md={6} id="column">
                    { this.state.teamChoice == 2 ?
                      <div className="QuestionAlternatives2">
                        <div className="pickedBy">{"Picked by " + this.state.pickedBy}</div>
                        <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(2)}>{this.state.answerOptions[2].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                      </div> :
                      <div className="QuestionAlternatives">
                        <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(2)}>{this.state.answerOptions[2].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                      </div>
                    }
                  </Col>
                  <Col md={6} id="column">
                      { this.state.teamChoice == 3 ?
                        <div className="QuestionAlternatives2">
                          <div className="pickedBy">{"Picked by " + this.state.pickedBy}</div>
                          <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(3)}>{this.state.answerOptions[3].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                        </div> :
                        <div className="QuestionAlternatives">
                          <button type="button" class="btn btn-primary btn-lg" onClick={() => this.pickAnswer(3)}>{this.state.answerOptions[3].replace(/&quot;/g,"\"").replace(/&#039;/g, "'")}</button>
                        </div>
                      }
                  </Col>
                </Row>
            </Container>
          </div>
        )
    return (
      <div>
        {content}
      </div>
    );
  }
}


export default AnswerOptionsGrid;

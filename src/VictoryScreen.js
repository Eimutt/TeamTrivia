import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import {Col, Container, Row} from 'react-grid-system';

class VictoryScreen extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    this.state = {
      sortedTeamList: [],

    }
    console.log(this);
  }

  compare = (a,b) => {
    if (a.teamInfo.score < b.teamInfo.score)
      return 1;
    if (a.teamInfo.score > b.teamInfo.score)
      return -1;
    return 0;
  }

  componentDidMount() {
    this.setState({
      sortedTeamList: this.props.finalScores.sort(this.compare),
    });
  }

  render() {
    var results = "";
    switch (this.state.sortedTeamList.length) {
      case 1:
        results = (
          <div>
            <Container id="EndGameContainer">
             <Row>
              <Col md={4}></Col>
              <Col md={4} id="EndGameTeam">{"Winner!"}</Col>
              <Col md={4}></Col>
             </Row>
              {this.state.sortedTeamList.map((team) =>
                <Row>
                  <Col md={4}></Col>
                  <Col md={4} id="EndGameTeam">
                    <div>{team.teamNum}</div>
                    <div>{"Score: " + team.teamInfo.score}</div>
                    <div>
                      <div>{"Members: "}</div>
                      {Object.keys(team.teamInfo.members).map((key) =>
                        <div>{team.teamInfo.members[key].name}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={4}></Col>
                </Row>
              )}
            </Container>
          </div>
        )
        break;
      case 2:
        results = (
          <div>
            <Container id="EndGameContainer">
              <Row>
               <Col md={2}></Col>
               <Col md={4} id="EndGameTeam">{"Winner!"}</Col>
               <Col md={4} id="EndGameTeam">{"Second place"}</Col>
               <Col md={2}></Col>
              </Row>
              <Row>
                <Col md={2}></Col>
                {this.state.sortedTeamList.map((team) =>
                  <Col md={4} id="EndGameTeam">
                    <div>{team.teamNum}</div>
                    <div>{"Score: " + team.teamInfo.score}</div>
                    <div>
                      <div>{"Members: "}</div>
                      {Object.keys(team.teamInfo.members).map((key) =>
                        <div>{team.teamInfo.members[key].name}</div>
                      )}
                    </div>
                  </Col>
                )}
                <Col md={2}></Col>
              </Row>
            </Container>
          </div>
        )
        break;
      case 3:
        results = (
          <div>
            <Container id="EndGameContainer">
              <Row>
                <Col md={1.5}></Col>
                {this.state.sortedTeamList.map((team, index) =>
                  <Col md={3} id="EndGameTeamContainer">
                    <div id="EndGamePlacement">{index === 0 ? "Winner!" : index === 1 ? "Second" : "Third"}</div>
                    <div id="EndGameTeam">
                      <div>{team.teamNum}</div>
                      <div>{"Score: " + team.teamInfo.score}</div>
                      <div>
                        <div>{"Members: "}</div>
                        {Object.keys(team.teamInfo.members).map((key) =>
                          <div>{team.teamInfo.members[key].name}</div>
                        )}
                      </div>
                    </div>
                  </Col>
                )}
                <Col md={1.5}></Col>
              </Row>
            </Container>
          </div>
        )
        break;
      case 4:
        results = (
          <div>
            <Container id="EndGameContainer">
              <Row>
               <Col md={3} id="EndGameTeam">{"Winner!"}</Col>
               <Col md={3} id="EndGameTeam">{"Second place"}</Col>
               <Col md={3} id="EndGameTeam">{"Third place"}</Col>
               <Col md={3} id="EndGameTeam">{"Fourth place"}</Col>
              </Row>
              <Row>
                {this.state.sortedTeamList.map((team) =>
                  <Col md={3} id="EndGameTeam">
                    <div>{team.teamNum}</div>
                    <div>{"Score: " + team.teamInfo.score}</div>
                    <div>
                      <div>{"Members: "}</div>
                      {Object.keys(team.teamInfo.members).map((key) =>
                        <div>{team.teamInfo.members[key].name}</div>
                      )}
                    </div>
                  </Col>
                )}
              </Row>
            </Container>
          </div>
        )
        break;

    }
    return (
      <div>
        {results}
      </div>
    );
  }
}


export default VictoryScreen;

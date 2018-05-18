import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Team from "./Team";
import {Col, Container, Row} from 'react-grid-system';

class TeamSetup extends Component {
  constructor(props) {
    super(props);
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
  };

  render() {
    var teams;
      teams = (
        <Container className="TeamSetup">
          <Row>
            <Col md={3}>
              <Team teamid="1"/>
            </Col>
            <Col md={3}>
              <Team teamid="2"/>
            </Col>
            <Col md={3}>
              <Team teamid="3"/>
            </Col>
            <Col md={3}>
              <Team teamid="4"/>
            </Col>
          </Row>
        </Container>
      )

    return (
      <div>
        {teams}
      </div>
    );
  }
}

export default TeamSetup;

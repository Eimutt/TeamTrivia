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

  joinTeam = (e) => {
    const database = firebaseApp.database();
    const team = database.ref("Lobbies/" + this.props.status.lobbyId);
    const members = team.child("Team" + e);
    var user = firebaseApp.auth().currentUser;
    members.push({
      id: user.uid,
      name: user.displayName,
    });
  }

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

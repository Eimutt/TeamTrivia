import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Team from "./Team";
import {Col, Container, Row} from 'react-grid-system';

class TeamSetup extends Component {
  constructor(props) {
    super(props);
    // we put on state the properties we want to use and modify in the component
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
    console.log(this.state.numTeams);
  };

  joinTeam = (e) => {
    const database = firebaseApp.database();
    console.log("Lobbies/" + this.props.status.lobbyId);
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
    console.log(this.state.numTeams);
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
    /*    <div className="TeamSetup">
          <Team teamid="1"/>
          <Team teamid="2"/>
          <Team teamid="3"/>
          <Team teamid="4"/>
        </div> */
      )

    return (
      <div>
        {teams}
      </div>
    );
  }
}

export default TeamSetup;

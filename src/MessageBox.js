import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";

class MessageBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: {},
      status: 'Initail'
    }
  }


  componentDidMount() {
    var lobbyId = window.location.hash.split( '/' )[2];
    const database = firebaseApp.database();
    const messages = database.ref("Lobbies/" + lobbyId + "/messages");
    messages.on("value", (snapshot) => {
      if(snapshot.exists()){
        this.setState({
          messages: snapshot.val(),
          status: 'Loaded'
        })
      }
    })
  }

  render() {

    var messages;

    switch (this.state.status) {
      case 'Initial':

        break;
      case 'Loaded':
        messages =
          <div className="msg-wrapper">
            {Object.keys(this.state.messages).map((key) =>
              <div>{this.state.messages[key].displayName + "(" + this.state.messages[key].team.replace("0", "Spec") + "): " + this.state.messages[key].message}</div>
            )}
          </div>
    }

    return (
      <div>
        {messages}
      </div>
    );
  }
}

export default MessageBox;

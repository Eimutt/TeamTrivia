import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text : ""
    }
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = (e) => {
    this.state.text = e.target.value;
  }

  sendMessage(){
    console.log(this.props);
    const database = firebaseApp.database();
    const messages = database.ref("Lobbies/" + this.props.lobbyId + "/messages");
    messages.push({
      displayName: this.user.displayName,
      message: this.state.text
    })
    this.setState({
        text : ""
    })
    this.refs.messageInput.value = '';
  }

  componentDidMount() {
    this.user = firebaseApp.auth().currentUser;
  }

  render() {


    return (
      <div className="App">
        <input className="NameInput" type="text" ref="messageInput" placeholder="Enter Message..."  onChange={this.handleChange}></input>
        <div>
          <button type="button" class="btn btn-primary btn-sm" onClick={() => this.sendMessage()}>
            Confirm
          </button>
        </div>
      </div>
    );
  }
}

export default Chat;

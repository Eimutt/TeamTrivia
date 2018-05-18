import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";

class ChatInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text : ""
    }
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = (e) => {
    this.setState({
      text: e.target.value
    })
  }

  sendMessage(){
    console.log(this.props);
    const database = firebaseApp.database();
    const messages = database.ref("Lobbies/" + this.props.lobbyId + "/messages");
    messages.push({
      displayName: this.user.displayName,
      team: this.user.photoURL,
      message: this.state.text
    })
    this.setState({
        text : ""
    })
    this.refs.messageInput.value = '';
  }

  componentDidMount() {
    console.log(this.props);
    this.user = firebaseApp.auth().currentUser;
  }

  render() {


    return (
      <div className="divRow">
        <div>
          <input className="NameInput" type="text" ref="messageInput" maxlength="16" placeholder="Enter Message..."  onChange={this.handleChange} onKeyPress={event => {if (event.key === 'Enter' && this.state.text != "") {this.sendMessage()}}}></input>
        </div>
        <div>
          <button type="button" disabled={this.state.text === ""} class="btn btn-primary btn-sm" onClick={() => this.sendMessage()}>
            Confirm
          </button>
        </div>
      </div>
    );
  }
}

export default ChatInput;

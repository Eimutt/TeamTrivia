import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import ChatInput from "./ChatInput";
import MessageBox from "./MessageBox";

class Chat extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className="chat">
        <MessageBox lobbyId = {this.props.lobbyId}/>
        <ChatInput lobbyId = {this.props.lobbyId}/>
      </div>
    );
  }
}

export default Chat;

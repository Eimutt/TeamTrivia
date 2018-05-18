import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import GameSetup from './GameSetup';
import Lobby from './Lobby';
import firebaseApp from "./firebase";
import index from "./index.css";

class NameInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      status: '',
    }
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = (e) => {
    this.setState({
      name : e.target.value,
    })
  }

  confirmName(){
    this.props.confirmcallback(this.state.name);
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <input className="NameInput" type="text" placeholder="Enter Name..." maxlength="8" onChange={this.handleChange} onKeyPress={event => {if (event.key === 'Enter' && this.state.name != "") {this.confirmName()}}}></input>
        <div>
          <button type="button" class="btn btn-primary btn-sm" disabled={this.state.name === ""} onClick={() => this.confirmName()}>
            Confirm
          </button>
        </div>
      </div>
    );
  }
}

export default NameInput;

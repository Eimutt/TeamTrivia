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
    }
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = (e) => {
    this.state.name = e.target.value;
  }

  confirmName(){
    this.props.confirmcallback(this.state.name);
  }

  componentDidMount() {
    const database = firebaseApp.database();
    database.ref("Lobby").child("Team").child("member").on("value", (value) => {
      //console.log(value.val());
      var json = value.val();
      var benis = [];
      for (var key in json) {
        if (json.hasOwnProperty(key)) {
          //console.log(key + " -> " + json[key]);
          var temp = [];
          temp.push(json[key].id);
          temp.push(json[key].name);
          temp.push(json[key].points);
          benis.push(temp);
        }
      }
      //console.log(benis);
      this.setState({
        data: benis
      })
    })
  }

  render() {


    return (
      <div className="App">
        <input className="NameInput" type="text" placeholder="Enter Name..."  onChange={this.handleChange}></input>
        <div>
          <button type="button" class="btn btn-primary btn-sm" onClick={() => this.confirmName()}>
            Confirm
          </button>
        </div>
      </div>
    );
  }
}

export default NameInput;

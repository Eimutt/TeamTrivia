import React, { Component } from 'react';
import { Route } from 'react-router-dom';
//import Welcome from './Welcome';
import GameSetup from './GameSetup';
import Lobby from './Lobby';
import firebaseApp from "./firebase";
import index from "./index.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Pick Name',
      title: 'Team Trivia',
      data: [[], []],
      displayName:  ""
    }
  }

  pickName = (name) => {
    var user = firebaseApp.auth().currentUser;
    user.updateProfile({
      displayName: name,
      photoURL: '0'
    }).then(function() {
      // Profile updated successfully!
      // "Jane Q. User"
      // "https://example.com/jane-q-user/profile.jpg"
      var photoURL = user.photoURL;
    }, function(error) {
      // An error happened.
    });
    console.log(user);
    this.setState({
      displayName : name,
      status : 'Name Chosen',
    })
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

    firebaseApp.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
    firebaseApp.auth().onAuthStateChanged(function(user) {
      if (user) {
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        console.log(user);
        // ...
      } else {
        // User is signed out.
        // ...
      }
      // ...
    });



  }

  render() {

    var namechosen;



    switch(this.state.status){
      case 'Pick Name':
      namechosen =
      <div>
        <NameInput confirmcallback={() => this.pickName()}/>
      </div>
      break;
      case 'Name Chosen':
      namechosen =
        <div>
          <Route exact path="/" displayname={this.state.displayname} component={GameSetup}/>
          <Route path="/lobby/" render={() => <Lobby displayname={this.state.displayName}/>}/>
        </div>
        break;
    }

    return (
      <div className="App">
        <header className="App-header">
          <div id="header">{this.state.title}</div>
          {namechosen}
        </header>
      </div>
    );
  }
}

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






export default App;

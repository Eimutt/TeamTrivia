import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import GameSetup from './GameSetup';
import Lobby from './Lobby';
import firebaseApp from "./firebase";
import index from "./index.css";
import NameInput from "./NameInput";

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
    this.setState({
      displayName : name,
      status : 'Name Chosen',
    })
  }

  componentDidMount() {
    firebaseApp.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
    firebaseApp.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.updateProfile({
          displayName: null,
          photoURL: '0'
        }).then(function() {
          // Profile updated successfully!
          // "Jane Q. User"
          // "https://example.com/jane-q-user/profile.jpg"
          var photoURL = user.photoURL;
        }, function(error) {
          // An error happened.
        });
      } else {
        // User is signed out.
        // ...
      }
    });
  }

  render() {
    var namechosen;
    switch(this.state.status){
      case 'Pick Name':
      namechosen =
      <div>
        <NameInput confirmcallback={this.pickName}/>
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


export default App;

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Welcome from './Welcome';
import Lobby from './Lobby';
import firebaseApp from "./firebase";
import index from "./index.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Team Trivia',
      data: [[], []],
    }
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
        <header className="App-header">
          <div id="header">{this.state.title}</div>

          <Route exact path="/" component={Welcome}/>
          <Route path="/lobby/" component={Lobby}/>

        </header>
      </div>
    );
  }
}

export default App;

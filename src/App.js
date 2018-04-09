import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Welcome from './Welcome';
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
      console.log(value.val());
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
      console.log(benis);
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
          <div>

                    {this.state.data.map((player) =>
                      <div className="UNFUCKBLS">
                        <div className="ing1">PLAYA NAME: {player[0]}</div>
                        <div className="ing2">PLAYA ID: {player[1]}</div>
                        <div className="ing3">PLAYA POINTS: {player[2]}</div>
                      </div>
                    )}

          </div>

          <Route exact path="/" component={Welcome}/>

        </header>
      </div>
    );
  }
}

export default App;

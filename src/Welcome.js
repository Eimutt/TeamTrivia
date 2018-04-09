import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Lobby from './Lobby';

class Welcome extends Component {

  handleChange = () => {
    const database = firebaseApp.database();
    const team = database.ref("Lobby").child("Team");
    const members = team.child("member")
    members.push({
      id: 1,
      name: "Emil",
      points: 5
    });
    members.push({
      id: 2,
      name: "Isak",
      points: 100
    });
  }


  render() {
    return (
      /*<div id="startview">
      	<div style={{flex: 0.2}}></div>
      	<div id="text">
      		<div style={{flex: 0.33}}>
          </div>
      		<div style={{flex: 0.33}}>
    			  <div class="btnhandler">
      		    <button id="startbutton" type="button" class="btn btn-primary btn-lg" onClick={this.handleChange} >Generate Goobers</button>
            </div>
      		</div>
      		<div style={{flex: 0.33}}></div>
      	</div>
      </div>*/
      <Lobby/>



    );
  }
}

export default Welcome;

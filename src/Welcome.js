import React, { Component } from 'react';
import './Welcome.css';
import { Link } from 'react-router-dom';

class Welcome extends Component {
  render() {
    return (
      <div id="startview">
      	<div style={{flex: 0.2}}></div>
      	<div id="text">
      		<div style={{flex: 0.33}}>

          </div>
      		<div style={{flex: 0.33}}>
      			<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
    			  <div class="btnhandler">
              <Link to = "/search">
      				  <button id="startbutton" type="button" class="btn btn-primary btn-lg">Create new dinner</button>
              </Link>
            </div>
      		</div>
      		<div style={{flex: 0.33}}></div>
      	</div>
      </div>
    );
  }
}

export default Welcome;

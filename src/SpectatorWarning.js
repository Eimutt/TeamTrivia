import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";

class SpectatorWarning extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }


  render() {
    var user = firebaseApp.auth().currentUser;
    var warning;
    if(user.photoURL == 0){
      warning =
        <div>
          {"SPECTATING (Not in a team)"}
        </div>
    }



    return (
      <div className="spectatorWarning">
        {warning}
      </div>
    );
  }
}

export default SpectatorWarning;

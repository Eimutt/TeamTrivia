import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';

class Timer extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    this.state = {
      timer: 30
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      timer: this.state.timer - 1,
    });
    if (this.state.timer < 1)
      this.props.noAnswer();
  }

  render() {
    return (
      <div>
        <h1>{"Time Left: " + this.state.timer}</h1>
        <h2></h2>
      </div>
    );
  }
}


export default Timer;

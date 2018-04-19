import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from "./firebase";
import Grid from 'react-css-grid';
import Team from "./Team";

class GridItem extends Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    this.state = {
      categoryID: this.props.categoryID,
      categoryName: this.props.categoryName,
    }
  }

  handleClick(categoryid, categoryname) {
    //console.log(this.props);
    this.props.callback1(categoryid, categoryname);
  }

  render() {
    return (
      <div className= "griditem">
        <div className="categoryname">General Knowledge</div>
        <label class="switch">
          <input type="checkbox" onClick={() => this.handleClick(9, "General Knowledge")}></input>
          <span class="slider round"></span>
        </label>
      </div>
    );
  }
}

export default GridItem;

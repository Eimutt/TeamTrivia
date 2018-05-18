import React, { Component } from 'react';
import {Col, Container, Row} from 'react-grid-system';

class GridItem extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (categoryid, categoryname) => {
    this.props.callback1(categoryid, categoryname);
  }

  render() {
    return (
      <Col md={3} className="griditem">
        <div className="categoryname">{this.props.category.name.replace("Entertainment: ", "").replace("Science: ", "")}</div>
        <label className="switch">
          <input type="checkbox" onClick={() => this.handleClick(this.props.category.id, this.props.category.name)}></input>
          <span className="slider round"></span>
        </label>
      </Col>
    )
  }
}

export default GridItem;

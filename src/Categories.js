import React, { Component } from 'react';
import firebaseApp from "./firebase";
import {Col, Container, Row} from 'react-grid-system';
import GridItem from "./GridItem";

class Categories extends React.Component {
  constructor(props) {
    super(props);
    //this.props.model.addObserver(this);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    //  <GridItem categoryID={9} categoryName={"General Knowledge"} callback1={this.handleClick}/>
    this.state = {
      categories: [],
      status: "loading"
    }
  }

  componentDidMount() {
    this.fetchCategories().then((json) => {
      this.setState({
        categories: json.trivia_categories,
        status: "ready"
      })
    });
  }

  fetchCategories = () => {
    const url = 'https://opentdb.com/api_category.php';
    return fetch(url)
      .then(this.processResponse)
      .catch(this.handleError);
  }

  processResponse = function (response) {
    if (response.ok) {
      return response.json()
    }
    throw response;
  }

  handleError = function (error) {
    if (error.json) {
      error.json().then(error => {
        console.error('fetchCategories() API Error:', error.message || error)
      })
    } else {
      console.error('fetchCategories() API Error:', error.message || error)
    }
  }

  handleClick = (categoryid, categoryname) => {
    this.props.callback(categoryid, categoryname);
  }

  render() {
    var toRender = "";
    switch (this.state.status) {
      case "loading":
        toRender = (<div className="loader"></div>);
        break;

      default:
        var categories = this.state.categories;
        var sequence = 0;
        var rowamount = (categories.length/4);
        var remainder = (categories.length % 4);
        if (remainder != 0)
          rowamount++;
        var rows = [];
        for (var i = 0; i < rowamount; i++) {
          var row = [];
          for (var j = 0; j < 4; j++) {
            row.push(categories[j+sequence*4]);
          }
          sequence++;
          rows.push(row);
        }
        toRender = (
          <div className = "CategoryContainer">
            <div className= "categoryTitle">{"Categories"}</div>
            <Container>
              {rows.map((row) =>
                <Row>
                  {row.map((currentcategory) =>
                    <GridItem category={currentcategory} callback1={this.handleClick}/>
                  )}
                </Row>
              )}
            </Container>
          </div>
        );
        break;
    }
    /*<Col sm={3} className="griditem">
      <div className="categoryname">{category.name.replace("Entertainment: ", "").replace("Science: ", "")}</div>
      <label class="switch">
        <input type="checkbox" onClick={() => this.handleClick(category.id, category.name)}></input>
        <span class="slider round"></span>
      </label>
    </Col> */
    return (
      <div>{toRender}</div>
    );
  }
}

export default Categories;

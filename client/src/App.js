import React, { Component, Fragment } from "react";
const moment = require("moment");
//import './App.css';

class App extends Component {
  // Initialize state
  state = { myTags: [] };

  // Fetch passwords after first mount
  componentDidMount() {
    this.getMyTags();
  }

  // When we scan something
  // this.getMyTags();

  getMyTags = () => {
    // Get the tags and store them in state
    fetch("/api/v1/mytags")
      .then((res) => res.json())
      .then((myTags) => this.setState({ myTags }));
  };

  render() {
    const { myTags } = this.state;

    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#">
            Streamiibo
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="./mytags">
                  My Tags <span className="sr-only">(current)</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Origin</th>
              <th>Type</th>
              <th>Health</th>
              <th>Attack</th>
              <th>Defence</th>
              <th>Speed</th>
              <th>Last Seen</th>
              <th colSpan="2"></th>
            </tr>
          </thead>
          <tbody>
            {myTags.map((tag, i) => {
              return (
                <Fragment>
                  <tr>
                    <td>{tag.name}</td>
                    <td>{tag.origin}</td>
                    <td>{tag.type}</td>
                    <td>{tag.health}</td>
                    <td>{tag.attack}</td>
                    <td>{tag.defense}</td>
                    <td>{tag.speed}</td>
                    <td>
                      {moment(tag.lastScanTime).format("MM/DD/YYYY h:mm a")}
                    </td>
                    <td>Edit</td>
                    <td>Delete</td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

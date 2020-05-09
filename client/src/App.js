import React, { Component, Fragment } from "react";
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
                    <td>{tag.lastScanTime}</td>
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

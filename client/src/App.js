import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";

// Component imports
import Navbar from "./components/Navbar";
import TagsTable from "./components/TagsTable";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <TagsTable />
        </div>
      </Router>
    );
  }
}

export default App;

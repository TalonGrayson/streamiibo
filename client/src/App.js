import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";

// Component imports
import Navbar from "./components/Navbar";
import TagsTable from "./components/TagsTable";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route path="/" exact component={TagsTable} />
        </div>
      </Router>
    );
  }
}

export default App;

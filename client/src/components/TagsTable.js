import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:8000");

const moment = require("moment");

class TagsTable extends Component {
  // Initialize state
  constructor(props) {
    super(props);
    this.state = { props: [], mostRecentChange: {} };

    this.populateTable = this.populateTable.bind(this);
    this.getMyTags = this.getMyTags.bind(this);

    socket.on("scan_detected", (msg) => {
      this.getMyTags();
    });
  }

  // Fetch passwords after first mount
  componentDidMount() {
    this.getMyTags();
  }

  populateTable = (props) => {
    this.setState({ props });
  };

  getMyTags = () => {
    // Get the tags and store them in state
    fetch("/api/v1/mytags")
      .then((res) => res.json())
      .then((props) => this.populateTable(props));
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.state.props.forEach((oldTag) => {
      const newTag = prevState.props.filter((tag) => tag.id === oldTag.id)[0];
      if (newTag) {
        for (let key of Object.keys(oldTag)) {
          if (oldTag[key] !== newTag[key]) {
            this.setState({
              mostRecentChange: {
                id: newTag.id,
                changed: key,
                changed_from: oldTag[key],
                changed_to: newTag[key],
              },
            });
            return;
          }
        }
      }
    });
  }

  render() {
    const { props } = this.state;

    return (
      <table className="table table-dark table-sm table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Origin</th>
            <th>Type</th>
            <th>Health</th>
            <th>Attack</th>
            <th>Defence</th>
            <th>Speed</th>
            <th>Light RGB</th>
            <th>Last Seen</th>
            <th colSpan="2"></th>
          </tr>
        </thead>
        <tbody>
          {props.map((tag, i) => {
            if (tag.id === this.state.mostRecentChange.id) {
              console.log(
                `This is the changed tag: ${JSON.stringify(
                  this.state.mostRecentChange
                )}`
              );
            }
            return (
              <Fragment>
                <tr
                  key={`tag_${tag.id}`}
                  className={
                    tag.id === this.state.mostRecentChange.id
                      ? "bg-success"
                      : ""
                  }
                >
                  <td key={`name_${tag.id}`}>{tag.name}</td>
                  <td key={`origin_${tag.id}`}>{tag.origin}</td>
                  <td key={`type_${tag.id}`}>{tag.type}</td>
                  <td key={`health_${tag.id}`}>{tag.health}</td>
                  <td key={`attack_${tag.id}`}>{tag.attack}</td>
                  <td key={`defense_${tag.id}`}>{tag.defense}</td>
                  <td key={`speed_${tag.id}`}>{tag.speed}</td>
                  <td key={`lightRGB_${tag.id}`}>{tag.light_rgb}</td>
                  <td key={`lastScanTime_${tag.id}`}>
                    {moment(tag.lastScanTime).format("MM/DD/YYYY h:mm a")}
                  </td>
                  <td key={`edit_${tag.id}`}>
                    <i className="fas fa-pencil-alt"></i>
                  </td>
                  <td key={`delete_${tag.id}`} id={`delete_${tag.id}`}>
                    <Link
                      to={`/api/v1/mytags/delete/${tag._id}`}
                      className="navbar-brand"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Link>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default TagsTable;

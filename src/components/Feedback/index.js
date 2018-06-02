import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../Button";

import "./styles.css";

class Feedback extends Component {
  render() {
    return (
      <div className={`feedback feedback--${this.props.type}`}>
        <div className="feedback__main">
          <div className="feedback__content">
            <div>{this.props.content}</div>
            <div className="feedback__footer">{this.props.username}</div>
          </div>
          <Button
            className="feedback__vote"
            disabled={this.props.voted}
            onClick={this.props.submitVote}
          >
            <span className="feedback__vote-count">
              {this.props.votes.length}
            </span>
            <span className="feedback__vote-label">
              {this.props.voted ? "Voted" : "Vote?"}
            </span>
          </Button>
        </div>
      </div>
    );
  }
}

Feedback.propTypes = {
  content: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["happy", "sad"]).isRequired,
  username: PropTypes.string.isRequired,
  votes: PropTypes.array.isRequired
};

Feedback.defaultProps = {
  id: "",
  type: "happy",
  content: "",
  votes: []
};

export default Feedback;

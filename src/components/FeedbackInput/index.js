import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../Button";
import InputText from "../InputText";

import "./styles.css";

class FeedbackInput extends Component {
  constructor() {
    super();

    this.state = {
      feedback: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      feedback: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    this.props.submitFeedback(this.state.feedback);

    this.setState({
      feedback: ""
    });
  }

  render() {
    return (
      <form className="feedback-input" onSubmit={this.onSubmit}>
        <div className="feedback-input__input">
          <label htmlFor={`feedback-${this.props.type}`}>Feedback</label>
          <InputText
            id={`feedback-${this.props.type}`}
            name="feedback"
            onChange={this.onChange}
            placeholder="Enter Feedback"
            value={this.state.feedback}
          />
        </div>
        <Button>Add</Button>
      </form>
    );
  }
}

FeedbackInput.propTypes = {
  submitFeedback: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["happy", "sad"])
};

FeedbackInput.defaultProps = {
  type: "happy"
};

export default FeedbackInput;

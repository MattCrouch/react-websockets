import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../Button";
import InputText from "../InputText";

import "./styles.css";

class UsernamePrompt extends Component {
  constructor() {
    super();
    this.state = {
      username: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ username: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.state.username !== "") {
      this.props.setUsername(this.state.username);
    }
  }

  render() {
    return (
      <div className="username-prompt">
        <form className="username-prompt__box" onSubmit={this.onSubmit}>
          Set a username to start adding feedback
          <label htmlFor="username">Username</label>
          <div className="username-prompt__input">
            <InputText
              autoFocus
              id="username"
              onChange={this.onChange}
              placeholder="Username"
              value={this.state.username}
            />

            <Button>Start</Button>
          </div>
        </form>
      </div>
    );
  }
}

UsernamePrompt.propTypes = {
  setUsername: PropTypes.func.isRequired
};

UsernamePrompt.defaultProps = {};

export default UsernamePrompt;

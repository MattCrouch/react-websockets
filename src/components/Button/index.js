import React, { Component } from "react";

import "./styles.css";

class Button extends Component {
  render() {
    return (
      <button
        {...this.props}
        className={`button ${this.props.className ? this.props.className : ""}`}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;

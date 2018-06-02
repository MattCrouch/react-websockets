import React, { Component } from "react";
import PropTypes from "prop-types";

import "./styles.css";

class InputText extends Component {
  render() {
    return <input {...this.props} className="input-text" type="text" />;
  }
}

InputText.propTypes = {
  onChange: PropTypes.func
};

InputText.defaultProps = {
  onChange: undefined
};

export default InputText;

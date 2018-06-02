import React, { Component } from "react";
import PropTypes from "prop-types";

import FeedbackInput from "../FeedbackInput";
import Feedback from "../Feedback";

import "./styles.css";

class Category extends Component {
  getHeading(type) {
    let emoji = "😐";

    if (type === "happy") {
      emoji = "🙂";
    } else if (type === "sad") {
      emoji = "☹️";
    }

    return (
      <span role="img" aria-label={`type`}>
        {emoji}
      </span>
    );
  }

  render() {
    return (
      <section className={`category category__${this.props.type}`}>
        <div className="category__inner">
          <h2>{this.getHeading(this.props.type)}</h2>

          {this.props.enabled && (
            <FeedbackInput
              enabled={this.props.enabled}
              submitFeedback={this.props.submitFeedback}
              type={this.props.type}
            />
          )}

          <div className="category__feedback-container">
            {this.props.feedback.map(feedback => (
              <Feedback
                key={feedback.id}
                content={feedback.content}
                type={feedback.type}
                username={feedback.username}
                submitVote={() => this.props.submitVote(feedback.id)}
                votes={feedback.votes}
                voted={
                  feedback.clientId === this.props.clientId ||
                  feedback.votes.includes(this.props.clientId)
                }
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
}

Category.propTypes = {
  enabled: PropTypes.bool.isRequired,
  feedback: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["happy", "sad"]).isRequired,
      content: PropTypes.string.isRequired,
      votes: PropTypes.array.isRequired
    })
  ).isRequired,
  submitFeedback: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["happy", "sad"])
};

Category.defaultProps = {
  type: "neutral"
};

export default Category;

// Import dependencies
import React, { Component } from "react";

// Import external modules
import CONSTANTS from "./constants";
import WebSocketConnection from "./WebSocketConnection";

// Import other components
import Category from "./components/Category";
import Loading from "./components/Loading";
import UsernamePrompt from "./components/UsernamePrompt";

// Import styles
import "./App.css";

class App extends Component {
  constructor() {
    super();

    // Set up initial state
    this.state = {
      ready: false,
      username: undefined,
      feedback: []
    };

    // Bind event listeners
    this.setUsername = this.setUsername.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  // Use componentDidMount to allow rendering without waiting for initialisation of WebSocket
  componentDidMount() {
    this.connection = new WebSocketConnection(this.onMessage);
  }

  // Save the username locally, and tell the server
  setUsername(username) {
    this.setState({
      username
    });

    this.connection.send(CONSTANTS.SET_USERNAME, username);
  }

  // Tell the server about the new feedback
  submitFeedback(type, content) {
    this.connection.send(CONSTANTS.ADD_FEEDBACK, {
      type,
      content
    });
  }

  // Tell the server about the new vote
  submitVote(id) {
    this.connection.send(CONSTANTS.ADD_VOTE, id);
  }

  // What to do when a message comes from the server
  onMessage(data) {
    switch (data.action) {
      // Populate the state for the app
      case CONSTANTS.INITIAL_STATE:
        this.setState({
          ready: true,
          id: data.payload.id,
          username: data.payload.username,
          feedback: data.payload.feedback
        });
        break;
      case CONSTANTS.FEEDBACK_ADDED:
        // Add new feedback to the state
        this.setState(prevState => ({
          feedback: [...prevState.feedback, data.payload]
        }));
        break;
      case CONSTANTS.VOTE_ADDED:
        // Find the feedback object
        const index = this.state.feedback.findIndex(
          f => f.id === data.payload.id
        );

        if (index !== -1) {
          // Add the vote to the feedback object
          this.setState(prevState => {
            const newFeedback = [...prevState.feedback];

            newFeedback[index] = {
              ...newFeedback[index],
              votes: data.payload.votes
            };

            return { feedback: newFeedback };
          });
        }
        break;
      default:
        // Do nothing
        break;
    }
  }

  // Get the good/bad type feedback separated and sorted by votes
  getFeedback(type) {
    return this.state.feedback
      .filter(feedback => feedback.type === type)
      .sort((a, b) => b.votes.length - a.votes.length);
  }

  render() {
    // Show the loading screen until the websocket is initialised
    if (!this.state.ready) {
      return <Loading />;
    }

    return (
      <div className="app">
        {/* If there has been no username provided, show a prompt to add one */}
        {!this.state.username ? (
          <UsernamePrompt setUsername={this.setUsername} />
        ) : (
          undefined
        )}

        {/* Add happy/sad feedback */}
        <div className="app__feedback">
          <Category
            clientId={this.state.id}
            enabled={this.state.username ? true : false}
            feedback={this.getFeedback("happy")}
            submitFeedback={content => this.submitFeedback("happy", content)}
            type="happy"
            submitVote={this.submitVote}
          />
          <Category
            clientId={this.state.id}
            enabled={this.state.username ? true : false}
            feedback={this.getFeedback("sad")}
            submitFeedback={content => this.submitFeedback("sad", content)}
            type="sad"
            submitVote={this.submitVote}
          />
        </div>
      </div>
    );
  }
}

export default App;

// Import dependencies
const WebSocket = require("ws");
const url = require("url");
const uuid = require("uuid/v4");

// Import constants
const CONSTANTS = require("./constants");

// Store user IDs with usernames for quick recovery
const users = {};

// Store feedback
const feedback = [];

// Create an object to store feedback from saved data
const createFeedbackObject = (clientId, type = "happy", content = "") => {
  const length = 100;
  const trimmed =
    content.length > length ? content.substr(0, length) + "..." : content;

  return {
    id: uuid(),
    clientId,
    type,
    content: trimmed,
    votes: []
  };
};

// Start the server
const server = new WebSocket.Server({ port: 8080 });

// Make sure all clients are still around
const interval = setInterval(ping, CONSTANTS.PING_INTERVAL);

// Define what happens when a client connects
server.on("connection", (client, req) => {
  // See if they have an ID already
  const {
    query: { id }
  } = url.parse(req.url, true);

  // Add client with ID
  addClient(client, id);
});

// Define what happens when a message is sent from a client
function onClientMessage(message) {
  // Decode the string to an object
  const data = JSON.parse(message);

  // Act on the defined action
  switch (data.action) {
    case CONSTANTS.ADD_FEEDBACK:
      // Store feedback
      const feedbackObj = createFeedbackObject(
        this.id,
        data.payload.type,
        data.payload.content
      );

      feedback.push(feedbackObj);

      // Tell other clients about the feedback
      broadcast(CONSTANTS.FEEDBACK_ADDED, {
        ...feedbackObj,
        username: users[feedbackObj.clientId]
      });
      break;
    case CONSTANTS.SET_USERNAME:
      // Attach a username to a client ID
      users[this.id] = data.payload;
      break;
    case CONSTANTS.ADD_VOTE:
      // Register a vote for a piece of feedback
      const index = feedback.findIndex(f => f.id === data.payload);

      // If the feedback is found
      if (index !== -1) {
        const votedOn = feedback[index];

        // Only allow users to vote once
        if (votedOn.votes.indexOf(this.id) === -1) {
          votedOn.votes.push(this.id);

          // Tell other clients a vote has been added
          broadcast(CONSTANTS.VOTE_ADDED, {
            id: votedOn.id,
            votes: votedOn.votes
          });
        }
      }
      break;
    default:
      // Do nothing
      break;
  }
}

function addClient(client, connectionId) {
  // Generate a unique ID, or use the one supplied
  const id = connectionId ? connectionId : uuid();
  client.id = id;

  // Listen for messages and pong responses
  client.on("message", onClientMessage);
  client.on("pong", pong);

  // Provide the new client with the current feedback
  client.send(
    JSON.stringify({
      action: CONSTANTS.INITIAL_STATE,
      payload: {
        id,
        username: users[id],
        feedback: feedback.map(f => ({ ...f, username: users[f.clientId] }))
      }
    })
  );
}

// Tell all clients about something happening
function broadcast(action, payload) {
  server.clients.forEach(client => {
    // Check if the client is still active
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          action,
          payload
        })
      );
    }
  });
}

// Check the client is still around
function ping() {
  server.clients.forEach(client => {
    // If the client hasn't responded since the last ping...
    if (client.isAlive === false) {
      // ...kill the connection
      client.terminate();
    }

    // If the client is still alive...
    if (client.readyState === WebSocket.OPEN) {
      // Mark them as awaiting a response
      client.isAlive = false;
      // Send the ping
      client.ping();
    }
  });
}

// What to do when the client responds to the ping
function pong() {
  // Mark them as still alive before the next set of pings
  this.isAlive = true;
}

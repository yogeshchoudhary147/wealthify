const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  access_token: {
    type: String,
    required: true,
  },
  token_type: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  expires_in: {
    type: Number,
    required: true, // The time in seconds the token is valid
  },
  scope: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true, // Store the exact expiration date
  },
});

// TTL index to auto-delete expired tokens
tokenSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

// Create the model
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;

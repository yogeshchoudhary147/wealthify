const mongoose = require("mongoose");

const useSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  panNumber: {
    type: String,
  },
});

const User = mongoose.model("User", useSchema);

module.exports = User;

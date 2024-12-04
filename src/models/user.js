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

module.exports = mongoose.model("User", useSchema);

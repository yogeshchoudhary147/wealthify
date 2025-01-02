const mongoose = require("mongoose");

// Define the schema for the OTP request
const otpRequestSchema = new mongoose.Schema(
  {
    reqId: {
      type: Number, // As per the example, reqId is a number
      required: true,
    },
    otpRef: {
      type: String, // otpRef is a string (UUID format)
      required: true,
      unique: true, // Ensuring otpRef is unique
    },
    userSubjectReference: {
      type: String,
      default: "", // Can be empty string as shown in the example
    },
    clientRefNo: {
      type: String, // clientRefNo is a string (can store dynamic values)
      required: true,
    },
    enteredOtp: {
      type: String, // enteredOtp is a string
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the model
const OtpRequest = mongoose.model("OtpRequest", otpRequestSchema);
module.exports = OtpRequest;

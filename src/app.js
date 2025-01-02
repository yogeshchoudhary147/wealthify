const express = require("express");
const connectDB = require("./config/database");
const { v4: uuidv4 } = require("uuid");
const RegexValidation = require("./utils/regexValidator");
const { fetchTokenMiddleWare } = require("./middlewares");
const MFCentral = require("./utils/mfCentral");
const fs = require("fs");
const https = require("https");
const {
  ClientId,
  EncryptionDecryptionKey,
  PrivateKey,
  PublicKey,
} = require("./config/incrementedge.json");

// Initialize the Express app
const app = express();

// Middleware for parsing JSON (optional)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, HTTPS Local Development!");
});

// define routes
app.post("/generateOTP", fetchTokenMiddleWare, async (req, res) => {
  try {
    const { pan, mobile } = req.body;

    const panValidationResult = RegexValidation.isPanValid(pan);
    if (!panValidationResult.valid) {
      return res.status(400).json({ error: panValidationResult.message });
    }

    const mobileValidationResult = RegexValidation.isMobileValid(mobile);
    if (!mobileValidationResult.valid) {
      return res.status(400).json({ error: mobileValidationResult.message });
    }

    const clientRefNo = `client-${uuidv4()}`;

    const token = req.token;

    const request = JSON.stringify({
      clientRefNo,
      pan,
      pekrn: "",
      mobile,
      email: "",
    });

    const response = await MFCentral.submitRequest(
      "https://uatservices.mfcentral.com/api/client/V1/submitcassummaryrequest",
      token,
      ClientId,
      EncryptionDecryptionKey,
      PrivateKey,
      PublicKey,
      request
    );

    res.send(response);
  } catch (error) {
    console.error("Failed to generate OTP:", error.message);
    res.status(400).send(`Error: ${error.message}`);
  }
});

app.post("/validateOTP", fetchTokenMiddleWare, async (req, res) => {
  try {
    const { reqId, otpRef, userSubjectReference, clientRefNo, enteredOtp } =
      req.body;

    const otpValidationResult = RegexValidation.isOtpValid(enteredOtp);
    if (!otpValidationResult.valid) {
      return res.status(400).json({ error: otpValidationResult.message });
    }

    const request = JSON.stringify({
      reqId,
      otpRef,
      userSubjectReference,
      clientRefNo,
      enteredOtp,
    });

    const response = await MFCentral.submitRequest(
      "https://uatservices.mfcentral.com/api/client/V1/investorconsent",
      req.token,
      ClientId,
      EncryptionDecryptionKey,
      PrivateKey,
      PublicKey,
      request
    );

    res.send(response);
  } catch (error) {
    console.error("Failed to validate OTP:", error.message);
    res.status(400).send(`Error: ${error.message}`);
  }
});

app.get("/getCASDocument", fetchTokenMiddleWare, async (req, res) => {
  try {
    const response = await MFCentral.submitRequest(
      "https://uatservices.mfcentral.com/api/client/V1/getcasdocument",
      req.token,
      ClientId,
      EncryptionDecryptionKey,
      PrivateKey,
      PublicKey,
      request
    );
  } catch (error) {
    console.error("Failed to get CAS Document:", error.message);
    res.status(400).send(`Error: ${error.message}`);
  }
});

// Load SSL options
const sslOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};

const PORT = process.env.PORT || 7777;
connectDB()
  .then(() => {
    console.log("Database connection establised...");
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`🚀 HTTPS Server running at https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected: " + err.message);
  });
